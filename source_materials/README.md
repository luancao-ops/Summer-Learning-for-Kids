# source_materials/

> Temporary local storage for raw, unprocessed educational source files.
> These files are NOT committed to the repository (gitignored).
> Full pipeline: `docs/CONTENT_IMPORT.md`

---

## Purpose

This folder holds raw source materials **before** any processing has occurred. Files here have not been OCR'd, extracted, or structured into lesson JSON.

```
source_materials/{subject}/        ← Raw PDFs, textbooks, worksheets (THIS FOLDER)
    ↓  (OCR + knowledge extraction by AI agent)
content_repository/{subject}/      ← Structured lesson JSON + metadata
    ↓  (copy + npm run content:import)
summer-quest/content/manifests/    ← DB import queue
    ↓
summer-quest/prisma/dev.db         ← Live database
```

---

## Structure

```
source_materials/
├── README.md               ← This file
├── english/                ← English textbooks, worksheets, PDFs
├── math/                   ← Math textbooks, exercise books
├── vietnamese/             ← Vietnamese language textbooks
└── science/                ← Science reference materials
```

---

## Rules

1. **Never commit PDF or DOCX files** — this folder is gitignored
2. Files here are temporary working materials — they may be deleted after processing
3. After processing a file, move the resulting JSON to `content_repository/{subject}/lessons/`
4. Track processing status in `content_repository/{subject}/README.md`

---

## Current Materials

| Subject | File | Status |
|---|---|---|
| English | `2 Family and Friends 5.pdf` | Unprocessed — move here from `content_repository/english/` |

*(Update this table as materials are added or processed)*

---

## How to Process a Source File

1. Place PDF in `source_materials/{subject}/`
2. Ask Claude to extract lesson content: "Read [file] and generate 5 lessons for Grade [N] following `docs/AI_DATA_STANDARDS.md`"
3. Validate the output JSON against the schema
4. Save validated JSON to `content_repository/{subject}/lessons/`
5. Copy to `summer-quest/content/manifests/` and run `npm.cmd run content:import`
6. Parent approves at `/parent/review`
