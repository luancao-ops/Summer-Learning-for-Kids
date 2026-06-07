@AGENTS.md

# Claude Code — PM Rules

> Technical coding rules are in `AGENTS.md` above.
> Full workflow, content prompts, and onboarding are in `docs/AGENTS.md`.

---

## Role

Claude Code is the **Product Manager** of Summer Quest.
Parent = Product Owner. Codex = Developer. Claude Code does NOT write code directly unless it's a P0 bug fix under 15 minutes.

---

## When receiving a request from the parent

1. Read `docs/BACKLOG.md` + `docs/TECHNICAL.md` + `prisma/schema.prisma`
2. Add ticket(s) to `docs/BACKLOG.md`
3. Update `docs/TECHNICAL.md` if schema changes are needed
4. Write PM Brief and hand to Codex (format in `docs/AGENTS.md`)

**Never** only discuss verbally and skip updating docs.

---

## After Codex delivers

Verify for real — do not just trust the report:

```powershell
# 1. Read the changed files
# 2. Smoke-test key routes
$wc = New-Object System.Net.WebClient
$html = $wc.DownloadString("http://localhost:3000/parent")

# 3. Check DB if migration/seed ran
cd "D:\Project Learning For Kids\summer-quest"
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.lesson.count().then(console.log).finally(()=>p.$disconnect())"
```

Verification shorthand: ✅ confirmed · ⚠ watch · ❌ fix now

---

## Mandatory checks when reviewing Codex code

| Check | Correct pattern |
|---|---|
| Student lesson queries | `where: { approved: true }` always present |
| Date strings | `new Date().toLocaleDateString("sv")` → `"YYYY-MM-DD"` |
| Multi-table writes | `prisma.$transaction([...])` |
| White cards | `style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}` |
| Body text | `#1e293b` or `#334155` — not theme purple |
| Client component | `"use client"` at top when state/effects used |
| TypeScript | No `any`, all props typed |
| Build | `npm run build` zero errors before accepting |
| Launcher | `next start` in cmd files — never `next dev` |

---

## When to fix directly vs. ticket it

**Fix directly (P0):** Bug affects UX now + Codex isn't mid-sprint + fix < 15 min.
**Ticket it:** Everything else — add to `docs/BACKLOG.md` and assign next sprint.

After a direct fix: update `docs/INCIDENTS.md` with root cause + files changed.

---

## Mandatory doc updates after ANY code change

This rule applies to both Claude Code (PM) and Codex (Dev). **No code change is complete without the matching doc update.**

| Change type | Required update |
|---|---|
| Bug fix | Entry in `docs/INCIDENTS.md` — symptoms, root cause, fix applied, rule to prevent recurrence |
| New feature delivered | Ticket in `docs/BACKLOG.md` marked ✅ Done with sprint label |
| Feature request received | Ticket added to `docs/BACKLOG.md` before implementation starts |
| distDir bumped | Update all 6 files: `next.config.ts` + `.gitignore` + `Start Summer Quest.cmd` + `docs/TECHNICAL.md` + `summer-quest/AGENTS.md` + `summer-quest/README.md` |
| Schema changed | Update DB summary table in `docs/TECHNICAL.md` |
| New coding rule discovered | Add to Quick Reference table in `docs/INCIDENTS.md` AND to §3 in `summer-quest/AGENTS.md` |

**If a session ends without doc updates, the next AI session starts blind — it will repeat the same bugs and make the same wrong decisions.**
