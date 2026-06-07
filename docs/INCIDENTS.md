# Summer Quest — Incidents & Lessons Learned

> Every bug, root cause, and fix is recorded here. Read this before touching quiz UI, button behavior, the dev server, or lesson deletion. When a new bug is fixed, add a section — never overwrite history.

---

## Incident 2026-06-06 — Quiz Result Screen: Navigation Stuck / "Rendering" State

**Symptoms:**
- Student finished quiz, saw result card, then "Lưu kết quả" sometimes appeared to hang
- Buttons "Về dashboard" / "Xem lại bài học" stalled or re-navigated back to the quiz
- Browser showed a "Rendering" indicator in the lower-left corner in dev mode

**Root cause:**
`QuizEngine.tsx` called `router.refresh()` immediately after saving the final quiz result. That refresh forced the current quiz route to re-render while the component was already switching to a local `result` state. In Next.js dev mode this created a race condition — unstable behavior, visible "Rendering" state, occasional return to the quiz flow.

**Fix applied** — `components/QuizEngine.tsx`:
- Removed `router.refresh()` after successful quiz save
- Added duplicate-submit guard: `if (isSubmitting) return`
- Changed result-screen navigation from imperative `router.push(...)` buttons to stable `<Link>` components
- Added "Đang lưu..." label while final save is in progress

**Rule:** Never call `router.refresh()` from inside a component that is simultaneously transitioning to a local result state. Use `<Link>` for post-quiz navigation.

---

## Incident 2026-06-07 — Dev Server Lockfile Crash (Access Denied)

**Symptoms:**
- Server printed `✓ Ready in 686ms` then immediately crashed:
  ```
  Error: An IO error occurred while attempting to create and acquire the lockfile
  [cause]: Error: Access is denied. (os error 5)
  ```
- App completely inaccessible

**Root cause:**
The `.next/build` directory (webpack/Turbopack incremental cache) had Windows NTFS DENY ACLs. After the server had previously crashed hard (killed mid-write), the directory was left in a locked state. `takeown`, `icacls`, `chmod`, and `rm -rf` all failed — even running as the file owner — because the DENY ACE takes precedence over ownership.

**Fix applied** — `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  distDir: ".next-build",   // fresh writable directory, bypasses locked .next
};
```
Also updated `.gitignore` (added `/.next-build/`) and `Start Summer Quest.cmd` cleanup paths.

**Rule:** If any build fails with "EPERM / Access Denied / lockfile", change `distDir` in `next.config.ts` to the next name in sequence (current: `.next-build5`). Update the same name in `.gitignore`, `Start Summer Quest.cmd`, `docs/TECHNICAL.md`, `AGENTS.md`, `README.md`. Do NOT spend time fixing NTFS permissions — it won't work without elevated rights.

**Pattern to avoid:** Never build while the production server (`next start`) is running — it locks the distDir. Always close the server CMD window before rebuilding, or use a new distDir name.

---

## Incident 2026-06-07 — Buttons Non-Interactive on LAN Devices (React Not Hydrating)

**Symptoms:**
- Quiz answer options, "Kiểm tra", "Duyệt", and "Ẩn" buttons all visually rendered but completely non-interactive on a tablet/phone at http://192.168.0.7:3000
- A red diagnostic bar showed "⏳ Đang tải JavaScript..." — confirming React's `useEffect` never ran
- Everything worked fine on `localhost`

**Root cause:**
In Next.js dev mode (`next dev`), the webpack HMR client tries to open a WebSocket to `ws://localhost:3000/_next/webpack-hmr`. When the page is loaded from another device (192.168.0.7), this connection to `localhost` silently fails. On some mobile browsers, this failure prevents React from fully mounting — all `onClick` / `onChange` handlers are never attached. Additionally, dev mode JS bundles are 5–10 MB (unminified), causing slow hydration or outright failure on WiFi.

**Fix applied:**
Switched `Start Summer Quest.cmd` from `next dev` to production mode:
- Added `"start:lan": "next start --hostname 0.0.0.0 --port 3000"` to `package.json`
- Updated `Start Summer Quest.cmd` to run `npm run build` (on first run only) then `npm run start:lan`

Production mode: no HMR, no WebSocket injection, ~500 KB minified bundles. React hydrates in under 1 second on any LAN device.

**Rule:** Never use `next dev` as the launcher for family/daily use. Dev mode is only for Claude/Codex when actively writing code. The launcher (`Start Summer Quest.cmd`) must always use production mode.

---

## Incident 2026-06-07 — "Ẩn" Button: Foreign Key Constraint on Lesson Delete

**Symptoms:**
- Clicking "Ẩn" (reject) on `/parent/review` silently failed or returned 500
- The lesson was not deleted from the database

**Root cause:**
`prisma.lesson.delete()` was called directly. The schema has no `onDelete: Cascade` on `Attempt.lessonId` or `Mistake.lessonId`. SQLite enforces referential integrity — deleting a Lesson with existing Attempt or Mistake records throws a foreign key constraint violation.

**Fix applied** — `app/parent/review/actions.ts` and `app/api/parent/approve/route.ts`:
```ts
await prisma.$transaction([
  prisma.mistake.deleteMany({ where: { lessonId } }),
  prisma.attempt.deleteMany({ where: { lessonId } }),
  prisma.lesson.delete({ where: { id: lessonId } }),
]);
```

**Rule:** Never call `prisma.lesson.delete()` directly. Always delete child records (Mistake, Attempt) first in a `$transaction`. The schema does not use `onDelete: Cascade` — this is intentional (preserving audit history). If `onDelete: Cascade` is ever added to the schema, the manual deletion can be removed.

---

## Incident 2026-06-07 — Parent Review Buttons Permanently Disabled After Network Error

**Symptoms:**
- "Duyệt" and "Ẩn" buttons became permanently greyed out after a network error
- Only a full page reload restored them

**Root cause:**
The original `ContentReviewCard.tsx` used a `fetch()` call with `setIsWorking(true)` before the request. If `fetch()` threw a network exception, `setIsWorking` stayed `true` forever, permanently disabling the buttons. No try-catch was present for network-level failures (as opposed to non-OK responses).

**Fix applied** — `ContentReviewCard.tsx` rewritten to use React 19 Server Actions:
```tsx
const [approveState, approveAction, approveIsPending] = useActionState(approveLessonAction, null);
const [rejectState, rejectAction, rejectIsPending] = useActionState(rejectLessonAction, null);
```
Server Actions: `isPending` is managed by React (auto-resets on error). Works as native `<form>` submit even without JavaScript (progressive enhancement).

New file: `app/parent/review/actions.ts` with `"use server"` directive.

**Rule:** For any button that mutates server state (approve, reject, save), prefer Server Actions + `useActionState` over manual `fetch()`. Manual `fetch()` requires careful try-catch to avoid stuck loading states. Server Actions handle this automatically.

---

## Incident 2026-06-07 — Quiz Answer Options Not Tappable on Mobile

**Symptoms:**
- Answer options A/B/C/D rendered correctly but tapping on mobile had no visual response
- `selectedAnswer` state was never set, so "Kiểm tra" stayed disabled

**Root cause (two factors):**
1. Original implementation used `<button type="button" onClick>` for each option. On some mobile browsers, when React hasn't fully hydrated (see hydration incident above), `onClick` handlers on buttons are never attached.
2. The `.deco-layer` (floating emoji decorations, `position: fixed`, animated) may intercept touch events on certain browsers if `pointer-events: none` is not **explicitly** set on animated children — inheritance is unreliable.

**Fix applied:**

`QuestionRenderer.tsx` — replaced `<button onClick>` with `<label><input type="radio" onChange>`:
- Native radio inputs work even without JavaScript hydration (progressive enhancement)
- Added `touchAction: "manipulation"` to remove the 300ms tap delay on mobile
- Radio input hidden with `className="sr-only"`, label acts as full tappable surface

`globals.css` — added explicit declaration:
```css
.deco-layer span {
  pointer-events: none; /* explicit — some browsers ignore inherited pointer-events on animated elements */
}
```

**Rule:** Use `<label><input type="radio">` for answer selection, not `<button onClick>`. Always add `touchAction: "manipulation"` on tappable elements. Always set `pointer-events: none` explicitly on `.deco-layer span` — do not rely on CSS inheritance.

---

## Incident 2026-06-07 — Homepage Stale Stats (Static Pre-render)

**Symptoms:**
- Home page (`/`) showed XP, coins, and streak values frozen at build-time values
- Student stats updated correctly inside the dashboard after quizzes, but the home page never reflected the new numbers
- Stats only synced after restarting the server (triggering a rebuild)

**Root cause:**
`app/page.tsx` had no dynamic rendering directive. Next.js App Router defaults to static rendering — the page and its database queries were executed once at build time and cached as a static HTML asset. No DB query ran at page request time.

**Fix applied** — `app/page.tsx`:
```ts
export const dynamic = "force-dynamic";
```
Build output changed from `○ (Static)` to `ƒ (Dynamic)`. DB is now queried on every request.

**Rule:** Any Server Component page that queries the database for live data (student stats, progress, chores, reading) must have `export const dynamic = "force-dynamic"` at the top. Only add static rendering intentionally when the data truly never changes between requests.

---

## Incident 2026-06-07 — Homepage 500: Helper Function Called from Server via Client Boundary

**Symptoms:**
- Homepage (`/`) threw HTTP 500 after `StudentAvatar` component was added
- Server log: `Error: Attempted to call getAvatarTierName() from the server but getAvatarTierName is on the client`
- Student dashboard pages (`/student/[id]`) worked fine
- Home page rendered a blank error document

**Root cause:**
`getAvatarTierName` (a pure function — no browser APIs, no hooks) was exported from `components/StudentAvatar.tsx`, which has `"use client"` at the top. Next.js marks **every export** from a `"use client"` file as client-only at the module boundary level — even exports that contain no client-side code at all. `StudentCard.tsx` is a Server Component and called `getAvatarTierName` imported from that file, triggering the boundary violation at runtime.

**Fix applied:**
- Created `lib/avatar.ts` (no `"use client"`) containing `getAvatarTier()`, `getAvatarTierName()`, `ROBOT_TIER_NAMES`, `PRINCESS_TIER_NAMES`
- `components/StudentAvatar.tsx` imports and re-exports those symbols from `lib/avatar`
- `components/StudentCard.tsx` now imports `getAvatarTierName` from `@/lib/avatar` directly (not from the client component)

**Rule:** Never export utility/helper functions from `"use client"` files. Pure computation logic (no `useState`, no `useEffect`, no browser APIs) must live in `lib/*.ts` files with no client directive. Components import JSX from client files and logic from `lib/` files separately.

---

## Quick Reference: Rules from All Incidents

| Area | Rule |
|---|---|
| Quiz navigation | Use `<Link>` for post-quiz navigation, never `router.refresh()` mid-transition |
| Dev server crash | Change `distDir` in `next.config.ts` to a new name — don't fix NTFS ACLs |
| Family launcher | Always `next start` (production) — never `next dev` |
| Lesson deletion | `$transaction([mistake.deleteMany, attempt.deleteMany, lesson.delete])` |
| Server mutations | Server Actions + `useActionState` over manual `fetch()` |
| Answer selection | `<label><input type="radio">` not `<button onClick>` |
| Mobile touch | `touchAction: "manipulation"` on all tappable elements |
| Pointer events | Explicit `pointer-events: none` on `.deco-layer span` |
| White cards | `style={{ backgroundColor: "#ffffff" }}` — never `bg-white` |
| Live DB queries | `export const dynamic = "force-dynamic"` on every page that queries live data |
| Client boundary | Pure helpers must live in `lib/*.ts` — never export them from `"use client"` files |
| Doc updates | Every bug fix → INCIDENTS.md. Every feature → BACKLOG.md ticket marked ✅ Done |
| Current distDir | `.next-build5` (`.next` through `.next-build4` all locked by running server at time of build) |

---

## Template for Future Incidents

```markdown
## Incident YYYY-MM-DD — [Short Title]

**Symptoms:** what the user/child saw

**Root cause:** why it happened technically

**Fix applied:** what changed, which files, code snippet if helpful

**Rule:** one-sentence prevention guideline
```
