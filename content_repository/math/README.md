# Math Content Repository

## Status
Empty — no source PDFs processed yet.

## Planned Sources

| Source | Grade | Status |
|---|---|---|
| Smart Start Math Grade 4 | 4 | Planned |
| Smart Start Math Grade 5 | 5 | Planned |
| Vietnamese MoE Math Grade 3 | 3 | Planned |

## Folder Structure

```
math/
├── README.md              ← This file
├── lessons/               ← Validated lesson JSON (ready to import)
│   └── index.json         ← Lesson index (create when first lesson added)
├── metadata/
│   ├── sources.json       ← Source PDF registry
│   └── ocr/               ← Per-chapter OCR text output
└── extracted_assets/
    └── catalog.json       ← Asset catalog (create when first asset extracted)
```

## Subject DB ID
`math`

## Grade Targets
Grade 3–5 (both students)

## Content Notes

- Vietnamese math terminology throughout
- Word problems use Vietnamese cultural context (markets, family, daily life)
- Fractions, percentages, and geometry are key Grade 4–5 topics
- Diagrams (number lines, shapes, charts) are common — asset extraction important

## Related Docs
- [docs/CURRICULUM_STRUCTURE.md](../../docs/CURRICULUM_STRUCTURE.md) — Grade 3–5 Math topics
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — Full import workflow
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — Lesson/question format
- [modules/math/MODULE.md](../../modules/math/MODULE.md) — Module status and DB lesson counts
