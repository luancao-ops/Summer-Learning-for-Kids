# Summer Quest — Agent Rules

Rules for ALL AI agents (Claude Code and Codex) working in this codebase.
For team workflow, content generation, and onboarding: read `docs/AGENTS.md`.

---

## 1. Project at a Glance

Local-first learning app for two Vietnamese children on a family Windows PC.
- **Yumi** (`girl`) — Grade 4→5, Princess Craft Kingdom theme
- **Johnny** (`boy`) — Grade 3→4, Robot Sport Lab theme
- SQLite database at `prisma/dev.db`. No cloud. No accounts.
- Production server at http://127.0.0.1:3000 (LAN: http://192.168.0.7:3000)

---

## 2. Team Roles (brief)

- **Claude Code** = PM — writes tickets, verifies deliverables, reads `docs/`
- **Codex** = Developer — reads tickets, implements, runs build, reports
- **Parent** = Product Owner — approves content at `/parent/review`

Full workflow in `docs/AGENTS.md`.

---

## 3. Mandatory Coding Rules

### 3.1 Next.js App Router
- `params` is a **Promise** — always `await params` before reading properties
- API routes: `export async function GET/POST(request: Request)`
- Server Components by default — add `"use client"` only when you need state or effects

### 3.2 Tailwind CSS v4
- Import: `@import "tailwindcss"` — NOT `@tailwind base/components/utilities`
- Theme colors via CSS vars (`--sq-primary`, etc.) — don't hardcode hex outside `lib/themes.ts`

### 3.3 Database (Prisma + SQLite)
- **ALL student-facing lesson queries MUST have:** `where: { approved: true }` — safety gate, never remove
- Multi-table writes: always `prisma.$transaction([...])`
- Date-only fields: `"YYYY-MM-DD"` string — use `new Date().toLocaleDateString("sv")`
- Never call `prisma.lesson.delete()` directly — always delete Mistake + Attempt records first in a transaction

### 3.4 TypeScript
- Strict mode — no `any`
- All props must have explicit types
- Use `as const` for union type literals

### 3.5 CSS and Contrast
- White card on themed background: `style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}` — NOT `bg-white`
- Same for `bg-slate-50` → `style={{ backgroundColor: "#f8fafc" }}`
- `color-scheme: light` is set in `:root` of `globals.css` — do not remove
- Body text inside cards: `#1e293b` or `#334155` — not theme purple

### 3.6 Theme System
- Theme ID: `"princess_craft_kingdom"` | `"robot_sport_lab"` — stored in `Student.themeId`
- Resolve: `getTheme(student.themeId)` from `lib/themes.ts`
- Apply CSS vars: `style={themeStyle(theme)}` on `.page-shell`
- Deco layer: `<div className="deco-layer">` with `theme.decorations.map()`
- Content wrapper: `<div className="page-content">` — always above deco-layer (z-index 1)
- `pointer-events: none` must be **explicit** on `.deco-layer span` — not just inherited

### 3.7 Interactive Elements
- Answer options: `<label><input type="radio" onChange>` — NOT `<button onClick>`
- Touch targets: add `touchAction: "manipulation"` on all tappable elements
- For server mutations: prefer Server Actions + `useActionState` over manual `fetch()`
- If using `fetch()`: always wrap in try-catch to prevent permanently stuck loading states

### 3.8 Build & Launcher
- `distDir: ".next-build5"` in `next.config.ts` — do NOT change back to `.next` through `.next-build4`
- `Start Summer Quest.cmd` uses `next start` (production) — never change to `next dev`
- Dev mode (`npm run dev:local`) is for Claude/Codex only, never for family use

---

## 4. Key Files

```
prisma/schema.prisma          ← DB source of truth
lib/themes.ts                 ← All colors / theme config
app/globals.css               ← CSS utilities (page-shell, deco-layer, card-hero)
docs/TECHNICAL.md             ← Routes, schema summary, setup
docs/AGENTS.md                ← Workflow, content prompts, PM briefs
docs/BACKLOG.md               ← Current tickets
docs/INCIDENTS.md             ← Bug history — read before touching quiz/buttons
```

---

## 5. PM Brief format (Codex → PM)

```markdown
## PM Brief — Sprint N
**Status:** Complete | Partial | Blocked

**Delivered:**
- TICKET-XXX: name — deviation note if any

**Verification:** build pass / route checked / DB count

**Risks/Notes:** bugs found, key decisions

**Suggested next:** ticket recommendation
```

---

## 6. Content Rules

- All lesson content in Vietnamese, child-friendly language (age 8–10)
- Never copy from school textbooks — use original examples, real-life context
- Quiz feedback always follows theme tone (Princess vs Robot) — use `theme.feedback`
- AI-generated lessons: `approved: false` — parent must approve before children see

---

## 7. Pre-Delivery Checklist (Codex)

### Code quality
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — no new warnings
- [ ] All student lesson queries have `approved: true`
- [ ] Multi-write DB operations use `$transaction`
- [ ] No `any` types
- [ ] White cards use inline style, not `bg-white`
- [ ] `touchAction: "manipulation"` on new tappable elements
- [ ] Pure utility functions live in `lib/*.ts`, NOT exported from `"use client"` files

### Documentation — MANDATORY, same priority as build passing

- [ ] **Bug fix** → add entry to `docs/INCIDENTS.md` (symptoms · root cause · fix · rule)
- [ ] **New/changed feature** → ticket added or updated in `docs/BACKLOG.md`, marked ✅ Done when delivered
- [ ] **distDir bumped** → update ALL SIX files: `next.config.ts` · `.gitignore` · `Start Summer Quest.cmd` · `docs/TECHNICAL.md` · `AGENTS.md` · `README.md`
- [ ] **Schema changed** → update DB summary table in `docs/TECHNICAL.md`
- [ ] Never skip doc updates — undocumented bugs WILL be repeated in future sessions
