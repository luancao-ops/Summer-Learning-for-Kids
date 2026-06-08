/**
 * Validate MC correctAnswer fields in the database.
 *
 * CHECK 1 — Explicit letter contradiction (all subjects)
 * Detects cases where the explanation explicitly names a DIFFERENT option letter
 * as the correct answer than what is stored in correctAnswer.
 *
 *   correctAnswer="B", explanation="đáp án đúng là C"  → flag
 *
 * CHECK 2 — Fraction mismatch (math lessons only)
 * Extracts the final fraction mentioned in the explanation and compares it with
 * the stored correctAnswer option text. This catches cases like:
 *   correctAnswer="C" (option text "4/5"), explanation says "phân số là 4/9"
 *   → flags because 4/9 matches option D, not C
 *
 * What is NOT detected (still needs manual/parent review):
 * - Language/grammar questions where the wrong option is described without
 *   naming a letter or fraction (e.g., "Nhanh nhẹn là tính từ" without saying "C")
 * - Ambiguous explanations that show intermediate steps with fractions before
 *   simplifying (e.g., "= 3/6 = 1/2" — the validator checks the LAST fraction only)
 *
 * See INCIDENTS.md: Incident 2026-06-08 (letter contradictions) and
 *                   Incident 2026-06-08 (fraction mismatches).
 *
 * Usage:
 *   node scripts/validate-answers.js                  (all lessons)
 *   node scripts/validate-answers.js girl-g4-math     (filter by lessonId prefix)
 */

const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// ── Check 1: explicit letter mention ─────────────────────────────────────────

const CORRECT_ANSWER_PHRASES = [
  /đáp án đúng là ([ABCD])/i,
  /câu đúng là ([ABCD])/i,
  /câu trả lời đúng là ([ABCD])/i,
  /chọn ([ABCD]) vì/i,
  /đáp án ([ABCD]) là đúng/i,
  /chính xác là ([ABCD])/i,
];

function checkLetterContradiction(correctAnswer, explanation) {
  if (!explanation) return null;
  for (const pattern of CORRECT_ANSWER_PHRASES) {
    const match = explanation.match(pattern);
    if (match) {
      const mentioned = match[1].toUpperCase();
      if (mentioned !== correctAnswer) {
        return { check: 'letter', mentioned };
      }
    }
  }
  return null;
}

// ── Check 2: fraction mismatch (math only) ────────────────────────────────────

/**
 * Extract the "final answer" fraction from an explanation.
 *
 * Strategy (in priority order):
 * 1. Explicit phrase: "phân số là X/Y", "viết là X/Y", "chỉ có X/Y là ..."
 *    → use the LAST occurrence so intermediate steps are skipped
 * 2. Last "= X/Y." that ends a calculation sentence (not inside a note)
 * 3. No fraction found → return null (skip this question)
 *
 * False-positive guards:
 * - Strips "(Lưu ý: ...)" parenthetical notes before searching
 * - "Quy đồng" questions: uses last "= X/Y" only (not first intermediate)
 * - Comparison questions listing wrong options ("A, B, C đều lớn hơn"):
 *   the final "= X/Y" after a minus sign or "còn lại" is preferred
 */
function extractFinalFraction(explanation) {
  if (!explanation) return null;

  // Strip parenthetical notes that mention fractions as counter-examples
  const cleaned = explanation.replace(/\([^)]*\)/g, '');

  // Priority 1: explicit concluding phrases — take the LAST match
  const highPriorityPattern = /(?:phân số là|viết là|kết quả là|còn lại là|chỉ có)\s+(\d+\/\d+)/gi;
  const highMatches = [...cleaned.matchAll(highPriorityPattern)];
  if (highMatches.length > 0) {
    return highMatches[highMatches.length - 1][1];
  }

  // Priority 2: last "= X/Y" terminated by period or end-of-string
  const eqPattern = /=\s*(\d+\/\d+)\s*[.;,]?\s*$/;
  const eqMatch = cleaned.match(eqPattern);
  if (eqMatch) return eqMatch[1];

  // Priority 3: last "= X/Y" anywhere (handles "= 2/6 = 1/2" by taking 1/2)
  const allEq = [...cleaned.matchAll(/=\s*(\d+\/\d+)/g)];
  if (allEq.length > 0) {
    return allEq[allEq.length - 1][1];
  }

  return null;
}

function checkFractionMismatch(correctAnswer, explanation, options) {
  const finalFrac = extractFinalFraction(explanation);
  if (!finalFrac) return null;

  const correctOpt = options.find(o => o.id === correctAnswer);
  const correctText = (correctOpt?.text || '').trim();

  // If the extracted fraction matches the stored correct option text → all good
  if (finalFrac === correctText) return null;

  // If the extracted fraction matches a DIFFERENT option → flag
  const matchingOpt = options.find(o => o.text.trim() === finalFrac);
  if (matchingOpt && matchingOpt.id !== correctAnswer) {
    return { check: 'fraction', finalFrac, matchingOptId: matchingOpt.id };
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const filter = process.argv[2];

  const questions = await p.question.findMany({
    where: {
      type: 'multiple_choice',
      ...(filter ? { lessonId: { startsWith: filter } } : {}),
    },
    select: {
      id: true,
      lessonId: true,
      orderIndex: true,
      correctAnswer: true,
      explanation: true,
      options: true,
    },
    orderBy: [{ lessonId: 'asc' }, { orderIndex: 'asc' }],
  });

  const errors = [];

  for (const q of questions) {
    const opts = JSON.parse(q.options || '[]');

    // Check 1: explicit letter contradiction (all subjects)
    const letterIssue = checkLetterContradiction(q.correctAnswer, q.explanation);
    if (letterIssue) {
      errors.push({
        ...q,
        type: 'LETTER',
        suggestion: letterIssue.mentioned,
        detail: `explanation says "${letterIssue.mentioned}"`,
      });
      continue; // don't double-report the same question
    }

    // Check 2: fraction mismatch (math lessons only)
    if (q.lessonId.includes('math')) {
      const fracIssue = checkFractionMismatch(q.correctAnswer, q.explanation, opts);
      if (fracIssue) {
        errors.push({
          ...q,
          type: 'FRACTION',
          suggestion: fracIssue.matchingOptId,
          detail: `explanation ends with "${fracIssue.finalFrac}" → option ${fracIssue.matchingOptId}`,
        });
      }
    }
  }

  if (errors.length === 0) {
    console.log(`✅ All ${questions.length} MC questions checked — no answer contradictions found.`);
    console.log(`   (Checks: explicit letter mentions + math fraction endings)`);
    await p.$disconnect();
    return;
  }

  console.log(`\n❌ Found ${errors.length} answer contradiction(s):\n`);
  let currentLesson = '';
  for (const q of errors) {
    if (q.lessonId !== currentLesson) {
      currentLesson = q.lessonId;
      console.log(`  ${q.lessonId}`);
    }
    const snippet = (q.explanation || '').slice(0, 100).replace(/\n/g, ' ');
    console.log(`    Q${q.orderIndex} [${q.type}]: stored="${q.correctAnswer}" but ${q.detail}`);
    console.log(`             "${snippet}"`);
  }

  console.log(`\nTotal checked: ${questions.length} | Flagged: ${errors.length}`);
  console.log('\nTo fix: update correctAnswer in the DB to match the letter named in the explanation.');
  await p.$disconnect();
  process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
