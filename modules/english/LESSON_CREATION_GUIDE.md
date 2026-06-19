# English Module — Lesson Creation Guide

> Full rules: `docs/LESSON_CREATION_GUIDE.md` **Section 4**
> Field schema: `docs/AI_DATA_STANDARDS.md`

This file is a quick-reference index. Read Section 4 of the full guide for complete rules on each skill type.

---

## Quick Reference

| Field | Value |
|---|---|
| `subjectId` | `english` |
| Question language | Vietnamese |
| Content | English (dialogue, passage, or grammar examples) |
| Question count | 10 per lesson: 8 MC + 1 TF + 1 fill_blank |

---

## 4 Skill Types — Each Lesson Covers Exactly One Skill

| Skill | Code | Focus | ID pattern |
|---|---|---|---|
| Listening | `lis` | Comprehension of a dialogue/transcript | `{target}-g{N}-en-lis-x{NNN}` |
| Speaking | `spe` | Phonics, word stress, minimal pairs | `{target}-g{N}-en-spe-x{NNN}` |
| Reading | `rea` | Comprehension of an English passage | `{target}-g{N}-en-rea-x{NNN}` |
| Writing | `wri` | Grammar, sentence construction | `{target}-g{N}-en-wri-x{NNN}` |

---

## Student Scope

| Student | Grades | Phase |
|---|---|---|
| girl (Yumi) | Grade 4 (review), Grade 5 (new) | `review` / `new` |
| boy (Johnny) | Grade 3 (review), Grade 4 (new) | `review` / `new` |

---

## Skill Balance Per 20 Lessons

| Skill | Target count |
|---|---|
| Reading | 7–8 |
| Writing | 5–6 |
| Listening | 3–4 |
| Speaking | 2–3 |

---

## Batch File Names

```
batch-{target}-g{grade}-en-lis-{n}.json
batch-{target}-g{grade}-en-spe-{n}.json
batch-{target}-g{grade}-en-rea-{n}.json
batch-{target}-g{grade}-en-wri-{n}.json
```

---

## Key Points Per Skill

### Listening
- Include full dialogue transcript with speaker labels
- At least 6 of 8 MC must reference specific lines from the transcript
- Fill-blank: a word from the transcript the child must recall

### Speaking
- All questions must be text-representable — no audio required
- Test phonics rules, word stress, minimal pairs
- Fill-blank: complete a minimal pair or phonics pattern

### Reading
- English passage 150–200 words with Vietnamese comprehension questions
- At least 5 of 8 MC answerable only by reading the passage
- Fill-blank: a key word or phrase from the passage

### Writing
- At least 4 of 8 MC must identify the grammatically correct sentence
- Distractors must represent errors children actually make
- Fill-blank: correct written form (tense, preposition, article)

---

## Import Guide

See: [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)
