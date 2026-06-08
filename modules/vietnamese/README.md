# Vietnamese Module — Developer Guide

## Quick Facts

| Key | Value |
|---|---|
| Subject DB ID | `vietnamese` |
| Current lesson count | ~51 (girl), ~16 (boy) |
| Status | Active — girl complete, boy incomplete |
| Grades covered | 3–5 (girl), 3 partial (boy) |

## Priority Work

Johnny (boy) Vietnamese lessons are **incomplete**. The following batches still need to be generated and imported:
- `boy-g3-vi-03`, `boy-g3-vi-04`, `boy-g3-vi-05` (15 lessons, Grade 3)
- `boy-g4-vi-01` through `boy-g4-vi-05` (25 lessons, Grade 4)

Reserved ID range: `boy-g3-vi-x011` to `x025` (orderIndex 12–31), `boy-g4-vi-x001` to `x025` (orderIndex 32–56)

## Adding New Lessons

1. Create a manifest: `summer-quest/content/manifests/batch-vietnamese-{studentTarget}-g{grade}-{n}.json`
2. Follow ID convention: `{studentTarget}-g{grade}-vi-x{n}` (e.g. `boy-g3-vi-x011`)
3. Check reserved ID ranges in `docs/AI_DATA_STANDARDS.md`
4. Run: `npm.cmd run content:import` from `summer-quest/`

## Content Guidelines

- All content in Vietnamese
- Chính tả questions: focus on common errors (tr/ch, s/x, r/d/gi, l/n, dấu câu)
- Reading comprehension: use short passages with 3–5 questions
- Fill-blank works well for grammar and vocabulary drills
- Answer distribution: 2×A, 2×B, 2×C, 2×D per 8 MC questions

## Folder Structure

```
modules/vietnamese/
├── MODULE.md          ← Module definition
├── README.md          ← This file
├── content/           ← Future: structured lesson JSON per grade/topic
├── assets/            ← Future: reading passage images, story illustrations
├── games/             ← Future: word games, spelling drills
└── importers/         ← Future: per-grade import scripts
```

## Related Docs

- [docs/CURRICULUM_STRUCTURE.md](../../docs/CURRICULUM_STRUCTURE.md) — grade-by-grade topic breakdown
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — lesson/question format
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — import pipeline
