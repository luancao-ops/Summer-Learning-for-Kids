# Vietnamese — Import Guide

> Full pipeline: `docs/CONTENT_IMPORT.md`
> Field schema: `docs/AI_DATA_STANDARDS.md`

---

## Subject Info

| Field | Value |
|---|---|
| `subjectId` | `vietnamese` |
| DB label | "Tiếng Việt" |
| Status | Active |

---

## Current Lesson Inventory (as of June 2026)

| Student | Grades | IDs taken | orderIndex range | Count | Notes |
|---|---|---|---|---|---|
| girl | 4 | girl-g4-vi-x001–x025 | 7–31 | 25 | Complete |
| girl | 5 | girl-g5-vi-x001–x025 | 32–56 | ~26 | Complete |
| boy | 3 | boy-g3-vi-x001–x020 | 7–26 | ~20 | Batches 01–04 only |
| boy | 4 | — | — | 0 | **Not started** |

**Next available:**
- `girl-g4-vi-x026` / `girl-g5-vi-x026` (orderIndex 57+)
- `boy-g3-vi-x021` (orderIndex 27+) — batches 01–04 imported
- `boy-g4-vi-x001` (orderIndex 32+) — not started yet

> Query DB for exact highest orderIndex before generating IDs:
> ```powershell
> node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.lesson.findMany({where:{subjectId:'vietnamese'},select:{id:true,orderIndex:true,studentTarget:true},orderBy:{orderIndex:'desc'}}).then(r=>console.table(r)).finally(()=>p.$disconnect())"
> ```

---

## ID Convention

```
{studentTarget}-g{grade}-vi-x{NNN}
```

---

## Batch File Naming

```
batch-{studentTarget}-g{grade}-vi-{n}.json

Examples:
  batch-boy-g3-vi-05.json   ← next boy grade 3 batch
  batch-boy-g4-vi-01.json   ← first boy grade 4 batch (not yet started)
```

---

## Import Steps

```powershell
# From summer-quest/
npm run content:import

# Verify count
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.lesson.groupBy({by:['studentTarget','subjectId'],_count:true}).then(r=>{console.table(r);p.$disconnect()})"

# Validate answers (zero errors required)
node scripts/validate-answers.js
```

---

## Related Docs

- [LESSON_CREATION_GUIDE.md](./LESSON_CREATION_GUIDE.md) — Vietnamese-specific content rules
- [docs/LESSON_CREATION_GUIDE.md](../../docs/LESSON_CREATION_GUIDE.md) — Section 3 (full rules)
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — manifest schema
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — full import pipeline
