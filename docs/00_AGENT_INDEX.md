# Summer Quest — AI Agent Index

**Read this first. Use it to find what you need. Do not read all docs.**

---

## Project in 3 Lines

Local-first learning app for 2 Vietnamese children on a family Windows PC.
- **Yumi** (`girl`, Grade 4→5) — Princess Craft Kingdom theme
- **Johnny** (`boy`, Grade 3→4) — Robot Sport Lab theme

SQLite database. No cloud. No accounts. Server: http://127.0.0.1:3000 (LAN: http://192.168.0.7:3000)

---

## Architecture in 3 Lines

Next.js 16 App Router + React 19 + Prisma 6 + SQLite.
Server Components for pages. Client Components for quiz/forms. Server Actions for mutations.
`distDir: ".next-build6"` — never change back to `.next`–`.next-build5` (all NTFS-locked).

---

## Students & Subjects

| Student | ID | Grade | Theme |
|---|---|---|---|
| Yumi | `girl` | 4→5 | Princess Craft Kingdom |
| Johnny | `boy` | 3→4 | Robot Sport Lab |

Subjects: `math` · `vietnamese` · `english`

---

## Route Map

```
/                                    student selection
/parent                              dashboard (PIN protected)
/parent/chores                       assign chores
/parent/review                       approve AI content
/parent/settings                     PIN + access codes
/parent/unlock                       PIN entry
/student/[id]                        student dashboard
/student/[id]/subject/[sub]          lesson list
/student/[id]/lesson/[lid]           lesson viewer
/student/[id]/lesson/[lid]/quiz      quiz
/student/[id]/review                 mistake review
```

---

## Document Routing

| Task | Read |
|---|---|
| Fix a bug (quiz, buttons, nav, auth) | `docs/INCIDENTS.md` FIRST |
| Write or review code | `summer-quest/AGENTS.md` |
| New feature / check tickets | `docs/BACKLOG.md` |
| Understand DB schema | `prisma/schema.prisma` |
| Setup / deployment / distDir | `docs/TECHNICAL.md` |
| UX flows, user journeys | `docs/UX_FLOW.md` |
| Content generation workflow | `docs/AGENTS.md` |
| Project goals / children's profiles | `docs/PROJECT.md` |
| Compressed critical rules | `docs/01_RULES.md` |
| Full architecture baseline | `docs/ARCHITECTURE_BASELINE.md` |
| Subject module definitions | `modules/{subject}/MODULE.md` |
| Module architecture (future) | `docs/MODULE_ARCHITECTURE.md` |
| Curriculum hierarchy (Grade 3–6) | `docs/CURRICULUM_STRUCTURE.md` |
| AI content data standards | `docs/AI_DATA_STANDARDS.md` |
| Content import pipeline | `docs/CONTENT_IMPORT.md` |
| Asset model (future) | `docs/ASSET_MODEL.md` |
| RAG architecture (future) | `docs/RAG_ARCHITECTURE.md` |
| Asset repository | `assets/README.md` + `assets/{subject}/catalog.json` |
| Future migration strategy | `docs/MIGRATION_STRATEGY.md` |
| V2 plan (phases, no-code evolution) | `docs/KNOWLEDGE_MAP.json` → this index |

---

## Task Routing

| Task | Action |
|---|---|
| Bug affecting children now (P0) | Read `INCIDENTS.md` → fix directly if < 15 min |
| New feature request | Add ticket to `BACKLOG.md` first, then implement |
| Add new lessons | Write JSON manifest → `npm run content:import` |
| Build fails with EPERM | Bump distDir in 6 files (see `INCIDENTS.md`) |
| `prisma generate` EPERM | Use `$queryRaw`/`$executeRaw` (see `INCIDENTS.md`) |
| Parent PIN / auth change | Read `lib/parent-access.ts` + `INCIDENTS.md` |
| Schema change needed | Edit `schema.prisma` + run migration + update `TECHNICAL.md` |
| Import content | Manifest in `content/manifests/` → `npm run content:import` |

---

## Critical Numbers (Quick Reference)

| Item | Value |
|---|---|
| distDir | `.next-build6` |
| DB file | `summer-quest/prisma/dev.db` |
| Student IDs | `"girl"`, `"boy"` |
| Subject IDs | `"math"`, `"vietnamese"`, `"english"` |
| Parent PIN key | `SiteConfig` table, key `"parentPinHash"` |
| Parent cookie | `sq_parent_access` (httpOnly, 8h) |
| Launcher | `Start Summer Quest.cmd` → always `next start` |
| Lesson visibility gate | `where: { approved: true }` on all student queries |
