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
| `QuestionReport` access | Use `prisma.$queryRaw` / `$executeRaw` — added Sprint 8 while server was running; `prisma generate` EPERM |
| `Question.options` | Stored as JSON string — always `JSON.parse()` before use |
| `Student.id` | Plain string (`"girl"` / `"boy"`) — not auto-generated |
| Migrations | Edit `schema.prisma` → run `npm run prisma:migrate` → update `docs/TECHNICAL.md` |

---

## Build & Launcher Rules

| Rule | Value |
|---|---|
| distDir | `.next-build9` — NEVER revert to `.next` through `.next-build8` |
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

## Question Validation Rules (MANDATORY before import)

These rules were added after a batch audit found 16 questions with wrong answers in English lessons x002–x004 and several math/Vietnamese lessons. All errors were avoidable with a single cross-check step.

| Rule | Check |
|---|---|
| **Explanation letter must match correctIndex** | Read the explanation. Find which letter it names (e.g., "đáp án C"). Verify that letter matches `correctIndex` (C=2). This single check catches the most common AI generation error. |
| **"Find the WRONG sentence" questions** | For "Câu nào SAI?" / "Câu nào không đúng?", `correctIndex` must point to the option that IS wrong/incorrect. The explanation should describe why that option is wrong. |
| **True/False with negative statements** | For TF questions where the statement is factually false, `correct` must be `false`. If the explanation begins with "Sai!" or "Không đúng!", double-check that `correct: false` in the manifest. |
| **No two-blank fill questions** | A `fill_blank` question may have exactly ONE `___`. If the question text has two blanks, rewrite to one blank or split into two questions. Single `answer` field cannot satisfy two blanks. |
| **Explanation contradicts answer** | Read the explanation and verify it is consistent with the stored `correctAnswer`. If the explanation says "Câu đúng: X" but `correctAnswer` points to Y, one of them is wrong — fix before import. |
| **Translation questions** | For "Câu A có nghĩa là gì?" (what does sentence A mean?), verify the correct option is semantically equivalent to the sentence being translated — especially for negatives ("don't", "không", "phủ định"). |

## PDF / Knowledge Package Rules

| Rule | Detail |
|---|---|
| PDFs are source material only | A PDF is a one-time input. It is never read again after the Knowledge Package is created. |
| PDFs must never be used as runtime content | Never store, serve, or embed PDFs in the app database or content pipeline |
| After import, use the Knowledge Package | AI agents generating lessons MUST read `imports/{subject}/grade{N}/{BookSlug}/` — NOT the PDF |
| Never repeatedly read imported PDFs | If a Knowledge Package exists at `imports/`, use it. Reading the PDF again wastes tokens and is forbidden. |
| PDF storage | PDFs live in `source_materials/{subject}/` only. Gitignored. Never in `content_repository/` or `imports/`. |
| Knowledge Package completeness | A KP is incomplete until all 6 files exist: `manifest.json`, `curriculum.json`, `vocabulary.json`, `grammar.json`, `assessment_seed.json`, `assets.json` |
| How to import | See `tools/import_book/README.md` (overview) and `tools/import_book/import_workflow.md` (step-by-step) |

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
