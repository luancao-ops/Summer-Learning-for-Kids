# Summer Quest — Technical Reference

---

## Tech Stack

| Layer | Tech | Version |
|---|---|---|
| Framework | Next.js (App Router, webpack mode) | 16.2.6 |
| UI | React | 19.2.4 |
| Language | TypeScript strict | ~5 |
| Styling | Tailwind CSS v4 | ^4 |
| ORM | Prisma | 6.19.3 |
| Database | SQLite | local file `prisma/dev.db` |
| Testing | Vitest | ^4 |

**Important config:** `distDir: ".next-build6"` in `next.config.ts` — `.next` through `.next-build5` all have NTFS permission issues (locked by running server at time of build). Do NOT change back to any of those.

**Launcher:** `Start Summer Quest.cmd` uses `next start` (production mode). See `docs/INCIDENTS.md` for why dev mode cannot be used on LAN devices.

---

## Project Structure

```
summer-quest/
├── app/
│   ├── page.tsx                                  ← Student selection
│   ├── parent/
│   │   ├── page.tsx                              ← Parent dashboard
│   │   ├── chores/page.tsx                       ← Assign chores
│   │   ├── review/
│   │   │   ├── page.tsx                          ← Approve AI content
│   │   │   └── actions.ts                        ← Server actions (approve/reject)
│   │   └── settings/page.tsx                     ← Student access codes
│   └── student/[studentId]/
│       ├── page.tsx                              ← Student dashboard
│       ├── subject/[subject]/page.tsx            ← Lesson list
│       ├── lesson/[lessonId]/page.tsx            ← Lesson viewer
│       ├── lesson/[lessonId]/quiz/page.tsx       ← Quiz
│       └── review/page.tsx                       ← Mistake review
│   └── api/
│       ├── quiz/submit/route.ts
│       ├── chores/complete/route.ts
│       ├── reading/log/route.ts
│       ├── mistakes/resolve/route.ts
│       ├── parent/approve/route.ts
│       ├── parent/chores/assign/route.ts
│       ├── parent/reset-data/route.ts
│       ├── parent/student-access/route.ts
│       ├── student/lock/route.ts
│       └── student/unlock/route.ts
├── components/
│   ├── QuizEngine.tsx
│   ├── QuestionRenderer.tsx
│   ├── ChoreChecklist.tsx
│   ├── ParentChorePlanner.tsx
│   ├── ContentReviewCard.tsx
│   ├── FeedbackMessage.tsx
│   └── RewardBanner.tsx
├── lib/
│   ├── prisma.ts                                 ← Prisma singleton
│   ├── themes.ts                                 ← Theme configs (source of truth for colors)
│   ├── quiz.ts                                   ← XP scoring, answer checking
│   ├── habits.ts                                 ← Chores + reading helpers
│   └── student-access.ts                         ← Access code logic
├── prisma/
│   ├── schema.prisma                             ← SOURCE OF TRUTH for database
│   ├── seed.ts                                   ← Initial seed data only
│   ├── dev.db                                    ← Live database (gitignored)
│   └── migrations/
└── content/
    └── manifests/                                ← JSON batches for content expansion
```

---

## Database

**Source of truth:** `prisma/schema.prisma`. The tables below are a summary; always read the schema file directly when writing queries.

| Model | Purpose |
|---|---|
| `Student` | Profile, XP, coins, streak, readingStreak, accessCodeHash |
| `ThemeConfig` | Theme visual config (stored in DB, seeded at startup) |
| `Subject` | Static: math / vietnamese / english |
| `Lesson` | Content + quiz questions, `approved` flag |
| `Question` | Quiz questions belonging to a Lesson |
| `Attempt` | Each completed quiz attempt (score, XP earned) |
| `AttemptAnswer` | Each answer within an attempt |
| `Mistake` | Unresolved wrong answers, resolved = false by default |
| `Badge` / `StudentBadge` | Badge definitions + per-student earned badges |
| `Reward` / `StudentReward` | Theme-specific unlock items |
| `ChoreTemplate` | Parent's reusable chore library |
| `ChoreAssignment` | Daily chore assigned to a student |
| `ChoreCompletion` | Student's self-report on a completed chore |
| `ReadingEntry` | Daily reading journal entry |
| `SiteConfig` | Key-value app settings (e.g. `parentPinHash`) |

**Key schema facts:**
- `Lesson.approved` defaults to **`true`** (seed data is pre-approved). AI-imported content must explicitly set `approved: false`.
- `Question.options` is a **JSON string**, not a Prisma `Json` type — always parse with `JSON.parse()`.
- `Student.id` is a plain string (`"girl"` / `"boy"`) — not auto-generated.
- Dates are stored as `"YYYY-MM-DD"` strings, never `DateTime` for date-only fields.
- No `onDelete: Cascade` on most relations — delete child records manually before parent (see INCIDENTS.md #4).

---

## Critical Coding Rules

| Rule | Pattern |
|---|---|
| Student lesson queries | Always `where: { approved: true }` — never omit |
| Dates | `new Date().toLocaleDateString("sv")` → `"YYYY-MM-DD"` |
| Multi-table writes | `prisma.$transaction([...])` always |
| White cards on theme bg | `style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}` — not `bg-white` |
| Body text in cards | `#1e293b` or `#334155` — not theme purple |
| TypeScript | Strict, no `any`, all props typed |
| Server mutations | Prefer Server Actions + `useActionState` over manual `fetch()` |
| Answer selection | `<label><input type="radio">` not `<button onClick>` |
| Touch targets | `touchAction: "manipulation"` on tappable elements |
| Pointer events | `pointer-events: none` explicit on `.deco-layer span` |
| API routes | `export const dynamic = "force-dynamic"` on parent pages |
| params in App Router | `params` is a `Promise` — always `await params` |
| Launcher | Production mode only (`next start`) — never `next dev` for family use |

---

## Theme System

Themes are resolved from `lib/themes.ts` using `student.themeId`. Never hardcode colors outside this file.

```ts
// In any page or component:
const theme = getTheme(student.themeId);   // from lib/themes.ts

// Apply CSS vars to page shell:
<div className="page-shell" style={themeStyle(theme)}>
  <div className="deco-layer">
    {theme.decorations.map(d => <span key={d}>{d}</span>)}
  </div>
  <div className="page-content">
    {/* content here */}
  </div>
</div>
```

CSS classes defined in `globals.css`: `.page-shell`, `.page-content`, `.deco-layer`, `.deco-layer span`, `.card-hero`.

---

## Content Types

```typescript
// Used in seed.ts, import scripts, and AI content generation

interface LessonSlide {
  id: string;                                   // "slide-1", "slide-2"...
  type: "text" | "example" | "visual" | "summary";
  title?: string;
  content: string;                              // Markdown
  emoji?: string;
  note?: string;
}

interface QuizOption {
  id: string;                                   // "A" | "B" | "C" | "D" | "true" | "false"
  text: string;
}

// Lesson stored in DB — content field holds the full lesson text/slides
// questions field: Question[] (separate model, onDelete: Cascade)

interface QuestionSeed {
  id: string;                                   // stable e.g. "girl-g4-math-3-q1"
  orderIndex: number;
  type: "multiple_choice" | "true_false" | "fill_blank";
  text: string;
  options: QuizOption[];                        // stored as JSON.stringify(options)
  correctAnswer: string;                        // "A" | "B" | "true" | "false" | plain text
  explanation: string;
  hint?: string;
}
```

---

## Content Import Workflow

**Rule:** Never modify `prisma/seed.ts` after children have real progress. Use manifest files.

```
summer-quest/content/manifests/your-batch.json
```

```powershell
# Import a specific batch
npm.cmd run content:import -- content/manifests/your-batch.json

# Import all manifests in the folder
npm.cmd run content:import
```

**Safety guarantees:**
- Append-only — existing lesson IDs are skipped, not overwritten
- Existing attempts, mistakes, badges, streaks are untouched
- New lessons default to `approved: false` (must set explicitly)
- Minimum 20 questions per regular lesson

**Batch size:** 5–15 lessons. Import → parent review → smoke test → next batch.

---

## Setup on a New PC

### Requirements
- Windows 10/11
- Node.js LTS 22.x or 24.x
- Chrome or Edge

### Steps

```powershell
# 1. Copy the project folder to the new PC (skip node_modules and .next-build)

# 2. Install dependencies
cd "D:\Project Learning For Kids\summer-quest"
npm.cmd install

# 3a. Fresh database (no existing progress)
npm.cmd run prisma:migrate
npm.cmd run prisma:seed

# 3b. Copy existing progress (copy dev.db from old PC first, then:)
npm.cmd run prisma:migrate
# Do NOT run prisma:seed — it would wipe progress

# 4. Build once (takes ~1 minute, only needed on first run)
npm.cmd run build

# 5. Start
npm.cmd run start:lan
```

Or just double-click `Start Summer Quest.cmd` — it builds automatically on first run.

### Verify the server is up

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing
# Expected: StatusCode 200
```

### Common Issues

| Issue | Fix |
|---|---|
| `npm.ps1 cannot be loaded` | Use `npm.cmd` instead of `npm` |
| Port 3000 busy | `Get-NetTCPConnection -LocalPort 3000 -State Listen` → kill PID |
| Lockfile / Access Denied crash | Change `distDir` in `next.config.ts` to a new name |
| App non-interactive on LAN device | Verify launcher uses `next start` not `next dev` |
| LAN device can't connect | Check Windows Firewall allows port 3000 |

### Data Backup

The entire database is in one file: `summer-quest/prisma/dev.db`. Back this up to USB/OneDrive regularly.

---

## Useful Commands

Run from `summer-quest/`:

```powershell
npm.cmd run dev:local          # Dev mode, localhost only (for Claude/Codex use)
npm.cmd run dev:lan            # Dev mode, all interfaces (avoid for family use)
npm.cmd run build              # Production build
npm.cmd run start:lan          # Production server, all interfaces (family use)
npm.cmd run lint
npm.cmd run test
npm.cmd run prisma:migrate     # Apply pending migrations
npm.cmd run prisma:seed        # Reset + re-seed (WARNING: wipes progress)
npm.cmd run prisma:studio      # Open Prisma Studio GUI at localhost:5555
npm.cmd run content:import     # Import content manifests
```
