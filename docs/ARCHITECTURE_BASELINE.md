# Summer Quest — Architecture Baseline

> Phase 0 baseline snapshot. Documents the current production state before any V2 evolution work.
> DO NOT modify the items described here without following V2 safety rules.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router (webpack mode) | 16.2.6 |
| UI | React | 19.2.4 |
| Language | TypeScript strict | ~5 |
| Styling | Tailwind CSS v4 | ^4 |
| ORM | Prisma | 6.19.3 |
| Database | SQLite (local file) | — |
| Testing | Vitest | ^4 |

**Build output directory:** `distDir: ".next-build9"` (`.next` through `.next-build7` are NTFS-locked)

---

## Current Architecture

```
Next.js App Router
├── Server Components (pages that query DB)
│   └── export const dynamic = "force-dynamic" on live-data pages
├── Client Components ("use client" — quiz, forms, interactive UI)
├── Server Actions (mutations via useActionState)
├── API Routes (REST endpoints for client-side fetches)
└── Prisma ORM → SQLite (prisma/dev.db)
```

### Rendering pattern
- Static at build time: none (all pages query live DB)
- Dynamic server-rendered: all pages
- Client-side: quiz engine, chore checklist, parent planner, pin/auth forms

---

## Database Models

Full source of truth: `prisma/schema.prisma`

| Model | Purpose | Key fields |
|---|---|---|
| `Student` | Profile + progress | `id` (plain string), `xp`, `coins`, `streak`, `readingStreak`, `accessCodeHash` |
| `ThemeConfig` | Visual theme config | Seeded; links to Student and Reward |
| `Subject` | Static subject definitions | `id`: `math` / `vietnamese` / `english` / `science_life_skills` |
| `Lesson` | Content unit + quiz container | `approved` flag (gate for student visibility), `studentTarget`, `grade`, `phase` |
| `Question` | Quiz questions | `type`: `multiple_choice`/`true_false`/`fill_blank`; `options` stored as JSON string |
| `Attempt` | Completed quiz record | `score`, `xpEarned`, `coinsEarned` |
| `AttemptAnswer` | Per-question answer within attempt | `isCorrect` |
| `Mistake` | Unresolved wrong answer | `resolved` flag; basis for mistake review |
| `Badge` / `StudentBadge` | Badge definitions + per-student earned | condition-based award |
| `Reward` / `StudentReward` | Theme unlocks | per-theme items |
| `ChoreTemplate` | Reusable chore library | parent-managed |
| `ChoreAssignment` | Daily chore assigned to student | `dueDate`, `dueSession` |
| `ChoreCompletion` | Student's self-report | `level` field |
| `ReadingEntry` | Daily reading journal | `bookTitle`, `pagesRead`, `summary` |
| `SiteConfig` | Key-value app settings | `parentPinHash` stored here |
| `QuestionReport` | Student/parent flag on a question | `questionId`, `lessonId`, `studentId`, `reason`, `note`, `resolved`; added Sprint 8 via raw SQL migration |

**Key schema constraints:**
- `Lesson.approved` defaults `true` (seed data). AI-imported content must set `false`.
- `Question.options` is a JSON **string** — always `JSON.parse()` before use.
- `Student.id` is `"girl"` or `"boy"` — plain string, not auto-generated.
- No `onDelete: Cascade` on most relations — child records must be deleted manually first.
- Dates stored as `"YYYY-MM-DD"` strings (not `DateTime`).
- `SiteConfig` and `QuestionReport` must be accessed via `$queryRaw`/`$executeRaw` — `prisma generate` was not re-run after Sprint 8 schema addition (EPERM while server running).

---

## Current Students

| ID | Name | Grade transition | Theme |
|---|---|---|---|
| `girl` | Yumi | Grade 4 → 5 | Princess Craft Kingdom |
| `boy` | Johnny | Grade 3 → 4 | Robot Sport Lab |

---

## Current Subjects

| ID | Label | Students |
|---|---|---|
| `math` | Toán | both |
| `vietnamese` | Tiếng Việt | both |
| `english` | English | both |
| `science_life_skills` | Kỹ năng sống | both |

---

## Routes

### Student-facing pages
| Route | Purpose |
|---|---|
| `/` | Student selection |
| `/student/[studentId]` | Student dashboard |
| `/student/[studentId]/subject/[subject]` | Lesson list |
| `/student/[studentId]/lesson/[lessonId]` | Lesson viewer |
| `/student/[studentId]/lesson/[lessonId]/quiz` | Quiz engine |
| `/student/[studentId]/review` | Mistake review |

### Parent pages (PIN protected)
| Route | Purpose |
|---|---|
| `/parent` | Parent overview dashboard |
| `/parent/chores` | Assign daily chores |
| `/parent/review` | Approve AI-generated content |
| `/parent/settings` | Access codes + PIN management |
| `/parent/unlock` | PIN entry screen |

### API routes
| Route | Method | Purpose |
|---|---|---|
| `/api/quiz/submit` | POST | Save quiz result, award XP/coins/badges |
| `/api/chores/complete` | POST | Mark chore completed |
| `/api/reading/log` | POST | Log reading entry |
| `/api/mistakes/resolve` | POST | Mark mistake resolved |
| `/api/parent/approve` | POST | Approve lesson |
| `/api/parent/chores/assign` | POST | Assign chore to student |
| `/api/parent/reset-data` | POST | Reset student progress (dev tool) |
| `/api/parent/student-access` | POST | Set student access code |
| `/api/parent/unlock` | POST | Validate PIN, set cookie |
| `/api/parent/set-pin` | POST/DELETE | Set or remove parent PIN |
| `/api/student/lock` | POST | Lock student account |
| `/api/student/unlock` | POST | Unlock with access code |
| `/api/report-question` | POST | Submit a flag/report on a quiz question (Sprint 8) |

---

## Key Source Files

```
summer-quest/
├── prisma/schema.prisma          ← DB source of truth
├── prisma/dev.db                 ← Live database (gitignored)
├── prisma/seed.ts                ← Initial seed only (never re-run with live data)
├── lib/
│   ├── prisma.ts                 ← Prisma singleton
│   ├── themes.ts                 ← All theme colors/config (source of truth)
│   ├── quiz.ts                   ← XP scoring, answer checking
│   ├── habits.ts                 ← Chores + reading helpers
│   ├── student-access.ts         ← Access code logic
│   ├── parent-access.ts          ← Parent PIN helpers (SHA-256, cookies)
│   ├── content-import.ts         ← Manifest import logic
│   └── avatar.ts                 ← Avatar tier helpers (pure, no "use client")
├── components/
│   ├── QuizEngine.tsx            ← Main quiz UI (client)
│   ├── QuestionRenderer.tsx      ← Per-question render (client)
│   ├── ChoreChecklist.tsx        ← Student chore UI (client)
│   ├── ParentChorePlanner.tsx    ← Parent chore assignment (client)
│   ├── ContentReviewCard.tsx     ← Approve/reject lessons (client, Server Actions)
│   ├── ParentUnlockForm.tsx      ← PIN entry form (client)
│   ├── ParentPinSetup.tsx        ← Set/change/remove PIN (client)
│   ├── FeedbackMessage.tsx       ← Quiz feedback (client)
│   ├── RewardBanner.tsx          ← XP/coin reward animation (client)
│   └── ResolveReportButton.tsx   ← Resolve a QuestionReport (client, useActionState) — Sprint 8
├── app/globals.css               ← CSS utilities: page-shell, deco-layer, card-hero
├── content/manifests/            ← JSON lesson batches (import source)
└── scripts/                      ← import-lessons.ts, etc.
```

---

## Content Import System

New lessons are never added directly to `seed.ts`. Instead:
1. Write a manifest file in `summer-quest/content/manifests/batch-*.json`
2. Run `npm run content:import`
3. Import is append-only — existing lesson IDs are skipped
4. New lessons land with `approved: false` unless manifest sets `approved: true`
5. Parent approves at `/parent/review` before children see

---

## Theme System

Two themes defined in `lib/themes.ts`:

| Theme ID | Name | Student |
|---|---|---|
| `princess_craft_kingdom` | Princess Craft Kingdom | Yumi (girl) |
| `robot_sport_lab` | Robot Sport Lab | Johnny (boy) |

Each theme carries: colors, decorations (emojis), feedback vocabulary, reward types.
Applied via CSS vars (`themeStyle(theme)`) on `.page-shell`.

---

## Authentication

- **Students:** Optional access code (hashed, stored in `Student.accessCodeHash`)
- **Parent dashboard:** Optional PIN (hashed via SHA-256, stored in `SiteConfig` key `parentPinHash`). Cookie: `sq_parent_access` (httpOnly, 8h). No PIN = open access.

---

## Launcher

`Start Summer Quest.cmd` — double-click to run. Builds on first run, then `next start --hostname 0.0.0.0 --port 3000`. Always production mode. Never `next dev` for family use.

---

## Current Limitations

| Limitation | Notes |
|---|---|
| Fixed 2 students | `"girl"` and `"boy"` are hardcoded IDs; no UI to add students |
| 4 subjects | math / vietnamese / english / science_life_skills (Kỹ năng sống) |
| No grade 5+ or 6+ content yet | Lessons exist for grades 3-5 across subjects |
| No image/asset support | Lesson content is Markdown text only; no images embedded |
| Flat lesson structure | No Book → Unit → Lesson hierarchy; flat list per subject |
| No RAG / vector search | All content loaded directly from SQLite |
| No PDF import pipeline | New content requires manual AI generation + JSON manifest |
| No multi-family support | Single SQLite file; no accounts or tenant isolation |
| Content approval manual | Parent must manually review each AI-generated lesson |
| No scheduled/adaptive sequencing | Lessons shown in orderIndex order; no spaced repetition |

---

## Sprint 8 Additions (2026-06-09)

### New DB Model: `QuestionReport`
Students and parents can flag quiz questions with wrong answers or explanations. Migration applied via `prisma migrate deploy`. Accessed only via raw SQL because `prisma generate` EPERM while server running.

```
Fields: id, questionId, lessonId, studentId (optional), reportedBy, reason, note, resolved, createdAt
Indexes: (resolved, createdAt), (questionId)
```

### New API Route: `POST /api/report-question`
Accepts: `{ questionId, lessonId, reportedBy, reason, studentId?, note? }`. Uses `prisma.$executeRaw`.

### New Component: `ResolveReportButton.tsx`
Client component at `/parent/review`. Uses `useActionState(resolveReportAction, null)`. Server action in `app/parent/review/actions.ts`.

### QuizEngine Changes
Added flag/report UI in `components/QuizEngine.tsx`: appears after feedback when `readyForNext === true`. Three phases: `idle` → `open` → `done`.

### Parent Dashboard Changes
`app/parent/page.tsx` and `app/parent/review/page.tsx` now query `QuestionReport` and surface unresolved flags prominently.

### Audit Script Enhancement
`scripts/validate-answers.js` now includes CHECK 3 (human-flagged questions from `QuestionReport` table).
