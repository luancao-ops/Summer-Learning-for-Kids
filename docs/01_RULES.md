# Summer Quest — Critical Rules

**Compressed reference. Read when writing or reviewing code.**
For full incident history and root causes: `docs/INCIDENTS.md`

---

## Coding Rules

| Rule | Pattern |
|---|---|
| Student lesson queries | ALWAYS `where: { approved: true }` — never omit, ever |
| Date strings | `new Date().toLocaleDateString("sv")` → `"YYYY-MM-DD"` |
| Multi-table writes | `prisma.$transaction([...])` always |
| Lesson delete | Delete `Mistake` + `Attempt` records first in `$transaction` |
| Answer selection UI | `<label><input type="radio" onChange>` — NOT `<button onClick>` |
| Server mutations | Server Actions + `useActionState` — NOT manual `fetch()` |
| White cards on theme bg | `style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}` — NOT `bg-white` |
| Body text in cards | `#1e293b` or `#334155` — never theme purple |
| Touch targets | `touchAction: "manipulation"` on all tappable elements |
| Pointer events | `pointer-events: none` explicit on `.deco-layer span` — don't rely on inheritance |
| Pure helpers | Live in `lib/*.ts` — NEVER export from `"use client"` files |
| `params` in App Router | Always `await params` before reading properties |
| Live DB queries in pages | `export const dynamic = "force-dynamic"` on every server page querying live data |

---

## Database Rules

| Rule | Detail |
|---|---|
| Lesson visibility | `approved: true` on all student-facing queries — safety gate, never skip |
| `SiteConfig` access | Use `prisma.$queryRaw` / `$executeRaw` — typed client not yet regenerated |
| `Question.options` | Stored as JSON string — always `JSON.parse()` before use |
| `Student.id` | Plain string (`"girl"` / `"boy"`) — not auto-generated |
| Migrations | Edit `schema.prisma` → run `npm run prisma:migrate` → update `docs/TECHNICAL.md` |

---

## Build & Launcher Rules

| Rule | Value |
|---|---|
| distDir | `.next-build6` — NEVER revert to `.next` through `.next-build5` |
| Launcher | `next start` (production) — NEVER `next dev` for family use |
| Build EPERM | Bump distDir name in all 6 files — do NOT fix NTFS permissions |
| 6 distDir files | `next.config.ts` · `.gitignore` · `Start Summer Quest.cmd` · `docs/TECHNICAL.md` · `summer-quest/AGENTS.md` · `summer-quest/README.md` |

---

## Content / AI Rules

| Rule | Detail |
|---|---|
| New lessons | `approved: false` in manifest — parent approves before children see |
| Import safety | Append-only — existing IDs skipped, scores/progress never touched |
| Answer distribution | Balance A/B/C/D evenly across 8 MC questions; no consecutive same position |
| Content language | Vietnamese, child-friendly, age 8–10 |
| Textbook copying | Never — use original examples with real-life context |

---

## Parent Auth Rules

| Rule | Detail |
|---|---|
| Route guard | `requireParentAccess()` on all `/parent/*` pages |
| PIN storage | `SiteConfig` table, key `parentPinHash`, SHA-256 + salt |
| Cookie | `sq_parent_access`, httpOnly, `sameSite: "lax"`, 8h expiry |
| No PIN configured | Open access (backward compatible) |

---

## Documentation Rules (Mandatory After Every Change)

| Change | Required update |
|---|---|
| Bug fix | Entry in `docs/INCIDENTS.md` (symptoms · root cause · fix · prevention rule) |
| New feature delivered | Ticket in `docs/BACKLOG.md` marked ✅ Done |
| distDir bumped | All 6 files updated |
| Schema changed | DB summary table in `docs/TECHNICAL.md` |
| New coding rule discovered | `docs/INCIDENTS.md` Quick Reference + `summer-quest/AGENTS.md` §3 |

---

## Production Safety Rule

If student progress exists in the DB, Claude Code may NOT do the following without explicit parent approval:

| Blocked | Allowed without approval |
|---|---|
| Modify `prisma/schema.prisma` | Documentation changes |
| Create migrations | Folder structure changes |
| Rename or remove DB fields/tables | Architecture planning |
| Change route contracts | New content manifests + import |

**When in doubt: document the plan, stop, wait for approval.**

---

## Top 5 Incident Prevention Rules

1. **EPERM on build** → bump distDir, never fight NTFS ACLs
2. **React not hydrating on LAN** → always `next start`, never `next dev`
3. **Stale data on page** → add `export const dynamic = "force-dynamic"` to server page
4. **Client boundary violation** → pure helpers in `lib/*.ts` only, never export from `"use client"`
5. **Permanently stuck loading state** → use Server Actions + `useActionState`, not manual `fetch()`
