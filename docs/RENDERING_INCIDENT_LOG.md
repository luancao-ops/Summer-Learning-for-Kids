# Rendering Incident Log

Use this file as the running history for quiz/result rendering issues and their fixes.

## Scope

- Student quiz flow
- Result screen after quiz submission
- Navigation from result screen back to dashboard or lesson
- Any future `Rendering` stuck state in Next.js dev mode

## Incident 2026-06-06

### Summary

Student could finish a quiz, see the result card, then:

- clicking `Luu ket qua` sometimes appeared to hang
- clicking `Ve dashboard` or `Xem lai bai hoc` could stall
- the page could show a bottom-left `Rendering` status
- in some cases the quiz page re-rendered and looked like it returned to the doing-quiz state

### Reported screen

- URL example: `/student/girl/lesson/girl-g4-math-4/quiz`
- Browser showed `Rendering` in the lower-left corner
- Student-facing result card was visible but navigation was unreliable

### Root Cause

The client component `summer-quest/components/QuizEngine.tsx` called `router.refresh()` immediately after saving the final quiz result.

That refresh forced the current quiz route to re-render while the component was already switching to a local `result` state. In Next.js dev mode this created unstable behavior:

- visible `Rendering` state
- navigation feeling stuck
- occasional return to the quiz flow due to route refresh timing

### Fix Applied

File changed:

- `summer-quest/components/QuizEngine.tsx`

Changes:

- removed `router.refresh()` after successful quiz save
- added duplicate-submit guard with `if (isSubmitting) return`
- changed result-screen navigation from imperative `router.push(...)` buttons to stable `Link` navigation
- added `Dang luu...` label while the final save is in progress
- rewrote the file in clean UTF-8 text to avoid future patching issues from broken encoding

### Validation

Commands run:

```powershell
npm.cmd run test
npm.cmd run build
```

Result:

- tests passed
- production build passed

### Files Related To This Incident

- `summer-quest/components/QuizEngine.tsx`
- `summer-quest/app/api/quiz/submit/route.ts`
- `summer-quest/app/student/[studentId]/lesson/[lessonId]/quiz/page.tsx`

## Follow-Up Rule

If this issue or a similar one happens again:

1. Check this file first.
2. Reproduce the exact route and action sequence.
3. Record:
   - date
   - student id
   - lesson id
   - exact button clicked
   - whether `Rendering` appeared
   - whether the result page stayed visible
   - whether the browser URL changed
4. Append a new incident section below instead of replacing history.
5. Add:
   - suspected root cause
   - exact code change
   - verification commands
   - outcome

## Template For Future Incidents

```md
## Incident YYYY-MM-DD

### Summary

...

### Reproduction

...

### Root Cause

...

### Fix Applied

...

### Validation

...
```
