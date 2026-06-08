# English Module — Developer Guide

## Quick Facts

| Key | Value |
|---|---|
| Subject DB ID | `english` |
| Current lesson count | ~61 (girl), ~11 (boy) |
| Status | Active — girl complete, boy critical shortage |
| Grades covered | 4–5 (girl), 3 seed only (boy) |

## Priority Work

Johnny (boy) English lessons are **critically incomplete** — only 11 seed lessons exist. Needs:
- `boy-g3-en-01` through `boy-g3-en-05` (25 lessons, Grade 3)
- `boy-g4-en-01` through `boy-g4-en-05` (25 lessons, Grade 4)

Reserved ID range: `boy-g3-en-x001` to `x025` (orderIndex 12–36), `boy-g4-en-x001` to `x025` (orderIndex 37–61)

## Adding New Lessons

1. Create a manifest: `summer-quest/content/manifests/batch-english-{studentTarget}-g{grade}-{n}.json`
2. Follow ID convention: `{studentTarget}-g{grade}-en-x{n}` (e.g. `boy-g3-en-x001`)
3. Check reserved ID ranges in `docs/AI_DATA_STANDARDS.md`
4. Run: `npm.cmd run content:import` from `summer-quest/`

## Content Guidelines

- Question text is in Vietnamese (children read in Vietnamese)
- English vocabulary/grammar being tested is in English
- For fill-blank: `correctAnswer` is the English word/phrase expected
- Multiple choice options should show the English options clearly
- Answer distribution: 2×A, 2×B, 2×C, 2×D per 8 MC questions

## Folder Structure

```
modules/english/
├── MODULE.md          ← Module definition
├── README.md          ← This file
├── content/           ← Future: structured lesson JSON per grade/topic
├── assets/            ← Future: vocabulary images, scene illustrations, audio clips
├── games/             ← Future: word matching, phonics games, spelling practice
└── importers/         ← Future: per-grade import scripts
```

## Related Docs

- [docs/CURRICULUM_STRUCTURE.md](../../docs/CURRICULUM_STRUCTURE.md) — grade-by-grade topic breakdown
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — lesson/question format
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — import pipeline
