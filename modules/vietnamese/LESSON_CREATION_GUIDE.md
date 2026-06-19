# Vietnamese Module — Lesson Creation Guide

> Full rules: `docs/LESSON_CREATION_GUIDE.md` **Section 3**
> Field schema: `docs/AI_DATA_STANDARDS.md`

This file is a quick-reference index. Read Section 3 of the full guide for all creation rules.

---

## Quick Reference

| Field | Value |
|---|---|
| `subjectId` | `vietnamese` |
| Language | Vietnamese throughout |
| Question count | 10 per lesson: 8 MC + 1 TF + 1 fill_blank |

---

## Student Scope

| Student | Grades | Phase |
|---|---|---|
| girl (Yumi) | Grade 4 (review), Grade 5 (new) | `review` / `new` |
| boy (Johnny) | Grade 3 (review), Grade 4 (new) | `review` / `new` |

---

## Skill Areas

| Skill | Topics |
|---|---|
| Grammar | Subject-predicate (CN-VN), sentence types, compound sentences |
| Spelling | d/gi/r, n/ng, diacritics, double consonants |
| Vocabulary | Từ ghép / từ láy, synonyms, antonyms, word families |
| Reading comprehension | Original passages (80–120 words) → who/what/why |
| Composition | Topic sentence, detail sentences, short paragraphs |

---

## Lesson ID Format

```
{studentTarget}-g{grade}-vi-x{NNN}

Examples:
  girl-g4-vi-x026
  boy-g3-vi-x026
```

---

## Batch File Name

```
batch-{studentTarget}-g{grade}-vi-{n}.json
```

---

## Key Rules (from Section 3)

- Context sentences must be **original** — never copied from a Vietnamese textbook
- Use familiar settings: family, school, animals, nature, food
- Grammar questions should test a single rule clearly
- Fill-blank answer is a **word or short phrase** (missing verb, connective, punctuation)

---

## Import Guide

See: [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)
