# Summer Quest — Knowledge Graph

> Maps every knowledge domain in the project: what exists, what links to what, and what is missing.
> Use this to understand the full shape of project knowledge before making architectural decisions.

---

## Layer 1 — Runtime Knowledge (production code)

```
summer-quest/
├── RUNTIME CORE
│   ├── prisma/schema.prisma          ← Canonical data model
│   ├── prisma/dev.db                 ← Live SQLite database
│   ├── lib/prisma.ts                 ← Prisma singleton
│   ├── lib/themes.ts                 ← Theme colors + decorations (source of truth)
│   ├── lib/quiz.ts                   ← XP scoring, answer-checking logic
│   ├── lib/habits.ts                 ← Chores + reading helpers
│   ├── lib/student-access.ts         ← Student access code helpers
│   ├── lib/parent-access.ts          ← Parent PIN (SHA-256, cookies)
│   ├── lib/content-import.ts         ← Manifest → DB import logic
│   └── lib/avatar.ts                 ← Avatar tier helpers
│
├── ROUTE LAYER
│   ├── app/page.tsx                  ← Student selector (/)
│   ├── app/student/[studentId]/
│   │   ├── page.tsx                  ← Student dashboard
│   │   ├── subject/[subject]/page.tsx← Lesson list
│   │   ├── lesson/[lessonId]/page.tsx← Lesson viewer
│   │   ├── lesson/[lessonId]/quiz/   ← Quiz engine
│   │   └── review/page.tsx           ← Mistake review
│   └── app/parent/
│       ├── page.tsx                  ← Parent dashboard
│       ├── review/page.tsx           ← Content approval + flag review
│       ├── chores/page.tsx           ← Chore assignment
│       ├── settings/page.tsx         ← PIN + access codes
│       └── unlock/page.tsx           ← PIN entry
│
├── API LAYER
│   ├── api/quiz/submit               ← Awards XP, coins, badges
│   ├── api/chores/complete           ← Marks chore done
│   ├── api/reading/log               ← Logs reading entry
│   ├── api/mistakes/resolve          ← Clears mistake
│   ├── api/parent/approve            ← Approves lesson
│   ├── api/parent/chores/assign      ← Assigns chore
│   ├── api/parent/reset-data         ← Dev: reset progress
│   ├── api/parent/student-access     ← Sets access code
│   ├── api/parent/unlock             ← Validates PIN
│   ├── api/parent/set-pin            ← Sets/removes PIN
│   ├── api/student/lock              ← Locks student
│   ├── api/student/unlock            ← Unlocks student
│   └── api/report-question           ← Submits flag on question (Sprint 8)
│
└── COMPONENT LAYER
    ├── QuizEngine.tsx                ← Full quiz state machine + flag UI
    ├── QuestionRenderer.tsx          ← Per-question display
    ├── ChoreChecklist.tsx            ← Student chore UI
    ├── ParentChorePlanner.tsx        ← Parent chore planning
    ├── ContentReviewCard.tsx         ← Approve/reject lesson
    ├── ParentUnlockForm.tsx          ← PIN entry
    ├── ParentPinSetup.tsx            ← PIN management
    ├── FeedbackMessage.tsx           ← Quiz answer feedback
    ├── RewardBanner.tsx              ← XP/coin animation
    └── ResolveReportButton.tsx       ← Resolve QuestionReport (Sprint 8)
```

---

## Layer 2 — Content Knowledge (lesson data)

```
CONTENT PIPELINE
│
├── RAW SOURCE MATERIALS (unprocessed, gitignored)
│   └── source_materials/
│       ├── README.md
│       ├── english/              ← PDFs, textbooks (gitignored)
│       ├── math/
│       ├── vietnamese/
│       └── science/
│
├── PROCESSED CONTENT REPOSITORY (extracted, validated)
│   └── content_repository/
│       ├── README.md                 ← Pipeline docs + rules
│       ├── english/
│       │   ├── README.md
│       │   └── 2 Family and Friends 5.pdf   ← ⚠ PDF should NOT be here (violates rule)
│       ├── math/README.md
│       ├── vietnamese/README.md
│       └── science/README.md
│
├── IMPORT STAGING (optional, between repo and manifests)
│   └── imports/
│       ├── README.md
│       ├── english/
│       ├── math/
│       ├── vietnamese/
│       └── science/
│
├── STRUCTURED MANIFESTS (JSON, active import queue)
│   └── summer-quest/content/manifests/
│       ├── batch-girl-g4-math-{01-05}.json    ← 25 lessons, Grade 4 math for Yumi
│       ├── batch-girl-g5-math-{01-05}.json    ← 25 lessons, Grade 5 math for Yumi
│       ├── batch-girl-g4-vi-{01-05}.json      ← 25 lessons, Grade 4 Vietnamese for Yumi
│       ├── batch-girl-g5-vi-{01-05}.json      ← 25 lessons, Grade 5 Vietnamese for Yumi (partial)
│       ├── batch-girl-g4-en-{01-05}.json      ← 25 lessons, Grade 4 English for Yumi
│       ├── batch-girl-g5-en-{01-05}.json      ← 25 lessons, Grade 5 English for Yumi (partial)
│       ├── batch-boy-g3-math-{01-05}.json     ← 25 lessons, Grade 3 math for Johnny
│       ├── batch-boy-g4-math-{01-05}.json     ← 25 lessons, Grade 4 math for Johnny
│       ├── batch-boy-g3-vi-{01-04}.json       ← 20 lessons, Grade 3 Vietnamese for Johnny
│       ├── batch-english-boy-g3-{01-04}.json  ← English (outlier naming) for Johnny
│       └── ... (54 total manifests)
│
└── DATABASE (imported, live)
    └── summer-quest/prisma/dev.db
        ├── Lesson records (approved: false for AI-imported)
        ├── Question records (with correctAnswer, options JSON)
        ├── Student progress (Attempt, Mistake, Badge, Streak)
        └── QuestionReport records (flag/report system, Sprint 8)
```

### Manifest Naming Conventions

Two active conventions (inconsistency — see ARCHITECTURE_AUDIT_REPORT.md §4):

| Convention | Pattern | Count | Example |
|---|---|---|---|
| **Standard** (majority) | `batch-{studentTarget}-g{grade}-{subject}-{n}.json` | 46 files | `batch-girl-g4-math-01.json` |
| **Outlier** (English-boy) | `batch-{subject}-{studentTarget}-g{grade}-{n}.json` | 4 files | `batch-english-boy-g3-01.json` |
| **Documented** (CONTENT_IMPORT.md) | `batch-{subject}-{studentTarget}-g{grade}-{n}.json` | — | Matches outlier, NOT majority |

**Action required:** Update `docs/CONTENT_IMPORT.md` to document the standard (majority) convention.

---

## Layer 3 — Documentation Knowledge (this docs/ folder)

```
docs/ knowledge domains:
│
├── ENTRY POINTS (always load first)
│   ├── 00_AGENT_INDEX.md             ← Primary AI router (< 5KB, always loaded)
│   └── KNOWLEDGE_MAP.json            ← Task → docs mapping
│
├── RULES & STANDARDS
│   ├── 01_RULES.md                   ← Compressed critical rules
│   ├── AI_DATA_STANDARDS.md          ← Lesson JSON schema + validation rules
│   └── INCIDENTS.md                  ← Bug history + prevention rules
│
├── ARCHITECTURE
│   ├── ARCHITECTURE_BASELINE.md      ← Phase 0 production snapshot
│   ├── ARCHITECTURE_AUDIT_REPORT.md  ← V2 audit findings (this audit)
│   ├── KNOWLEDGE_GRAPH.md            ← This file
│   ├── ROUTING_AUDIT.md              ← Route map + gap analysis
│   ├── MODULE_ARCHITECTURE.md        ← Module scaffold design
│   ├── MIGRATION_STRATEGY.md         ← Future evolution plan
│   └── TOKEN_OPTIMIZATION_REPORT.md  ← AI context cost analysis
│
├── TECHNICAL REFERENCE
│   ├── TECHNICAL.md                  ← Stack, routes, schema summary, setup
│   └── CURRICULUM_STRUCTURE.md       ← Grade 3–6 learning objectives
│
├── CONTENT PIPELINE
│   ├── CONTENT_IMPORT.md             ← Import pipeline (V1 active, V2 planned)
│   └── CONTENT_REPOSITORY_GUIDE.md  ← content_repository/ usage guide
│
├── WORKFLOW
│   ├── AGENTS.md                     ← PM/Dev workflow, content generation prompts
│   ├── PROJECT.md                    ← Vision, student profiles, game design
│   └── BACKLOG.md                    ← Sprint tickets (~49KB — split recommended)
│
├── UX
│   └── UX_FLOW.md                    ← User flows (~31KB — rarely fully loaded)
│
└── FUTURE DESIGN (placeholder docs)
    ├── ASSET_MODEL.md                ← Future image/asset system
    └── RAG_ARCHITECTURE.md           ← Future RAG/vector search
```

---

## Layer 4 — Module Knowledge (subject scaffolding)

```
modules/
├── english/
│   ├── MODULE.md                     ← English module spec (scaffolding only)
│   ├── content/                      ← empty
│   ├── assets/                       ← empty
│   ├── games/                        ← empty
│   └── importers/                    ← empty
├── math/
│   └── MODULE.md                     ← Math module spec (scaffolding only)
├── vietnamese/
│   └── MODULE.md                     ← Vietnamese module spec (scaffolding only)
└── science/
    └── MODULE.md                     ← Science module spec (scaffolding only)
```

**Note:** Modules are future architecture scaffolding. None of these folders are loaded at runtime. The live code does not reference `modules/` in any import. Module knowledge is design-time only.

---

## Layer 5 — Asset Knowledge

```
assets/
├── README.md                         ← Asset catalog structure docs
├── math/
│   └── catalog.json                  ← Math asset catalog (empty — no assets yet)
├── vietnamese/
│   └── catalog.json                  ← Vietnamese asset catalog (empty)
├── english/
│   └── catalog.json                  ← English asset catalog (empty)
└── science/
    └── catalog.json                  ← Science asset catalog (empty)
```

**Note:** Asset system is defined but no actual image/asset files exist. `docs/ASSET_MODEL.md` describes the planned design. Not implemented in runtime.

---

## Knowledge Links (cross-domain dependencies)

```
schema.prisma
    → TECHNICAL.md (summary)
    → ARCHITECTURE_BASELINE.md (full model table)
    → 01_RULES.md (key constraints)

distDir value
    → next.config.ts (authoritative)
    → 5 other files MUST match: .gitignore, Start Summer Quest.cmd,
      docs/TECHNICAL.md, summer-quest/AGENTS.md, summer-quest/README.md

manifest → DB import
    → content/manifests/*.json (source)
    → lib/content-import.ts (import logic)
    → docs/CONTENT_IMPORT.md (workflow docs)
    → docs/AI_DATA_STANDARDS.md (schema spec)

QuestionReport (Sprint 8)
    → prisma/schema.prisma (model definition)
    → prisma/migrations/20260609100000_add_question_report/ (migration)
    → app/api/report-question/route.ts (POST endpoint)
    → components/QuizEngine.tsx (flag UI — idle/open/done state)
    → app/parent/review/page.tsx (list + resolve UI)
    → app/parent/review/actions.ts (resolveReportAction server action)
    → components/ResolveReportButton.tsx (client resolve button)
    → app/parent/page.tsx (summary card on dashboard)
    → scripts/validate-answers.js (CHECK 3)
    → docs/ARCHITECTURE_BASELINE.md (Sprint 8 section)
```

---

## Knowledge Gaps (nodes with no outbound links)

| Node | Missing Link |
|---|---|
| `content_repository/english/2 Family and Friends 5.pdf` | No processing record, no extraction log, no import |
| `modules/*/` directories | No runtime imports; no pathway from module design to production code |
| `assets/*/catalog.json` | Empty; no asset files referenced by any lesson |
| `docs/ASSET_MODEL.md` | Design doc but no implementation to link to |
| `docs/RAG_ARCHITECTURE.md` | Design doc but no implementation to link to |
