# Science Content Repository

## Status
Empty — Science subject not yet active in DB. Content preparation can begin, but import requires DB schema change (separate approval).

## Planned Sources

| Source | Grade | Status |
|---|---|---|
| Khoa học Grade 3 (Kết nối tri thức) | 3 | Planned |
| Khoa học Grade 4 (Kết nối tri thức) | 4 | Planned |
| Khoa học Grade 5 (Kết nối tri thức) | 5 | Planned |

## Folder Structure

```
science/
├── README.md              ← This file
├── lessons/               ← Validated lesson JSON (ready to import when DB is ready)
│   └── index.json         ← Lesson index (create when first lesson added)
├── metadata/
│   ├── sources.json       ← Source PDF registry
│   └── ocr/               ← Per-chapter OCR text output
└── extracted_assets/
    └── catalog.json       ← Asset catalog (create when first asset extracted)
```

## Subject DB ID
`science` *(not yet in Subject table — requires migration)*

## Before Importing Science Content

The `science` Subject record does not exist in the database. Before any science lessons can be imported:

1. **Get explicit parent approval** for the schema/migration change
2. Add to `prisma/schema.prisma` seed or migration: `{ id: "science", label: "Khoa học", emoji: "🔬", orderIndex: 4 }`
3. Run `npm run prisma:migrate`
4. Update student dashboard UI to show Science card
5. Then: lessons from `content_repository/science/lessons/` can be imported

**Preparing JSON in this folder is safe now — content will be ready when the DB migration is approved.**

## Grade Targets
Grade 3–5 (both students)

## Content Notes

- Science diagrams are critical — asset extraction is more important here than other subjects
- Anatomy, ecosystems, physics diagrams need clear SVG/PNG assets
- Scientific terms: Vietnamese first, with simplified English in parentheses if helpful
- Experiment descriptions work well as multi-step questions

## Related Docs
- [docs/CURRICULUM_STRUCTURE.md](../../docs/CURRICULUM_STRUCTURE.md) — Grade 3–5 Science topics
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — Full import workflow
- [docs/ASSET_MODEL.md](../../docs/ASSET_MODEL.md) — Asset standards (important for science diagrams)
- [modules/science/MODULE.md](../../modules/science/MODULE.md) — Module status
