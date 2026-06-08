# Summer Quest — AI Data Standards

> Standards for all AI-generated lesson and question content.
> These rules apply to any agent generating content manifests or seed data.

---

## Lesson Fields

Every lesson in a manifest must include:

| Field | Type | Rule |
|---|---|---|
| `id` | string | Stable, unique. Format: `{studentTarget}-{grade}-{subject}-{slug}`. Never reuse. |
| `subjectId` | string | One of: `math`, `vietnamese`, `english` |
| `studentTarget` | string | `"girl"` or `"boy"` |
| `grade` | int | Current grade (e.g. `4` for Grade 4) |
| `phase` | string | `"review"` for review lessons; `"new"` for new curriculum content |
| `orderIndex` | int | Determines sequence within subject+studentTarget. Must not collide with existing. |
| `title` | string | Vietnamese, child-friendly. Max 80 chars. |
| `learningObjective` | string | One clear sentence. "Sau bài này bé sẽ…" |
| `shortExplanation` | string | 1–2 sentences. Shown before quiz. |
| `content` | string | Markdown. Min 150 words. Includes examples, story context. |
| `storyContext` | string \| null | Optional narrative wrapper for the lesson. |
| `rewardConfig` | string | JSON string: `{"xp": 10, "coins": 5}` |
| `approved` | boolean | `true` for batch imports approved by parent. `false` for new AI drafts. |

---

## Question Fields

Every question must include:

| Field | Type | Rule |
|---|---|---|
| `id` | string | Stable, unique. Format: `{lessonId}-q{n}`. Never reuse. |
| `lessonId` | string | Must match parent lesson `id`. |
| `orderIndex` | int | 1-based. Determines display order. |
| `type` | string | `multiple_choice`, `true_false`, or `fill_blank` |
| `text` | string | Question text in Vietnamese. Must not be empty or null. |
| `options` | array | For MC: 4 options with `id` (`"A"`–`"D"`) and `text`. For TF: `true`/`false`. For fill: empty `[]`. |
| `correctAnswer` | string | `"A"`, `"B"`, `"C"`, `"D"`, `"true"`, `"false"`, or plain text for fill. |
| `explanation` | string | Why the answer is correct. Must not be empty or null. |
| `hint` | string \| null | Optional hint shown after wrong answer. |

---

## Answer Distribution Rule (Multiple Choice)

**Goal:** Prevent children from guessing by pattern.

Write each question so the correct answer is whichever option letter genuinely contains the right answer — do NOT pre-assign letters and then write content to match. The distribution guideline below applies AFTER content is written.

**Distribution guideline (loose):**
- Across 8 MC questions in a lesson, aim for roughly equal use of A, B, C, D — no single letter used more than 3 times
- No two consecutive questions may have the same correct answer letter

**NEVER use a rigid rotation pattern** (e.g., P1: A C B D A C B D). Enforcing a pattern causes AI to assign `correctAnswer` by position rather than content, creating a systematic mismatch between the `explanation` field and the `correctAnswer` field. This was the root cause of 99 wrong answers across 33 lessons (see `docs/INCIDENTS.md`: Incident 2026-06-08).

**Validation:** After every import run `node scripts/validate-answers.js` to confirm zero mismatches.

---

## Content Language Standards

| Rule | Detail |
|---|---|
| Language | Vietnamese throughout (except English subject lessons) |
| Tone | Friendly, encouraging, age-appropriate (8–10 years) |
| Examples | Real-life context — food, family, animals, daily activities |
| Length | Lesson content: 150–500 words. Question text: 10–60 words. |
| Vocabulary | Grade-level vocabulary only. Explain any unfamiliar terms. |
| No copying | Never reproduce textbook text verbatim — use original examples |

---

## Manifest File Format

```json
{
  "version": 1,
  "batchId": "batch-{subject}-{studentTarget}-{grade}-{n}",
  "defaults": {
    "approved": true,
    "minimumQuestions": 10
  },
  "lessons": [
    {
      "id": "...",
      "subjectId": "...",
      "studentTarget": "...",
      "grade": 4,
      "phase": "review",
      "orderIndex": 10,
      "title": "...",
      "learningObjective": "...",
      "shortExplanation": "...",
      "content": "...",
      "storyContext": null,
      "rewardConfig": "{\"xp\":10,\"coins\":5}",
      "questions": [ ... ]
    }
  ]
}
```

---

## Validation Checklist (Before AND After Importing)

**Before import:**
- [ ] All `id` fields are unique and not already in the database
- [ ] All `orderIndex` values do not collide with existing lessons for same `studentTarget` + `subjectId`
- [ ] No `title`, `text`, or `explanation` field is `null`, `undefined`, or empty string
- [ ] No single answer letter used more than 3 times across 8 MC questions; no two consecutive same letter
- [ ] Each lesson has exactly 10 questions (8 MC + 1 TF + 1 fill)
- [ ] `approved` field matches intent (parent has reviewed if `true`)
- [ ] Content is in Vietnamese (except English subject lessons)

**After import — mandatory:**
- [ ] Run `node scripts/validate-answers.js` — must report zero flagged questions
  - Any question where `explanation` starts with "Nhầm rồi" or "Sai -" has a wrong `correctAnswer` field and must be fixed before children can use the lesson

---

## Lesson ID Ranges (Reserved — Do Not Reuse)

| Combo | ID range | orderIndex range |
|---|---|---|
| girl-g4-math | girl-g4-math-x001 to x025 | 8–32 |
| girl-g5-math | girl-g5-math-x001 to x025 | 33–57 |
| girl-g4-vi | girl-g4-vi-x001 to x025 | 7–31 |
| girl-g5-vi | girl-g5-vi-x001 to x025 | 32–56 |
| girl-g4-en | girl-g4-en-x001 to x025 | 12–36 |
| girl-g5-en | girl-g5-en-x001 to x025 | 37–61 |
| boy-g3-math | boy-g3-math-x001 to x025 | 7–31 |
| boy-g4-math | boy-g4-math-x001 to x025 | 32–56 |
| boy-g3-vi | boy-g3-vi-x001 to x025 | 7–31 |
| boy-g4-vi | boy-g4-vi-x001 to x025 | 32–56 |
| boy-g3-en | boy-g3-en-x001 to x025 | 12–36 |
| boy-g4-en | boy-g4-en-x001 to x025 | 37–61 |

When adding new batches, start IDs and orderIndex values after the highest reserved value above.
