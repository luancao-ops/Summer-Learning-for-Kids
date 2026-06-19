# English — Import Guide

> Full pipeline: `docs/CONTENT_IMPORT.md`
> Field schema: `docs/AI_DATA_STANDARDS.md`
> Skill ID ranges: `docs/LESSON_CREATION_GUIDE.md` Section 6

---

## Subject Info

| Field | Value |
|---|---|
| `subjectId` | `english` |
| DB label | "Tiếng Anh" |
| Status | Active |

---

## Current Lesson Inventory (as of June 2026)

| Student | Approx count | Notes |
|---|---|---|
| girl | ~76 | Grade 4–5, all 4 skills, mostly reading+writing |
| boy | ~41 | Grade 3 (seed) + Grade 4 reading/writing/listening/speaking |

**Boy is severely incomplete** — only Grade 3 seed lessons from 2025. Grade 3 curriculum lessons (reading, writing, listening, speaking) and Grade 4 writing/listening/speaking are all needed.

---

## ID Conventions

Each English lesson ID includes the skill code:

```
{target}-g{N}-en-{skill}-x{NNN}

skill: lis | spe | rea | wri

Examples:
  girl-g5-en-rea-x001
  boy-g4-en-wri-x001
  boy-g4-en-lis-x001
```

**Legacy IDs** (no skill segment): `girl-g5-en-x001` through `girl-g5-en-x031` etc. exist from before the 4-skill system. Do NOT use the legacy pattern for new lessons.

---

## Skill ID Ranges

See `docs/LESSON_CREATION_GUIDE.md` Section 6 for the full reserved range table.

**Before generating IDs**, query the DB:
```powershell
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.lesson.findMany({where:{subjectId:'english'},select:{id:true,orderIndex:true,studentTarget:true},orderBy:{orderIndex:'desc'}}).then(r=>console.table(r)).finally(()=>p.$disconnect())"
```

---

## Batch File Naming

```
batch-{target}-g{grade}-en-{skill}-{n}.json

Examples:
  batch-boy-g4-en-lis-01.json
  batch-girl-g5-en-wri-01.json
  batch-boy-g3-en-rea-01.json
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

- [LESSON_CREATION_GUIDE.md](./LESSON_CREATION_GUIDE.md) — English skill quick reference
- [docs/LESSON_CREATION_GUIDE.md](../../docs/LESSON_CREATION_GUIDE.md) — Section 4 (full rules per skill)
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — manifest schema
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — full import pipeline
- [imports/english/grade5/FamilyandFriend5/](../../imports/english/grade5/FamilyandFriend5/) — Knowledge Package for English G5
