# AI Start Here - Summer Quest

Use this file when the project is copied to another PC and a new AI/Codex session needs to start quickly.

## 1. What This Project Is

Summer Quest is a local-first learning web app for two Vietnamese children:

- `girl` / Yumi: completed Grade 4, preparing for Grade 5, Princess theme.
- `boy` / Johnny: completed Grade 3, preparing for Grade 4, Robot theme.
- Runs locally on a family Windows PC.
- No cloud account, no tracking, SQLite database on disk.

Main app folder:

```text
Project Learning For Kids\summer-quest
```

Default local URL:

```text
http://127.0.0.1:3000
```

## 2. Source Of Truth

Read root docs first:

```text
Project Learning For Kids\docs\
```

Important files:

- `docs/BACKLOG.md` - current tickets and sprint status.
- `docs/SPRINT-5.md` - latest chore checklist UX brief.
- `docs/DATA_MODEL.md` - current database design notes.
- `docs/SETUP_CHILD_PC.md` - human setup guide for another PC.
- `summer-quest/AGENTS.md` - mandatory AI agent rules.
- `summer-quest/README.md` - current app structure and scripts.

Do not rely on these as latest planning docs:

```text
summer-quest\docs\BACKLOG.md
summer-quest\docs\DATA_MODEL.md
summer-quest\docs\ROADMAP.md
```

Those nested copies are older than the root `docs` versions.

## 3. Tech Stack

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript strict
- Tailwind CSS v4
- Prisma `6.19.3`
- SQLite database at `summer-quest\prisma\dev.db`
- Vitest

Next.js App Router uses async route params in this project:

```ts
type PageProps = {
  params: Promise<{ studentId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { studentId } = await params;
}
```

## 4. First Commands On A New PC

Open PowerShell or Command Prompt at the root folder:

```powershell
cd "D:\Project Learning For Kids"
```

If PowerShell blocks `npm` because `npm.ps1` is disabled, use `npm.cmd`.

Install dependencies:

```powershell
npm.cmd install --prefix summer-quest
```

Create `.env` if missing:

```powershell
Copy-Item "summer-quest\.env.example" "summer-quest\.env" -ErrorAction SilentlyContinue
```

Expected `.env`:

```text
DATABASE_URL="file:./dev.db"
```

## 5. Database Setup Choices

### Fresh PC, no old progress needed

This resets sample data and progress:

```powershell
npm.cmd run prisma:migrate
npm.cmd run prisma:seed
```

### Copy existing progress from old PC

Copy this file from old PC to new PC:

```text
summer-quest\prisma\dev.db
```

Then run only:

```powershell
npm.cmd run prisma:migrate
```

Do not run `prisma:seed` if you want to keep the copied progress.

## 6. Start The Web App

Human-friendly options:

```text
start-dev.cmd
start-dev.ps1
```

AI/Codex-friendly command from root:

```powershell
npm.cmd run dev
```

Or from app folder:

```powershell
cd "D:\Project Learning For Kids\summer-quest"
npm.cmd run dev:local
```

When ready, open:

```text
http://127.0.0.1:3000
```

Expected Next.js log:

```text
Next.js 16.2.6 (webpack)
Local: http://127.0.0.1:3000
Ready
```

## 7. Verify It Is Running

PowerShell:

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing
```

Success means HTTP status `200`.

If port 3000 is busy:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen
```

Usually the best fix is to close the old server window and start again.

## 8. Known Windows/Codex Pitfalls

### PowerShell blocks npm

Symptom:

```text
npm.ps1 cannot be loaded because running scripts is disabled on this system
```

Use:

```powershell
npm.cmd run dev
```

### Codex sandbox blocks Next.js worker spawn

Symptom:

```text
Error: spawn EPERM
```

In Codex, request escalation and rerun the same command outside the sandbox:

```powershell
npm.cmd run dev:local
```

### Dev server exits with empty logs

Run in foreground once to see the real error:

```powershell
cmd.exe /c npm.cmd run dev:local
```

## 9. Mandatory Project Rules

Before editing code, read:

```text
summer-quest\AGENTS.md
```

Do not break these rules:

- Student-facing lesson queries must include `approved: true`.
- Do not show unapproved AI lessons/quizzes to children.
- Use `prisma.$transaction` for multi-table writes.
- Date-only fields use `"YYYY-MM-DD"` strings, generated with `new Date().toLocaleDateString("sv")` or project helpers.
- Do not use `any` in TypeScript.
- White cards on themed backgrounds use inline `style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}`.
- Keep feedback child-friendly. Avoid harsh standalone messages like "Sai", "Thất bại", or "0 điểm".

## 10. Useful Commands

Run from root:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
npm.cmd run test
npm.cmd run prisma:migrate
npm.cmd run prisma:seed
npm.cmd run prisma:studio
```

Run from `summer-quest`:

```powershell
npm.cmd run dev:local
npm.cmd run build
npm.cmd run lint
npm.cmd run test
```

## 11. Quick Implementation Map

Routes:

```text
app\page.tsx                                  Student selection
app\student\[studentId]\page.tsx              Student dashboard
app\student\[studentId]\subject\[subject]     Lesson list by subject
app\student\[studentId]\lesson\[lessonId]     Lesson viewer
app\student\[studentId]\lesson\[lessonId]\quiz Quiz
app\student\[studentId]\review                Mistake review
app\parent\page.tsx                           Parent dashboard
app\parent\chores\page.tsx                    Assign chores
app\parent\review\page.tsx                    Approve AI content
app\parent\settings\page.tsx                  Student access codes
```

Key components:

```text
components\ChoreChecklist.tsx
components\ReadingLogCard.tsx
components\QuizEngine.tsx
components\MistakeReviewList.tsx
components\StudentAccessSettings.tsx
```

Key shared logic:

```text
lib\themes.ts
lib\quiz.ts
lib\progress.ts
lib\rewards.ts
lib\habits.ts
lib\student-access.ts
lib\prisma.ts
```

Database:

```text
prisma\schema.prisma
prisma\seed.ts
prisma\migrations\
```

## 12. Current Product State To Know

Implemented areas:

- Student selection.
- Student dashboards for Yumi and Johnny.
- Theme system.
- Lessons and quizzes.
- XP, coins, streak, badges, and rewards.
- Mistake review.
- Parent dashboard and AI content review.
- Chores module.
- Reading log module.
- Reading streak.
- Student access codes.
- Sprint 5 chore checklist UX: large circular checklist control plus `X/Y việc` progress pill.

Current likely next work should come from root:

```text
docs\BACKLOG.md
```

