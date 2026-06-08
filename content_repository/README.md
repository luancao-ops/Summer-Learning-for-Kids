# Content Repository

> Permanent structured storage for all processed educational content.
> Phase 6 deliverable — folder structure only. No content imported yet.

---

## Purpose

This directory stores content **after** it has been extracted from source materials (PDFs, textbooks) and **before** it is imported into the database.

It is the bridge between raw source material and the live application.

```
Raw PDF / textbook
    ↓  (OCR + extraction)
content_repository/     ← HERE
    ↓  (npm run content:import)
summer-quest/prisma/dev.db
```

---

## What Belongs Here

| Stored here | NOT stored here |
|---|---|
| Validated lesson JSON (manifests) | PDF files |
| Extracted asset files (PNG, SVG) | DOCX or Word files |
| OCR output text files | Raw unprocessed scans |
| Source metadata (sources.json) | Student progress data |
| Asset catalog (catalog.json) | Database files |

---

## Structure

```
content_repository/
├── README.md               ← This file
├── english/
│   ├── README.md
│   ├── lessons/            ← Validated lesson JSON, ready to import
│   ├── metadata/           ← OCR output, source tracking, extraction logs
│   └── extracted_assets/   ← Images, diagrams extracted from source PDFs
├── math/
│   └── (same structure)
├── vietnamese/
│   └── (same structure)
└── science/
    └── (same structure)
```

---

## Workflow

Full documentation: `docs/CONTENT_IMPORT.md`

1. Process source PDF → OCR text + extracted images
2. Run knowledge extraction → lesson JSON
3. Validate against `docs/AI_DATA_STANDARDS.md`
4. Store validated JSON here under `{subject}/lessons/`
5. Copy to `summer-quest/content/manifests/` and run `npm run content:import`
6. Update `{subject}/lessons/index.json`: set `importedToDb: true`

---

## Current Status

| Subject | Source PDFs processed | Lessons in repository | Imported to DB |
|---|---|---|---|
| math | 0 | 0 | — |
| vietnamese | 0 | 0 | — |
| english | 0 | 0 | — |
| science | 0 | 0 | — |

*(Update this table as content is processed)*

---

## Rules

- Never commit PDF or DOCX files to this repository
- Never store student progress data here
- Always validate JSON against `docs/AI_DATA_STANDARDS.md` before storing
- Keep `index.json` up to date in each subject's `lessons/` folder
- Mark `importedToDb: true` in `index.json` after successful database import
