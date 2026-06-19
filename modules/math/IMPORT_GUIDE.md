# Math — Import Guide

> Full pipeline: `docs/CONTENT_IMPORT.md`
> Field schema: `docs/AI_DATA_STANDARDS.md`

---

## Subject Info

| Field | Value |
|---|---|
| `subjectId` | `math` |
| DB label | "Toán" |
| Status | Active |

---

## Current Lesson Inventory (as of June 2026)

| Student | Grades | IDs taken | orderIndex range | Count |
|---|---|---|---|---|
| girl | 4 | girl-g4-math-x001–x025 | 8–32 | 25 |
| girl | 5 | girl-g5-math-x001–x025 | 33–57 | 25 |
| boy | 3 | boy-g3-math-x001–x025 | 7–31 | 25 |
| boy | 4 | boy-g4-math-x001–x025 | 32–56 | 25 |

**Next available:**
- `girl-g4-math-x026` (orderIndex 58+)
- `girl-g5-math-x026` (orderIndex 58+)
- `boy-g3-math-x026` (orderIndex 57+)
- `boy-g4-math-x026` (orderIndex 57+)

> Before generating IDs, query DB for exact highest orderIndex:
> ```powershell
> node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.lesson.findMany({where:{subjectId:'math'},select:{id:true,orderIndex:true,studentTarget:true},orderBy:{orderIndex:'desc'}}).then(r=>console.table(r)).finally(()=>p.$disconnect())"
> ```

---

## ID Convention

```
{studentTarget}-g{grade}-math-x{NNN}
```

---

## Batch File Naming

```
batch-{studentTarget}-g{grade}-math-{n}.json

Examples:
  batch-girl-g4-math-06.json
  batch-boy-g4-math-06.json
```

Place files in: `content_repository/math/lessons/`

Then copy to: `summer-quest/content/manifests/`

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

- [LESSON_CREATION_GUIDE.md](./LESSON_CREATION_GUIDE.md) — math-specific content rules
- [docs/LESSON_CREATION_GUIDE.md](../../docs/LESSON_CREATION_GUIDE.md) — Section 2 (full rules)
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — manifest schema
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — full import pipeline
