# Summer Quest — Content Manifests

> This folder contains all lesson batch manifests ready to import into the database.
> Full import documentation: `docs/CONTENT_IMPORT.md`
> Lesson data standards: `docs/AI_DATA_STANDARDS.md`

---

## What Goes Here

JSON batch files produced by AI content generation. Each file contains 5–15 lessons for one student, one subject, and one grade.

Do NOT place PDF files, images, or raw source materials here. Those belong in `content_repository/{subject}/`.

---

## File Naming Convention

```
batch-{studentTarget}-g{grade}-{subject}-{n}.json
```

| Segment | Values | Example |
|---|---|---|
| `studentTarget` | `girl` · `boy` | `girl` |
| `grade` | `3` · `4` · `5` | `g4` |
| `subject` | `math` · `vi` · `en` · `science` | `math` |
| `n` | two-digit sequence | `01` |

**Example:** `batch-girl-g4-math-01.json`

**Note:** 4 older English-boy files use the legacy pattern `batch-english-boy-g3-{n}.json`. All new files must use the standard pattern above.

---

## Lesson ID Convention

Lesson IDs in manifests must follow this pattern to avoid import collisions:

```
{studentTarget}-g{grade}-{subjectAbbrev}-x{nnn}
```

**Example:** `girl-g4-math-x001`, `boy-g3-vi-x015`

Question IDs follow: `{lessonId}-q{n}` — e.g. `girl-g4-math-x001-q1`

---

## The `checks` Field

Every manifest must include a `checks` object:

```json
{
  "checks": {
    "answerDistribution": "balanced",
    "noConsecutiveSameAnswer": true,
    "languageLevel": "grade-appropriate",
    "contentOriginal": true
  }
}
```

This is not validated at import time (it's metadata for AI QA), but must be present to signal the batch was reviewed.

---

## Import Command

```powershell
cd summer-quest
npm.cmd run content:import
```

Import is **append-only**: existing lesson IDs are skipped. Student progress is never modified.

New lessons land with `approved: false` by default. Parent approves at `/parent/review`.

---

## Current Manifest Coverage

| Student | Grade | Math | Vietnamese | English |
|---|---|---|---|---|
| Yumi (girl) | G4 | 5 batches (01–05) | 5 batches (01–05) | 5 batches (01–05) |
| Yumi (girl) | G5 | 5 batches (01–05) | 5 batches (01–05) | 5 batches (01–05) |
| Johnny (boy) | G3 | 5 batches (01–05) | 4 batches (01–04) | 4 batches (legacy naming) |
| Johnny (boy) | G4 | 5 batches (01–05) | 0 | 0 |

*(48 manifest files total as of 2026-06-09)*

**Legacy English naming note:** Johnny G3 English files use `batch-english-boy-g3-{n}.json` (legacy pattern). All future batches must use the standard pattern: `batch-boy-g3-en-{n}.json`.
