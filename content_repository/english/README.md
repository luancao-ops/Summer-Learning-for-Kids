# English Content Repository

## Status
Empty — no source PDFs processed yet.

## Planned Sources

| Source | Grade | Status |
|---|---|---|
| Family & Friends Grade 3 | 3 | Planned |
| Family & Friends Grade 4 | 4 | Planned |
| Let's Go Grade 3 | 3 | Planned |
| Cambridge Movers Preparation | 4–5 | Planned |

## Folder Structure

```
english/
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
`english`

## Grade Targets
Grade 3–5 (both students)

## Content Priority

**Johnny (boy) English is critically incomplete** — only 11 seed lessons exist.
Process Grade 3 and Grade 4 English for `boy` first.

| Student | Missing | Priority |
|---|---|---|
| boy | Grade 3 (all 5 batches), Grade 4 (all 5 batches) | CRITICAL |
| girl | Complete ✅ | low |

## Content Notes

- Question text is in Vietnamese; English vocabulary/phrases are the content being tested
- Vocabulary images are highly valuable for English lessons — asset extraction important
- Phonics lessons: audio clips would be ideal (future — see `docs/ASSET_MODEL.md`)
- For fill-blank questions: `correctAnswer` is the English word/phrase
- CEFR A1 for Grade 3, A1–A2 for Grade 4, A2 for Grade 5

## Related Docs
- [docs/CURRICULUM_STRUCTURE.md](../../docs/CURRICULUM_STRUCTURE.md) — Grade 3–5 English topics
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — Full import workflow
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — Lesson/question format
- [modules/english/MODULE.md](../../modules/english/MODULE.md) — Module status and DB lesson counts
