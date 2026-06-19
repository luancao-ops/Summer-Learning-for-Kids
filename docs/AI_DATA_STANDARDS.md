# Summer Quest — AI Data Standards

> Standards for all AI-generated lesson and question content.
> These rules apply to any agent generating content manifests or seed data.

---

## Lesson Fields

Every lesson in a manifest must include:

| Field | Type | Rule |
|---|---|---|
| `id` | string | Stable, unique. Format: `{studentTarget}-{grade}-{subject}-{slug}`. Never reuse. |
| `subjectId` | string | One of: `math`, `vietnamese`, `english`, `science_life_skills` |
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

> ⚠️ **Use `checks`, not `questions`.** The import script (`lib/content-import.ts`) reads a `checks` array with `options: string[]` and `correctIndex`/`correct`/`answer`. The old `questions` format with `correctAnswer: "A"` does NOT work and causes import failure.

```json
{
  "version": 1,
  "batchId": "batch-{studentTarget}-g{grade}-{subject}-{n}",
  "defaults": {
    "approved": false,
    "minimumQuestions": 10
  },
  "lessons": [
    {
      "id": "{studentTarget}-g{grade}-{subject}-x{NNN}",
      "subjectId": "math",
      "studentTarget": "girl",
      "grade": 4,
      "phase": "review",
      "orderIndex": 10,
      "title": "...",
      "learningObjective": "...",
      "shortExplanation": "...",
      "content": "...",
      "storyContext": "...",
      "checks": [
        {
          "type": "multiple_choice",
          "text": "Question text?",
          "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
          "correctIndex": 1,
          "explanation": "Why B is correct...",
          "hint": "Optional hint..."
        },
        {
          "type": "true_false",
          "text": "True/false statement?",
          "correct": false,
          "explanation": "Why this is false...",
          "hint": "Optional hint..."
        },
        {
          "type": "fill_blank",
          "text": "Con cần uống ___ ly nước mỗi ngày.",
          "answer": "6 đến 8",
          "explanation": "The correct answer is...",
          "hint": "Optional hint..."
        }
      ]
    }
  ]
}
```

### Manifest field notes

| Field | Notes |
|---|---|
| `batchId` | Unique batch identifier. Naming convention: `batch-{studentTarget}-g{grade}-{subject}-{n}` |
| `defaults.approved` | `false` for all AI-generated content (parent must approve at `/parent/review`) |
| `storyContext` | **Must be a non-empty string.** The import validator rejects empty or null storyContext. |
| `checks[].options` | **Array of strings** for MC — NOT objects. `["Option A", "Option B", "Option C", "Option D"]` |
| `checks[].correctIndex` | **0-based integer** for MC: `0`=A, `1`=B, `2`=C, `3`=D |
| `checks[].correct` | **Boolean** for true_false: `true` or `false` |
| `checks[].answer` | **String** for fill_blank — the exact expected answer text |
| `rewardConfig` | Not a manifest field — the import script computes this from `defaults.coins` / `defaults.bonusCoins` |

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
| girl-g5-sls | girl-g5-sls-x001 to x010 | 1–10 |
| boy-g4-sls | boy-g4-sls-x001 to x010 | 1–10 |

When adding new batches, start IDs and orderIndex values after the highest reserved value above.

---

## Knowledge Package Standard

A Knowledge Package is the structured, permanent form of an imported textbook. It lives at:

```
imports/{subject}/grade{N}/{BookSlug}/
```

All 6 files are required before a Knowledge Package is considered complete:

| File | Purpose | Required |
|---|---|---|
| `manifest.json` | Package identity, source metadata, completeness status, parent review record | ✅ |
| `curriculum.json` | Unit/chapter map — titles, page ranges, topics, learning objectives, skills | ✅ |
| `vocabulary.json` | All vocabulary words: `word`, `partOfSpeech`, `definition`, `example`, `vietnameseHint` | ✅ |
| `grammar.json` | All grammar structures: form tables, examples, common errors, teaching notes, Vietnamese notes | ✅ |
| `assessment_seed.json` | Question topics and stems per unit — input for quiz generation, NOT actual quizzes | ✅ |
| `assets.json` | Asset inventory: descriptions, types, page estimates, extraction status | ✅ |

### manifest.json Schema

```json
{
  "packageId": "{subject}-g{N}-{BookSlug}",
  "sourceId": "src-{subject}-g{N}-{title-slug}",
  "title": "Book Title",
  "subject": "{subject}",
  "grade": {N},
  "publisher": "Publisher Name",
  "targetStudents": ["girl", "boy"],
  "extractedAt": "YYYY-MM-DD",
  "status": "knowledge-extracted",
  "files": {
    "curriculum": true,
    "vocabulary": true,
    "grammar": true,
    "assessmentSeed": true,
    "assets": true
  },
  "parentReview": {
    "reviewedAt": "YYYY-MM-DD",
    "approvedUnits": [1, 2, 3, 4],
    "skippedUnits": [],
    "notes": ""
  },
  "lessonsGenerated": {
    "count": 0,
    "importedToDb": false,
    "importedAt": null,
    "manifestFiles": []
  }
}
```

### assessment_seed.json Schema

Per-unit seed data for quiz generation. This is NOT a quiz manifest — it is source material for writing questions.

```json
{
  "packageId": "{subject}-g{N}-{BookSlug}",
  "units": [
    {
      "unit": 1,
      "unitTitle": "Unit title",
      "assessmentTopics": [
        "Topic 1 — describe what concept to assess",
        "Topic 2"
      ],
      "questionStems": [
        "Stem question 1?",
        "Stem question 2 — ___ is the answer.",
        "True or false: statement here."
      ],
      "vocabularyPriority": ["word1", "word2", "word3"],
      "grammarPatterns": ["Pattern 1 name", "Pattern 2 name"],
      "skillAreas": ["vocabulary-meaning", "grammar-application", "reading-comprehension"]
    }
  ]
}
```

### Rules

| Rule | Detail |
|---|---|
| Use KP, not PDF | Once a Knowledge Package exists, all lesson generation reads from `imports/`, not the PDF |
| Vietnamese hints required | Every vocabulary word must have `vietnameseHint` — students are native Vietnamese speakers |
| assessment_seed ≠ quiz | Stems in assessment_seed are inputs for generating questions, never stored in the DB directly |
| Assets may be unextracted | Set `extracted: false` when PDF rendering tools are unavailable; catalogue expected assets anyway |
| Incomplete KP = blocked | Do not generate lessons from a KP that is missing any of the 6 required files |
