# Science Module — Developer Guide

## Quick Facts

| Key | Value |
|---|---|
| Subject DB ID | `science` *(not yet in DB)* |
| Current lesson count | 0 |
| Status | Planned — no content yet |
| Grades covered | None yet (Grade 3–5 planned) |

## Before Starting Science Content

Science requires a DB schema change (add `science` to `Subject` table) before any content can be imported. This is a **breaking change** that requires:

1. Separate approval
2. Prisma schema edit: add `{ id: "science", label: "Khoa học", emoji: "🔬", orderIndex: 4 }` seed
3. Migration: `npm run prisma:migrate`
4. New routes: `/student/[id]/subject/science`
5. UI update: add Science card to student dashboard

**Do not create manifests until the Subject record exists in the DB.**

## When Science is Approved

1. Run migration to add `science` Subject record
2. Create manifests: `summer-quest/content/manifests/batch-science-{studentTarget}-g{grade}-{n}.json`
3. Use ID convention: `{studentTarget}-g{grade}-sci-x{n}` (e.g. `girl-g4-sci-x001`)
4. Reserve orderIndex starting from 1 (no existing lessons)

## Content Guidelines

- All content in Vietnamese
- Scientific terms: Vietnamese name first, then simplified form in parentheses if helpful
- Diagrams will be important — plan asset IDs before content (use `science-diagram-*`)
- Experiments and observations make good fill-blank questions

## Folder Structure

```
modules/science/
├── MODULE.md          ← Module definition
├── README.md          ← This file
├── content/           ← Future: structured lesson JSON per grade/topic
├── assets/            ← Future: anatomy diagrams, ecosystem charts, physics illustrations
├── games/             ← Future: classification games, experiment simulations
└── importers/         ← Future: per-grade import scripts
```

## Related Docs

- [docs/CURRICULUM_STRUCTURE.md](../../docs/CURRICULUM_STRUCTURE.md) — grade-by-grade topic breakdown
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — lesson/question format
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — import pipeline
- [docs/ASSET_MODEL.md](../../docs/ASSET_MODEL.md) — asset standards (important for science diagrams)
