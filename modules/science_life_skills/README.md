# Science & Life Skills Module — Developer Guide

## Quick Facts

| Key | Value |
|---|---|
| Subject DB ID | `science_life_skills` |
| Current lesson count | 20 (10 per student, approved: false) |
| Status | Active — Subject in DB, first 20 lessons imported |
| Grades covered | Grade 4–5 (both students) |
| Distinct from | `modules/science/` (Khoa học — curriculum science) |

## Adding More Lessons

The module is active. To add new lessons:

1. Create content using the lesson creation guide: `modules/science_life_skills/LESSON_CREATION_GUIDE.md`
2. See `modules/science_life_skills/IMPORT_GUIDE.md` for ID ranges, batch naming, and import steps
3. Next available IDs: `girl-g5-sls-x011` / `boy-g4-sls-x011` (orderIndex 11+)

## Content Guidelines

- All content in Vietnamese
- Tone: gentle, encouraging, never shame-based
- For girl (Yumi): imaginative, princess/fairy-tale language
- For boy (Johnny): logical, robot/engineer language
- For both: neutral encouraging tone
- See full rules: `modules/science_life_skills/LESSON_CREATION_GUIDE.md`

## Folder Structure

```
modules/science_life_skills/
├── MODULE.md                  ← Module definition and status
├── README.md                  ← This file
├── LESSON_CREATION_GUIDE.md   ← Full content creation rules
├── content/                   ← Lesson JSON files (when created)
├── assets/                    ← Icons and illustrations
├── games/                     ← Future: habit-building mini-games
└── importers/                 ← Future: batch import scripts

content_repository/science_life_skills/
├── hygiene/
├── food_and_drink/
├── home_habits/
└── communication/
```

## Related Docs

- [modules/science_life_skills/LESSON_CREATION_GUIDE.md](./LESSON_CREATION_GUIDE.md) — content rules and topic list
- [docs/LESSON_CREATION_GUIDE.md](../../docs/LESSON_CREATION_GUIDE.md) — cross-subject lesson guide
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — lesson/question JSON format
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — import pipeline
- [modules/science/MODULE.md](../science/MODULE.md) — separate curriculum science module (Khoa học)
