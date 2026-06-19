# Science & Life Skills — Import Guide

> Full pipeline: `docs/CONTENT_IMPORT.md`
> Field schema: `docs/AI_DATA_STANDARDS.md`

---

## Subject Info

| Field | Value |
|---|---|
| `subjectId` | `science_life_skills` |
| DB label | "Kỹ năng sống" |
| Status | Active |

---

## Current Lesson Inventory (as of June 2026)

| Student | Grade | IDs taken | orderIndex taken | Approved |
|---|---|---|---|---|
| girl | 5 | x001–x010 | 1–10 | false |
| boy | 4 | x001–x010 | 1–10 | false |

**Next available:** `girl-g5-sls-x011` (orderIndex 11) · `boy-g4-sls-x011` (orderIndex 11)

---

## ID Convention

```
{studentTarget}-g{grade}-sls-x{NNN}

Examples:
  girl-g5-sls-x011
  boy-g4-sls-x011
```

`sls` = science_life_skills abbreviation.

---

## Batch File Naming

```
batch-{studentTarget}-g{grade}-sls-{n}.json

Examples:
  batch-girl-g5-sls-03.json   ← 3rd girl batch (batches 01 and 02 already imported)
  batch-boy-g4-sls-03.json
```

Place files in: `content_repository/science_life_skills/lessons/`

Then copy to: `summer-quest/content/manifests/`

---

## Manifest Format (Required)

> See `docs/AI_DATA_STANDARDS.md` — "Manifest File Format" for the full schema.

Key rules for SLS manifests:
- Use `checks` array (NOT `questions`)
- `storyContext` must be a non-empty string — never `null`
- For girl: use princess/Công chúa tone in storyContext
- For boy: use engineer/Kỹ sư tone in storyContext
- `approved: false` always (parent reviews at `/parent/review`)
- 10 checks per lesson: 8 MC + 1 TF + 1 fill_blank

---

## Import Steps

```powershell
# 1. Validate JSON before copying
node -e "JSON.parse(require('fs').readFileSync('content_repository/science_life_skills/lessons/batch-girl-g5-sls-03.json','utf8'));console.log('valid')"

# 2. Copy to manifests
copy content_repository\science_life_skills\lessons\batch-girl-g5-sls-03.json summer-quest\content\manifests\

# 3. Run import (from summer-quest/)
cd summer-quest
npm run content:import

# 4. Verify lesson count
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.lesson.groupBy({by:['studentTarget','subjectId'],_count:true}).then(r=>{console.table(r);p.$disconnect()})"

# 5. Run answer validator (must show zero SLS errors)
node scripts/validate-answers.js
```

---

## Common Import Errors

| Error | Cause | Fix |
|---|---|---|
| `Cannot read properties of undefined (reading 'length')` | Manifest uses `questions` instead of `checks` | Rename `questions` → `checks`; convert to checks format |
| `Lesson storyContext must not be empty` | `storyContext: null` in manifest | Replace null with a non-empty narrative string |
| `Foreign key constraint failed` | `subjectId: "science_life_skills"` not recognized | This should not happen — subject is in DB. Verify DB. |
| JSON parse error | Unescaped `"` inside content strings | Replace dialogue `"text"` with `'text'` (single quotes) |

---

## Related Docs

- [LESSON_CREATION_GUIDE.md](./LESSON_CREATION_GUIDE.md) — topic list and content rules
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — full manifest schema
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — complete import pipeline
- [docs/LESSON_CREATION_GUIDE.md](../../docs/LESSON_CREATION_GUIDE.md) — Section 5 for SLS rules
