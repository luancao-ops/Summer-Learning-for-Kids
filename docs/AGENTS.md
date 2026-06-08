# Summer Quest — Agent & Workflow Guide

This file is the single source of truth for how the team works together: roles, workflow, AI onboarding, and content generation.

---

## Team Roles

| Role | Who | Responsibilities |
|---|---|---|
| **Product Owner** | Parent | Set requirements, review AI content at `/parent/review`, confirm features |
| **PM** | Claude Code | Analyze requirements, update BACKLOG.md, write PM Briefs for Codex, verify deliverables |
| **Developer** | Codex | Read tickets, implement, run build, submit PM Brief report |

---

## Workflow

```
Parent requests feature
        ↓
Claude Code (PM):
  → Analyze + update docs/BACKLOG.md
  → Update docs/TECHNICAL.md if schema changes
  → Write PM Brief → hand to Codex
        ↓
Codex (Dev):
  → Read ticket in BACKLOG.md
  → Read relevant sections of TECHNICAL.md
  → Implement → npm run build → report PM Brief
        ↓
Claude Code verifies:
  → Read changed files
  → Smoke-test routes
  → Check DB if migration ran
  → Write next sprint or close
```

---

## PRODUCTION SAFETY RULE

**This application is in active production. Children's real progress data exists.**

If student progress exists in the database, Claude Code may NOT do any of the following without **explicit parent approval**:

- Modify `prisma/schema.prisma`
- Create database migrations
- Rename existing database fields
- Remove tables
- Change route contracts (URL paths, request/response shapes)

The following are always allowed without approval:

- Documentation changes
- Folder structure changes
- Architecture planning
- New manifest files (`content/manifests/*.json`)
- Content import (`npm run content:import`) — append-only, never modifies existing records

**When in doubt: document the plan, stop, and wait for approval.**

---

## PM Responsibilities (Claude Code)

### When receiving a request from Parent

1. Read BACKLOG.md + TECHNICAL.md + schema.prisma for context
2. Add ticket(s) to BACKLOG.md
3. Update TECHNICAL.md if schema changes are needed
4. Write PM Brief for Codex (see format below)

### PM Brief format (to Codex)

```markdown
## Codex Sprint N — [Sprint Name]

### Task N — [Task Name] (~estimated time)
**Files:** `path/to/file.tsx`, `path/to/other.ts`

[What to build, why, which patterns to use]

[Code sample if schema changes or API contract matters]

**Acceptance criteria:**
- [ ] Observable behavior 1
- [ ] Observable behavior 2
- [ ] `npm run build` zero errors
```

### Verifying a deliverable

```powershell
# Read changed files — never just trust the report
# Smoke-test key routes
Invoke-WebRequest -Uri "http://localhost:3000/parent" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:3000/student/girl" -UseBasicParsing

# Check DB if migration ran
cd summer-quest
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.lesson.count().then(console.log).finally(()=>p.$disconnect())"
```

Verification shorthand: ✅ confirmed · ⚠ watch · ❌ fix now

---

## Developer Responsibilities (Codex)

### Before starting a ticket

1. Read the ticket in `docs/BACKLOG.md`
2. Read `docs/TECHNICAL.md` — especially the Critical Coding Rules table
3. Read `summer-quest/AGENTS.md` — especially section 3

### Dev report format (to PM)

```markdown
## PM Brief — Sprint N
**Status:** Complete | Partial | Blocked

**Delivered:**
- TICKET-XXX: [name] — [note if deviation]

**Verification:** [how you tested: build pass, route check, DB count]

**Risks/Notes:** [bugs found, decisions made]

**Suggested next:** [ticket to do next]
```

### Dev checklist before reporting done

**Code quality:**
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — no new warnings
- [ ] All student lesson queries have `approved: true`
- [ ] Multi-table DB writes use `$transaction`
- [ ] No new `any` types
- [ ] White cards use inline `style={{ backgroundColor: "#ffffff" }}`

**Documentation — mandatory, same weight as build passing:**
- [ ] Bug fix → entry added to `docs/INCIDENTS.md` (symptoms · root cause · fix · rule)
- [ ] Ticket delivered → marked ✅ Done in `docs/BACKLOG.md` with sprint label
- [ ] distDir changed → all 6 files updated (see `summer-quest/AGENTS.md` §3.8 and §7)
- [ ] Schema changed → `docs/TECHNICAL.md` DB summary updated
- [ ] New coding rule → added to `docs/INCIDENTS.md` Quick Reference table

---

## New AI Session Onboarding

When Claude Code or Codex starts on a new machine or new session:

### 1. Read in order

```
summer-quest/AGENTS.md          ← Coding rules (mandatory)
docs/TECHNICAL.md               ← Schema, routes, file map
docs/BACKLOG.md                 ← What to work on
docs/INCIDENTS.md               ← What went wrong before (avoid repeating)
```

### 2. Verify the app runs

```powershell
cd "D:\Project Learning For Kids\summer-quest"
npm.cmd run build
npm.cmd run start:lan
# Open http://127.0.0.1:3000
```

### 3. Check current DB state

```powershell
npm.cmd run prisma:studio
# Or: npx prisma migrate status
```

### Current product state

Implemented and working:
- Student selection → themed dashboards (Yumi / Johnny)
- Lesson viewer → quiz engine → result screen
- XP, coins, streak, badges, rewards
- Mistake review
- Parent dashboard + AI content review (approve/reject)
- Habits module: chores (checklist UX) + reading log
- Student access codes (PIN lock)
- LAN access from tablet/phone via production server

---

## Content Generation Prompts

Use these in a fresh Claude conversation (not the dev session). All output must be seeded with `approved: false`.

### Prompt A — Math Lesson + Quiz

```
Tạo 1 bài học Toán tiếng Việt cho [bé gái/bé trai], lớp [3/4/5], chủ đề: "[chủ đề]".

Yêu cầu:
- Nội dung gốc hoàn toàn, không sao chép sách giáo khoa
- Ngôn ngữ đơn giản, phù hợp [9/10] tuổi
- Dùng tình huống thực tế: đồ ăn, đồ chơi, gia đình
- 20+ câu quiz: 60% trắc nghiệm, 30% đúng/sai, 10% điền chỗ trống
- Mỗi câu có: explanation rõ ràng (≥2 câu), hint không tiết lộ đáp án

Output: JSON theo schema trong docs/TECHNICAL.md. Set approved: false.
```

### Prompt B — Vietnamese Lesson + Quiz

```
Tạo 1 bài học Tiếng Việt cho [bé gái/bé trai], lớp [3/4/5], chủ đề: "[chủ đề]".

Yêu cầu:
- 4 phần: khái niệm → ví dụ → luyện tập → tóm tắt
- Dùng từ ngữ thân quen: động vật, gia đình, thiên nhiên, trường học
- Không dùng câu hoặc đoạn văn từ SGK Tiếng Việt
- 20+ câu quiz với explanation bằng ngôn ngữ trẻ em

Output: JSON, approved: false.
```

### Prompt C — English Lesson + Quiz (A1 CEFR)

```
Generate an English lesson for a Vietnamese child aged [9/10].
CEFR: A1. Topic: "[topic]". Target exam: [Movers / Flyers].

Requirements:
- Bilingual: English target language, Vietnamese explanations
- 4 sections: New words, Pronunciation guide, Example sentences, Summary
- Sentences max 6 words
- 20+ questions: recognition tasks (choose/match), not production
- Explanations in Vietnamese

Output: JSON, approved: false.
```

### Prompt D — Batch of 5 Lessons

```
Generate 5 lessons for [girl/boy], grade [3/4], subject [math/vietnamese/english].

Topics:
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]
4. [Topic 4]
5. [Topic 5]

Each lesson: self-contained, 4-section structure, 20+ questions, approved: false.
Output: JSON array of 5 lesson objects.
```

---

## Parent: Reviewing AI Content

**Checklist when approving a lesson:**

```
Bài học:
□ Nội dung đúng kiến thức không?
□ Ngôn ngữ phù hợp với con không?
□ Ví dụ có thực tế và dễ hiểu không?

Quiz:
□ Câu hỏi rõ ràng, không mơ hồ?
□ Đáp án đúng có thực sự đúng không?
□ Explanation đủ để con tự hiểu?

Tổng thể:
□ Tone phù hợp (không quá khó, không quá dễ)?
□ Sẵn sàng cho con học?
```

---

## Bug Report Format

When finding a bug, add to INCIDENTS.md:

```markdown
## Incident YYYY-MM-DD — [Short Title]

**Symptoms:** what the user saw
**Reproduction:** exact steps
**Root Cause:** why it happened
**Fix Applied:** what changed, which files
**Validation:** commands run + outcome
```

---

## Git Workflow

```
main  ← always stable, production-ready
  └── feature/ticket-XXX  ← one branch per ticket
```

Commit format:
```
feat: add reading streak badge (TICKET-050)
fix: resolve chore completion FK error (BUG-003)
content: import Grade 4 math batch 2
docs: update BACKLOG.md
```
