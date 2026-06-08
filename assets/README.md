# Summer Quest — Asset Repository

> Phase 7 deliverable — folder structure and catalog schema only.
> No assets have been added yet. This repository is ready to receive extracted assets.

---

## Purpose

Central storage for all reusable educational assets — diagrams, illustrations, audio clips.
Lessons reference assets by `assetId`. Assets are never embedded directly in lesson content.

---

## Structure

```
assets/
├── README.md               ← This file
├── math/
│   ├── catalog.json        ← Asset index for math
│   ├── diagrams/           ← Number lines, shapes, charts, equations
│   └── illustrations/      ← Visual examples for word problems
├── vietnamese/
│   ├── catalog.json
│   ├── images/             ← Story illustrations, vocabulary images
│   └── illustrations/      ← Reading passage scene images
├── english/
│   ├── catalog.json
│   ├── images/             ← Vocabulary pictures, scene illustrations
│   └── audio/              ← Pronunciation clips (future)
└── science/
    ├── catalog.json
    ├── diagrams/           ← Anatomy, ecosystems, physics, water cycle
    └── illustrations/      ← Visual examples, scene illustrations
```

---

## How Assets Flow In

1. Source PDF is processed (see `docs/CONTENT_IMPORT.md` Part 4 — Asset Extraction)
2. Extracted images saved to `assets/{subject}/{type}/`
3. Catalog entry added to `assets/{subject}/catalog.json`
4. Lesson JSON references the asset: `{{asset:assetId}}`

---

## Asset ID Convention

```
{subject}-{type}-{description-slug}-{sequence}

Examples:
  math-diagram-number-line-fractions-01
  vietnamese-illustration-farm-family-02
  english-image-vocabulary-animals-05
  science-diagram-water-cycle-01
```

---

## Rules

- Never commit source PDFs here
- Never embed base64 image data in lesson JSON
- All assets must have a `catalog.json` entry before being referenced in lessons
- Asset IDs are permanent — never rename after a lesson references them
- Prefer SVG for diagrams (scalable, small file size)
- PNG for illustrations (max 800×600px, optimized for web)

---

## Current Status

| Subject | Assets catalogued | Last updated |
|---|---|---|
| math | 0 | — |
| vietnamese | 0 | — |
| english | 0 | — |
| science | 0 | — |

*(Update this table as assets are added)*

---

## Related Docs

- `docs/ASSET_MODEL.md` — full asset standards and naming rules
- `docs/CONTENT_IMPORT.md` — Part 4: Asset Extraction Workflow
- `content_repository/{subject}/extracted_assets/` — raw extracted assets before cataloguing
