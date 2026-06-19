# Summer Quest — Content Repository Guide

> How to use the `content_repository/` folder: what it stores, what it doesn't, and why.
> Full pipeline documentation: `docs/CONTENT_IMPORT.md`

---

## Purpose

`content_repository/` stores **processed and validated** lesson JSON — after raw source materials have been extracted, and before they are imported into the database.

```
source_materials/{subject}/              ← Raw PDFs / textbooks (gitignored)
    ↓  (OCR + knowledge extraction)
content_repository/{subject}/lessons/   ← THIS FOLDER: validated JSON
    ↓  (optional staging step)
imports/{subject}/                       ← Staged batches awaiting import run
    ↓  (copy + npm run content:import)
summer-quest/content/manifests/
    ↓
summer-quest/prisma/dev.db
```

---

## Structure

```
content_repository/
├── README.md                         ← Overview + rules
├── english/
│   ├── README.md                     ← English source tracking
│   ├── lessons/                      ← Validated lesson JSON (ready to import)
│   ├── metadata/                     ← OCR output, extraction logs, source tracking
│   └── extracted_assets/             ← Images/diagrams extracted from source PDFs
├── math/
│   ├── README.md
│   ├── lessons/
│   ├── metadata/
│   └── extracted_assets/
├── vietnamese/
│   ├── README.md
│   ├── lessons/
│   ├── metadata/
│   └── extracted_assets/
└── science/
    ├── README.md
    ├── lessons/
    ├── metadata/
    └── extracted_assets/
```

---

## What Belongs Here

| Store here | Do NOT store here |
|---|---|
| Validated lesson JSON (manifests) | PDF or DOCX source files |
| OCR output text files | Raw unprocessed scans |
| Source metadata (`sources.json`) | Student progress data |
| Asset files extracted from PDFs | Database files (`.db`) |
| Extraction logs | Duplicate copies of `summer-quest/content/manifests/` |

**Rule: Never commit PDF files to this repository.** Add `*.pdf` to `.gitignore` if they are needed locally for processing.

---

## Current Status

| Subject | Source materials present | Lessons extracted | Imported to DB |
|---|---|---|---|
| English | `2 Family and Friends 5.pdf` present ⚠ | 0 (not yet extracted) | — |
| Math | None | 0 | — |
| Vietnamese | None | 0 | — |
| Science | None | 0 | — |

### ⚠ PDF Rule Violation

`content_repository/english/2 Family and Friends 5.pdf` is currently committed to the repository. This violates the documented rule in `content_repository/README.md` ("Never commit PDF files").

**Recommended action:** Add `content_repository/**/*.pdf` to the root `.gitignore`, and move the PDF to a local folder outside the repository for processing. The file has not been extracted yet — no lessons have been generated from it.

---

## Workflow: Processing a New Source PDF

1. **Locate source:** Parent provides PDF textbook or worksheet
2. **Place in source_materials:** Save to `source_materials/{subject}/` (gitignored — won't be committed)
3. **OCR + extraction:** Use AI (Claude) to extract lesson content from the PDF
   - Read the PDF pages
   - Generate structured lesson JSON following `docs/AI_DATA_STANDARDS.md`
   - Save raw OCR output to `content_repository/{subject}/metadata/`
3. **Validate:** Check JSON against schema in `docs/AI_DATA_STANDARDS.md`
4. **Store in repository:** Save validated manifest JSON to `content_repository/{subject}/lessons/`
5. **Copy to manifests folder:** Copy to `summer-quest/content/manifests/`
6. **Import:** `npm.cmd run content:import`
7. **Track:** Update `content_repository/{subject}/lessons/index.json` — set `importedToDb: true`
8. **Parent review:** Approve lessons at `/parent/review`

---

## Index File Format

Each subject's `lessons/` folder should contain an `index.json`:

```json
{
  "subject": "english",
  "batches": [
    {
      "batchId": "batch-girl-g4-en-01",
      "sourceFile": "2 Family and Friends 5.pdf",
      "pages": "1-20",
      "extractedDate": "2026-06-15",
      "lessonCount": 5,
      "importedToDb": true,
      "approvedByParent": true
    }
  ]
}
```

---

## Relationship to Other Docs

| Document | Relationship |
|---|---|
| `docs/CONTENT_IMPORT.md` | Full pipeline documentation including V2 import plans |
| `docs/AI_DATA_STANDARDS.md` | Schema and validation rules for lesson JSON |
| `summer-quest/content/README.md` | The manifests folder — final staging before DB import |
| `content_repository/README.md` | Top-level rules for this directory |
