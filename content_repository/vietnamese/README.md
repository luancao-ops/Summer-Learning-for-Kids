# Vietnamese Content Repository

## Status
Empty — no source PDFs processed yet.

## Planned Sources

| Source | Grade | Status |
|---|---|---|
| Tiếng Việt Grade 3 (Kết nối tri thức) | 3 | Planned |
| Tiếng Việt Grade 4 (Kết nối tri thức) | 4 | Planned |
| Tiếng Việt Grade 5 (Kết nối tri thức) | 5 | Planned |

## Folder Structure

```
vietnamese/
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
`vietnamese`

## Grade Targets
Grade 3–5 (both students)

## Content Priority

**Johnny (boy) Vietnamese is critically incomplete** — only Grade 3 batch 1–2 imported.
Process Grade 3 and Grade 4 content for `boy` first.

| Student | Missing | Priority |
|---|---|---|
| boy | Grade 3 (batches 3–5), Grade 4 (all 5 batches) | HIGH |
| girl | Complete ✅ | low |

## Content Notes

- OCR of Vietnamese text requires special attention to diacritics (tone marks)
- Common OCR errors: à/á confusion, ổ/ỗ confusion — must post-process
- Chính tả content: questions about spelling rules work well as fill-blank
- Reading comprehension: short passage (3–5 sentences) + 3–5 MC questions

## Related Docs
- [docs/CURRICULUM_STRUCTURE.md](../../docs/CURRICULUM_STRUCTURE.md) — Grade 3–5 Vietnamese topics
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — Full import workflow
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — Lesson/question format
- [modules/vietnamese/MODULE.md](../../modules/vietnamese/MODULE.md) — Module status and DB lesson counts
