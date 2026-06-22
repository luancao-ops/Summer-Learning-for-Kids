# Wrong Answer Fix Report

**Date:** 2026-06-19
**Reviewed by:** AI Agent (Claude Sonnet 4.6)
**Input:** 35 open QuestionReport records from the Parent Dashboard + `scripts/validate-answers.js` auto-detection
**Outcome:** 17 questions fixed, 30 reports resolved, 5 reports left open for parent review

---

## Root Cause Summary

All errors in the English lessons (x002–x004) share the same root cause:

> **Off-by-one correctIndex during AI content generation.** The explanations were written correctly and name the right answer (e.g., "Câu đúng: '...' - đáp án C"), but the `correctIndex` value in the JSON manifest pointed to a different letter. After import, `correctAnswer` ended up one or more options off from where the explanation said.

The math and Vietnamese errors are a mix of:
- Same correctIndex mismatch (explanation says X, stored answer is Y)
- True/false inversion (statement is FALSE, stored as `"true"`)

---

## Fixes Applied (16 questions, 30 reports resolved)

### Subject: English — Lesson girl-g4-en-x002

| Q# | Question (short) | Was | Now | Root cause |
|---|---|---|---|---|
| q4 | "They don't like waking up early" → nghĩa là gì? | A (Họ thích…) | **D** (Họ không thích…) | correctIndex off — answer is opposite of correct |
| q8 | Câu nào SAI? (You likes…) | A (I like swimming) | **D** (You likes cooking) | correctIndex off — explanation identified D, stored A |

### Subject: English — Lesson girl-g4-en-x003

| Q# | Question (short) | Was | Now | Root cause |
|---|---|---|---|---|
| q2 | "Do they like math?" → phủ định đúng? | A (they doesn't) | **C** (they don't) | correctIndex off; "they doesn't" is grammatically wrong |
| q5 | "We don't eat meat" → nghĩa là gì? | C (đang ăn thịt) | **A** (không ăn thịt) | correctIndex off by 2 positions |
| q7 | Câu nào SAI ngữ pháp? (I doesn't…) | D (Do you have pets?) | **C** (I doesn't like…) | correctIndex off — D is grammatically correct, C is wrong |
| q8 | They ___ (not) play games | B (aren't) | **D** (don't) | correctIndex off; "aren't" wrong for negating "play" |

### Subject: English — Lesson girl-g4-en-x004

| Q# | Question (short) | Was | Now | Root cause |
|---|---|---|---|---|
| q1 | Vị trí đúng của 'always' | D (I brush my always teeth) | **C** (I always brush my teeth) | correctIndex off; D is nonsense |
| q2 | Câu nào = "thỉnh thoảng"? | B (They never watch…) | **A** (They sometimes watch…) | correctIndex off; "never" ≠ "thỉnh thoảng" |
| q3 | Sắp xếp: we/often/together/eat/lunch | A (We eat often lunch…) | **B** (We often eat lunch together) | correctIndex off; A wrong word order |
| q4 | Trạng từ tần suất CAO NHẤT? | C (Usually) | **D** (Always) | correctIndex off; Always=100%, not Usually |
| q8 | Câu đúng = "thường đi bộ đến trường" | C (Usually we go…) | **B** (We usually go…) | correctIndex off; B is correct word order |

### Subject: Math — Lesson boy-g3-math-x010

| Q# | Question (short) | Was | Now | Root cause |
|---|---|---|---|---|
| q8 | 8×6=48 → 48÷6=? | C (6) | **B** (8) | Explanation contradicted itself; 48÷6=8 is correct |

### Subject: Math — Lesson girl-g4-math-x003

| Q# | Question (short) | Was | Now | Root cause |
|---|---|---|---|---|
| q8 | 5/7 và 7/5 khác nhau thế nào? | B (5/7 tử số lớn hơn) | **C** (7/5 mẫu số=5, 5/7 mẫu số=7) | B is factually wrong (7/5 has larger numerator); C is correct |
| q9 | 3/8 và 8/3 là hai phân số giống nhau? (TF) | true | **false** | Explanation said "Sai!" but stored as true |

### Subject: Math — Lesson girl-g4-math-x005

| Q# | Question (short) | Was | Now | Root cause |
|---|---|---|---|---|
| q7 | "mười hai phần mười hai" = ? | B (1/12) | **C** (12/12 = 1) | correctIndex off; explanation correctly identified C |
| q10 | Fill blank: phân số là ___ và bằng ___ | (question text fixed) | — | **Two-blank question** with single answer field. Question text rewritten to one blank: "Phân số biểu thị phần tô màu là ___ (ghi dưới dạng a/b)." Answer "10/10" unchanged. |

### Subject: Vietnamese — Lesson girl-g4-vi-x001

| Q# | Question (short) | Was | Now | Root cause |
|---|---|---|---|---|
| q9 | "Mặt trời là từ đơn" → True/False? | true | **false** | Explanation said "Sai!" but stored as true; "mặt trời" is từ ghép |

### Subject: Vietnamese — Lesson girl-g5-vi-x024 (auto-detected, not human-reported)

| Q# | Question (short) | Was | Now | Root cause |
|---|---|---|---|---|
| q6 | Nhận định nào ĐÚNG về vườn hoa phép thuật? | A (hoa xanh = sức mạnh — WRONG) | **C** (hoa vàng = sức mạnh, hoa xanh = tàng hình — CORRECT) | correctIndex off; explanation correctly identified C but stored A |

---

## Remaining Open Reports (5) — Parent Review Required

These questions have answers that are **correct** or **defensible** — the child's report reflects misunderstanding, not a wrong answer.

| Question | Stored Answer | Assessment | Action |
|---|---|---|---|
| `girl-g4-en-x002-q10` fill_blank: `don't like` | `don't like` | Correct. "I ___ (not/like) eating spicy food." → "don't like" is right | Keep open — parent may close |
| `girl-g4-math-x005-q10` | `10/10` | Correct answer. Question text was rewritten to remove second blank (already fixed above) | Keep open for parent to confirm fix looks OK |
| `girl-g4-vi-x002-q6` | `B` (đi học) | Defensible per Gr.4 curriculum. "Áo trắng" is DT+TT phrase; "đi học" is a compound verb. Child may have expected C. | Keep open — parent to decide |
| `girl-g4-vi-x003-q10` | `âm` | Correct. "lung linh" = từ láy âm đầu. Child reported "other" with no note. | Keep open — parent may close |
| `girl-g4-vi-x007-q1` | `A` (vẽ tranh) | Correct. Child note "không có đáp án đúng" — misunderstanding: "vẽ tranh" contains the verb "vẽ" and is the only verb-containing option | Keep open — parent may close |

---

## Pattern Analysis

### English lessons x002–x004: Systematic correctIndex shift

All 11 English errors come from 3 consecutive lessons. The pattern suggests these lessons were generated in one batch where the `correctIndex` was systematically offset. The explanation text was correct, but the index was pointing 1–2 positions off.

**Evidence:** In every case, the explanation names the right answer letter (C, D, A, B) but the stored `correctAnswer` is a different letter.

### True/False inversion (2 cases)

Both `girl-g4-math-x003-q9` and `girl-g4-vi-x001-q9` are true/false questions where:
- The statement in the question is **false**
- The explanation correctly says "Sai!" 
- But `correctAnswer` was stored as `"true"`

This happens when the content generator writes `correct: true` in the manifest (meaning "it is true that the statement is false" — confusing double-negative), or simply forgets to invert for statements that are negatively phrased.

---

## Rules Added to Documentation

See updated versions of:
- `docs/01_RULES.md` — Question Validation section
- `docs/AI_DATA_STANDARDS.md` — Pre-import checklist

### Key new rules:

1. **Explanation letter must match `correctIndex`**: Before importing, verify that the letter named in `explanation` (e.g., "đáp án C") matches the `correctIndex` value (C = index 2). This single check would have caught all 11 English errors.

2. **True/False double-check**: For every `true_false` question where the statement contains a negation ("không phải", "không đúng", "sai"), explicitly verify: if the statement is FALSE, `correct` must be `false`.

3. **"Find the wrong sentence" type**: For questions asking "Câu nào SAI?", the `correctIndex` must point to the option that IS wrong, not to the options that are correct. Double-check by reading the explanation sentence and verifying it describes option [correctIndex].

4. **Two-blank fill questions banned**: A `fill_blank` question with two `___` markers and a single `answer` string is forbidden. Rewrite as one blank or split into two questions.

---

## Validate-Answers Output After Fix

```
Total checked: 2554 MC questions
  Auto-detected errors : 0   ✅
  Human-flagged (open) : 5   (intentionally left for parent review — see above)
```

The 5 remaining open reports are known issues where the stored answer is correct or defensible. Do not re-flag them as auto-detected errors.
