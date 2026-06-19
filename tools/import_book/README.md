# Book Import System

> Governs how physical textbooks and PDF materials enter the Summer Quest knowledge base.
> Read this before processing any source material.
> For the step-by-step workflow: `import_workflow.md`

---

## Why PDFs Are Not Used Directly

A PDF is a **presentation format**, not a knowledge format. Reading raw PDF pages at runtime:

- Consumes 10–50× more AI context tokens than structured JSON
- Cannot be searched, filtered, or chunked efficiently
- Is not repeatable — the same knowledge must be re-extracted every session
- Cannot be validated for accuracy, grade level, or content standards
- May contain copyrighted text that should never reach the application database

**Rule:** A PDF is a one-time source input. Once processed, the PDF is never read again. The Knowledge Package is the permanent artifact.

---

## Why Knowledge Packages Exist

A **Knowledge Package** is the structured, validated, token-efficient form of a source book. It contains:

| File | Purpose |
|---|---|
| `manifest.json` | Package identity, source metadata, completeness status |
| `curriculum.json` | Unit/chapter map — topics, learning objectives, skills |
| `vocabulary.json` | All vocabulary with definitions, examples, Vietnamese hints |
| `grammar.json` | All grammar structures with forms, examples, common errors |
| `assessment_seed.json` | Question stems and topics for quiz generation (NOT actual quizzes) |
| `assets.json` | Inventory of images/diagrams — extraction status and priority |

An AI agent generating 10 lessons from this package reads only the relevant unit sections (~5–10 KB) instead of scanning a 20 MB PDF repeatedly.

---

## Where PDFs Are Stored

```
source_materials/
├── english/
│   └── 2 Family and Friends 5.pdf     ← raw, gitignored
├── math/
├── vietnamese/
└── science/
```

PDFs are **gitignored** — they exist only on the local processing machine. They are never committed to the repository.

See root `.gitignore`: `source_materials/**/*.pdf`

---

## Where Knowledge Packages Are Stored

```
imports/{subject}/grade{N}/{BookSlug}/
├── manifest.json
├── curriculum.json
├── vocabulary.json
├── grammar.json
├── assessment_seed.json
└── assets.json
```

**Example (current):**
```
imports/english/grade5/FamilyandFriend5/
```

Knowledge Packages are committed to the repository. They are the permanent, shareable form of the extracted knowledge.

---

## Architecture Diagram

```
source_materials/{subject}/
    [PDF — local only, gitignored]
         │
         ▼
  tools/import_book/          ← You are here
    import_workflow.md
         │
         ▼
  Knowledge Package
  imports/{subject}/grade{N}/{BookSlug}/
    manifest.json
    curriculum.json
    vocabulary.json
    grammar.json
    assessment_seed.json
    assets.json
         │
         ▼
  content_repository/{subject}/lessons/
    [validated lesson JSON batches]
         │
         ▼
  summer-quest/content/manifests/
    [staged for DB import]
         │
         ▼
  npm run content:import
         │
         ▼
  summer-quest/prisma/dev.db
    [Lesson + Question records]
         │
         ▼
  /parent/review
    [Parent approves]
         │
         ▼
  Children learn ✅
```

---

## Subject Ownership

Each subject module owns its own import pipeline:

| Subject | PDF Source Location | Knowledge Package Location | Module Docs |
|---|---|---|---|
| English | `source_materials/english/` | `imports/english/grade{N}/` | `modules/english/MODULE.md` |
| Math | `source_materials/math/` | `imports/math/grade{N}/` | `modules/math/MODULE.md` |
| Vietnamese | `source_materials/vietnamese/` | `imports/vietnamese/grade{N}/` | `modules/vietnamese/MODULE.md` |
| Science | `source_materials/science/` | `imports/science/grade{N}/` | `modules/science/MODULE.md` |

---

## Current Knowledge Packages

| Package | Subject | Grade | Status | Path |
|---|---|---|---|---|
| Family and Friends 5 | English | 5 | ✅ Extracted | `imports/english/grade5/FamilyandFriend5/` |

---

## Related Documents

| Document | Purpose |
|---|---|
| `import_workflow.md` | Step-by-step import process |
| `docs/CONTENT_IMPORT.md` | Full pipeline including DB import |
| `docs/AI_DATA_STANDARDS.md` | Knowledge Package schema + lesson generation standards |
| `docs/CONTENT_REPOSITORY_GUIDE.md` | content_repository/ storage guide |
| `modules/{subject}/MODULE.md` | Per-subject status and grade coverage |
