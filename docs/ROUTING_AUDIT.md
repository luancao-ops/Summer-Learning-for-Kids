# Summer Quest — Routing Audit

> Full map of all routes (pages, API, server actions) with status, ownership, and gap analysis.
> Snapshot date: 2026-06-09. Reflects production state including Sprint 8.

---

## Page Routes

### Student-facing pages

| Route | File | Auth | Dynamic | Status |
|---|---|---|---|---|
| `/` | `app/page.tsx` | None | Yes | ✅ Live |
| `/student/[studentId]` | `app/student/[studentId]/page.tsx` | Student access code (optional) | Yes | ✅ Live |
| `/student/[studentId]/subject/[subject]` | `app/student/[studentId]/subject/[subject]/page.tsx` | Student access code | Yes | ✅ Live |
| `/student/[studentId]/lesson/[lessonId]` | `app/student/[studentId]/lesson/[lessonId]/page.tsx` | Student access code | Yes | ✅ Live |
| `/student/[studentId]/lesson/[lessonId]/quiz` | `app/student/[studentId]/lesson/[lessonId]/quiz/page.tsx` | Student access code | Yes | ✅ Live |
| `/student/[studentId]/review` | `app/student/[studentId]/review/page.tsx` | Student access code | Yes | ✅ Live |

**Student auth pattern:** `lib/student-access.ts` — optional access code stored as hash in `Student.accessCodeHash`. Unauthenticated = open (no code set).

### Parent-facing pages

| Route | File | Auth | Dynamic | Status |
|---|---|---|---|---|
| `/parent` | `app/parent/page.tsx` | Parent PIN (optional) | Yes | ✅ Live |
| `/parent/unlock` | `app/parent/unlock/page.tsx` | None (is the auth page) | No | ✅ Live |
| `/parent/review` | `app/parent/review/page.tsx` | Parent PIN | Yes | ✅ Live |
| `/parent/chores` | `app/parent/chores/page.tsx` | Parent PIN | Yes | ✅ Live |
| `/parent/settings` | `app/parent/settings/page.tsx` | Parent PIN | Yes | ✅ Live |

**Parent auth pattern:** `requireParentAccess()` in `lib/parent-access.ts` → checks `sq_parent_access` cookie. No PIN configured = open access (backward compatible).

---

## API Routes

| Route | Method | Handler file | Auth | Purpose | Status |
|---|---|---|---|---|---|
| `/api/quiz/submit` | POST | `app/api/quiz/submit/route.ts` | None | Record attempt; award XP, coins, badges | ✅ Live |
| `/api/chores/complete` | POST | `app/api/chores/complete/route.ts` | None | Mark chore completed by student | ✅ Live |
| `/api/reading/log` | POST | `app/api/reading/log/route.ts` | None | Log a reading entry | ✅ Live |
| `/api/mistakes/resolve` | POST | `app/api/mistakes/resolve/route.ts` | None | Mark a mistake resolved | ✅ Live |
| `/api/parent/approve` | POST | `app/api/parent/approve/route.ts` | Cookie check | Approve a lesson for student visibility | ✅ Live |
| `/api/parent/chores/assign` | POST | `app/api/parent/chores/assign/route.ts` | Cookie check | Assign a chore to a student | ✅ Live |
| `/api/parent/reset-data` | POST | `app/api/parent/reset-data/route.ts` | Cookie check | Reset student progress (dev tool) | ✅ Live |
| `/api/parent/student-access` | POST | `app/api/parent/student-access/route.ts` | Cookie check | Set student access code | ✅ Live |
| `/api/parent/unlock` | POST | `app/api/parent/unlock/route.ts` | None (is auth) | Validate PIN; issue `sq_parent_access` cookie | ✅ Live |
| `/api/parent/set-pin` | POST / DELETE | `app/api/parent/set-pin/route.ts` | Cookie check | Set or remove parent PIN | ✅ Live |
| `/api/student/lock` | POST | `app/api/student/lock/route.ts` | None | Lock student session | ✅ Live |
| `/api/student/unlock` | POST | `app/api/student/unlock/route.ts` | None | Unlock with access code | ✅ Live |
| `/api/report-question` | POST | `app/api/report-question/route.ts` | None | Submit flag/report on question (Sprint 8) | ✅ Live |

**Auth note on student-facing APIs:** `/api/quiz/submit`, `/api/chores/complete`, `/api/reading/log`, `/api/mistakes/resolve`, `/api/student/lock`, `/api/student/unlock`, and `/api/report-question` do not validate the session cookie — they rely on the page-level student auth. This is acceptable for a local-only family app.

---

## Server Actions

| Action | File | Purpose | Status |
|---|---|---|---|
| Approve lesson | `app/parent/review/actions.ts` | Approve a lesson via `useActionState` | ✅ Live |
| Reject lesson | `app/parent/review/actions.ts` | Reject (delete) a lesson | ✅ Live |
| Resolve report | `app/parent/review/actions.ts` | Mark a QuestionReport resolved (Sprint 8) | ✅ Live |
| Set PIN | `app/parent/settings/page.tsx` (inline) | Set/change parent PIN | ✅ Live |
| Set access code | `app/parent/settings/page.tsx` (inline) | Set student access code | ✅ Live |

---

## Routing Gaps

| Gap | Severity | Notes |
|---|---|---|
| No `/parent/reports` dedicated route | LOW | Currently reports are shown inline on `/parent/review`. If report volume grows, a dedicated route may be needed |
| No `/student/[id]/achievements` route | LOW | Badges and rewards shown on dashboard; no dedicated view |
| No `/api/parent/reject` route | N/A | Rejection is handled via a Server Action on `/parent/review/actions.ts` — not an API route |
| No `/student/[id]/settings` route | LOW | Students can't change their own preferences; all settings via parent |
| Science subject not in DB | MEDIUM | `modules/science/MODULE.md` exists but no `/student/[id]/subject/science` route works — no content |

---

## Route Security Model

```
PUBLIC (no auth)
    /                           ← Student selection; students choose themselves
    /parent/unlock              ← PIN entry form
    /api/parent/unlock          ← Validates PIN; issues cookie
    /api/quiz/submit            ← Local family app; no per-session token
    /api/chores/complete
    /api/reading/log
    /api/mistakes/resolve
    /api/student/lock
    /api/student/unlock
    /api/report-question        ← Sprint 8; studentId passed in body (optional)

STUDENT ACCESS CODE (soft gate)
    /student/[studentId]/*      ← requireStudentAccess() in lib/student-access.ts
                                   If no code configured → open access

PARENT PIN (soft gate)
    /parent                     ← requireParentAccess() in lib/parent-access.ts
    /parent/review                 If no PIN configured → open access
    /parent/chores                 Cookie: sq_parent_access (httpOnly, 8h)
    /parent/settings
    /api/parent/approve
    /api/parent/chores/assign
    /api/parent/reset-data
    /api/parent/student-access
    /api/parent/set-pin
```

**Security design intent:** This is a local family app on a home network. The auth is protective (prevent accidental access), not cryptographic (prevent adversarial access). PIN + access codes prevent children from accidentally entering parent areas, not from determined circumvention.

---

## `export const dynamic = "force-dynamic"` Audit

All server pages that query live DB data MUST have this directive to prevent stale cached responses. Verified present in:

| Route | Required? | Status |
|---|---|---|
| `/parent` | Yes (queries DB) | ✅ Present |
| `/parent/review` | Yes (queries DB) | ✅ Present |
| `/parent/chores` | Yes (queries DB) | ✅ Present |
| `/parent/settings` | Yes (queries DB) | ✅ Present |
| `/student/[id]` | Yes (queries DB) | ✅ Present |
| `/student/[id]/subject/[sub]` | Yes (queries DB) | ✅ Present |
| `/student/[id]/lesson/[lid]` | Yes (queries DB) | ✅ Present |
| `/student/[id]/lesson/[lid]/quiz` | Yes (queries DB) | ✅ Present |
| `/student/[id]/review` | Yes (queries DB) | ✅ Present |

**Note:** Missing `export const dynamic` on a page that queries live data causes stale results after build. This was the root cause of INCIDENT #3 (see `docs/INCIDENTS.md`).

---

## `await params` Audit

Next.js 16 App Router: `params` is a Promise — all dynamic route pages must `await params` before reading properties. Failure causes a TypeScript error at build time in strict mode.

| Dynamic Segment | Example file | Status |
|---|---|---|
| `[studentId]` | `app/student/[studentId]/page.tsx` | ✅ Awaited |
| `[subject]` | `app/student/[studentId]/subject/[subject]/page.tsx` | ✅ Awaited |
| `[lessonId]` | `app/student/[studentId]/lesson/[lessonId]/page.tsx` | ✅ Awaited |
| `[lessonId]` (quiz) | `app/student/[studentId]/lesson/[lessonId]/quiz/page.tsx` | ✅ Awaited |

Build passes with `tsc --noEmit` — no async params violations at last audit.
