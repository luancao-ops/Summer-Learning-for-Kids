# Math Module — Lesson Creation Guide

> Full rules: `docs/LESSON_CREATION_GUIDE.md` **Section 2**
> Field schema: `docs/AI_DATA_STANDARDS.md`

This file is a quick-reference index. Read Section 2 of the full guide for all creation rules.

---

## Quick Reference

| Field | Value |
|---|---|
| `subjectId` | `math` |
| Language | Vietnamese throughout |
| Question language | Vietnamese |
| Content language | Vietnamese |
| Question count | 10 per lesson: 8 MC + 1 TF + 1 fill_blank |

---

## Student Scope

| Student | Grades | Phase |
|---|---|---|
| girl (Yumi) | Grade 4 (review), Grade 5 (new) | `review` / `new` |
| boy (Johnny) | Grade 3 (review), Grade 4 (new) | `review` / `new` |

---

## Lesson ID Format

```
{studentTarget}-g{grade}-math-x{NNN}

Examples:
  girl-g4-math-x026   (next after x001–x025)
  girl-g5-math-x026
  boy-g3-math-x026
  boy-g4-math-x026
```

See `docs/AI_DATA_STANDARDS.md` — "Lesson ID Ranges" for reserved ranges.

---

## Batch File Name

```
batch-{studentTarget}-g{grade}-math-{n}.json

Examples:
  batch-girl-g5-math-06.json
  batch-boy-g4-math-06.json
```

---

## Key Rules (from Section 2)

- Every MC question must include **one numeric distractor** — a common calculation error
- Fill-blank answer must be a **number or short expression** (never an open-ended sentence)
- True/false questions should test a **common misconception**
- Use real objects as context: food, toys, money, distances, time

---

## Import Guide

See: [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)
