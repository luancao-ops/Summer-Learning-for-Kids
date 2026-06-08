# Math Module — Developer Guide

## Quick Facts

| Key | Value |
|---|---|
| Subject DB ID | `math` |
| Current lesson count | ~56 (girl), ~56 (boy) |
| Status | Active — content in DB |
| Grades covered | 3–5 |

## Adding New Lessons

1. Create a manifest: `summer-quest/content/manifests/batch-math-{studentTarget}-g{grade}-{n}.json`
2. Follow ID convention: `{studentTarget}-g{grade}-math-x{n}` (e.g. `girl-g5-math-x026`)
3. Check reserved ID ranges in `docs/AI_DATA_STANDARDS.md` before assigning IDs
4. Run: `npm.cmd run content:import` from `summer-quest/`

## Content Guidelines

- All content in Vietnamese
- Word problems must use real-life Vietnamese context
- Diagrams referenced by assetId (future) — currently text-only
- Answer distribution: 2×A, 2×B, 2×C, 2×D per 8 MC questions, no consecutive repeats

## Folder Structure

```
modules/math/
├── MODULE.md          ← Module definition (this directory)
├── README.md          ← This file
├── content/           ← Future: structured lesson JSON per grade/topic
├── assets/            ← Future: diagrams, charts, number lines
├── games/             ← Future: math games (number puzzles, calculation drills)
└── importers/         ← Future: per-grade import scripts
```

## Related Docs

- [docs/CURRICULUM_STRUCTURE.md](../../docs/CURRICULUM_STRUCTURE.md) — grade-by-grade topic breakdown
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — lesson/question format
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — import pipeline
