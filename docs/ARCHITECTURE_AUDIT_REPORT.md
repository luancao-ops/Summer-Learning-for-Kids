# Summer Quest — Architecture Audit Report

> V2 Knowledge Architecture Audit. Snapshot date: 2026-06-09.
> This document is READ-ONLY history. Do not act on recommendations here without explicit approval.

---

## 1. Existing Document Inventory

| File | Type | Size (approx) | Purpose | Loaded by KNOWLEDGE_MAP.json? |
|---|---|---|---|---|
| `docs/00_AGENT_INDEX.md` | Routing | ~4 KB | AI agent entry point — routes to correct doc for any task | No (loaded first, before map) |
| `docs/01_RULES.md` | Reference | ~3 KB | Compressed critical rules for code review | Yes (`rules`) |
| `docs/AGENTS.md` | Workflow | ~18 KB | Full PM/Dev workflow, content generation prompts, onboarding | Yes (`content-generation`, `feature`, `ui`) |
| `docs/AI_DATA_STANDARDS.md` | Standards | ~6 KB | Data quality schema for AI-generated lessons | Yes (`ai-data-standards`, `content-import`) |
| `docs/ARCHITECTURE_BASELINE.md` | Baseline | ~7 KB | Phase 0 baseline snapshot — full architecture description | Yes (`architecture`, `migration`) |
| `docs/ASSET_MODEL.md` | Design | ~3 KB | Future asset/image model (not yet implemented) | Yes (`assets`, `pdf-import`) |
| `docs/BACKLOG.md` | Tickets | ~49 KB | All sprint tickets (Sprints 1–8, future) | Yes (`feature`, `backlog-tickets`) |
| `docs/CONTENT_IMPORT.md` | Workflow | ~10 KB | Content import pipeline — V1 active, V2 future | Yes (`content-import`, `pdf-import`) |
| `docs/CURRICULUM_STRUCTURE.md` | Reference | ~5 KB | Grade 3–6 curriculum hierarchy per subject | Yes (`curriculum`) |
| `docs/INCIDENTS.md` | History | ~12 KB | Bug history with root causes and prevention rules | Yes (`bugs`, `quiz`, `ui`, `distdir-eperm`, `prisma-generate-eperm`) |
| `docs/KNOWLEDGE_MAP.json` | Routing | ~2 KB | Task → docs mapping for AI routing | N/A (is the map itself) |
| `docs/MIGRATION_STRATEGY.md` | Design | ~4 KB | Future migration approach (no-code evolution) | Yes (`migration`) |
| `docs/MODULE_ARCHITECTURE.md` | Design | ~5 KB | Module scaffold definition (English/Math/Vi/Science) | Yes (`modules`, `architecture-v2`) |
| `docs/PROJECT.md` | Vision | ~6 KB | Project goals, student profiles, game design | Yes (`project-goals`) |
| `docs/RAG_ARCHITECTURE.md` | Design | ~4 KB | Future RAG/vector search architecture | Yes (`rag`, `architecture-v2`) |
| `docs/TECHNICAL.md` | Reference | ~8 KB | Tech stack, routes, schema summary, setup, commands | Yes (`feature`, `setup-deployment`, `database`) |
| `docs/UX_FLOW.md` | Flows | ~31 KB | Full user flows with screen descriptions | Yes (`ux-flows`, `ui`) |

**Also present (untracked new files, not yet in KNOWLEDGE_MAP.json):**

| File | Type | Notes |
|---|---|---|
| `docs/CONTENT_IMPORT_WORKFLOW.md` | Workflow | Untracked — possible duplicate of `docs/CONTENT_IMPORT.md` |
| `docs/SUMMER_CURRICULUM_BLUEPRINT.md` | Planning | Untracked — possible duplicate of `docs/CURRICULUM_STRUCTURE.md` |

---

## 2. Missing Documents

| Document | Required by | Priority |
|---|---|---|
| `docs/ARCHITECTURE_AUDIT_REPORT.md` | V2 Architecture Brief | HIGH — being created now |
| `docs/KNOWLEDGE_GRAPH.md` | V2 Architecture Brief | HIGH — being created now |
| `docs/ROUTING_AUDIT.md` | V2 Architecture Brief | HIGH — being created now |
| `docs/TOKEN_OPTIMIZATION_REPORT.md` | V2 Architecture Brief | MEDIUM |
| `docs/ARCHITECTURE_VALIDATION.md` | V2 Architecture Brief | MEDIUM |
| `docs/CONTENT_REPOSITORY_GUIDE.md` | V2 Architecture Brief | MEDIUM |
| `summer-quest/content/README.md` | `docs/KNOWLEDGE_MAP.json` (`content-generation`) | HIGH — referenced but missing |

**Note:** `summer-quest/content/README.md` is referenced in `KNOWLEDGE_MAP.json` and will be created during this audit. All other missing files are being created during this audit run.

---

## 3. Duplicate Documents

| Potential Duplicate Pair | Status | Recommendation |
|---|---|---|
| `docs/CONTENT_IMPORT_WORKFLOW.md` vs `docs/CONTENT_IMPORT.md` | Both exist, CONTENT_IMPORT.md is authoritative and tracked | Review CONTENT_IMPORT_WORKFLOW.md — if it adds nothing new, delete it. If it adds V2 workflow detail, merge content into CONTENT_IMPORT.md Part 2+ |
| `docs/SUMMER_CURRICULUM_BLUEPRINT.md` vs `docs/CURRICULUM_STRUCTURE.md` | Both exist, CURRICULUM_STRUCTURE.md is authoritative and tracked | Review SUMMER_CURRICULUM_BLUEPRINT.md — if it contains summer-specific scheduling not in CURRICULUM_STRUCTURE.md, keep as supplement; otherwise merge and delete |

---

## 4. Conflicting Documents

| Conflict | Files Involved | Severity | Status |
|---|---|---|---|
| `distDir` value: `docs/01_RULES.md` said `.next-build6` | `docs/01_RULES.md` vs actual `.next-build8` | HIGH | **FIXED** in this audit |
| `distDir` value: `docs/ARCHITECTURE_BASELINE.md` said `.next-build6` | `docs/ARCHITECTURE_BASELINE.md` vs actual `.next-build8` | HIGH | **FIXED** in this audit |
| `distDir` value: `docs/00_AGENT_INDEX.md` said `.next-build6` | `docs/00_AGENT_INDEX.md` vs actual `.next-build8` | HIGH | **FIXED** in this audit |
| Manifest naming convention mismatch | `docs/CONTENT_IMPORT.md` documents `batch-{subject}-{studentTarget}-g{grade}-{n}` but 46 of 50 actual files use `batch-{studentTarget}-g{grade}-{subject}-{n}` | MEDIUM | Unresolved — `CONTENT_IMPORT.md` should be corrected to match actual files |
| PDF rule violation | `content_repository/README.md` states "Never commit PDF files"; `content_repository/english/2 Family and Friends 5.pdf` exists in the repository | HIGH | Unresolved — PDF must be moved outside repo or gitignored; see §8 |
| Broken doc reference | `docs/KNOWLEDGE_MAP.json` "content-generation" referenced `summer-quest/content/README.md` which didn't exist | MEDIUM | **FIXED** in this audit (file created + path valid) |

---

## 5. Outdated Documents

| Document | What's Outdated | Fix Applied |
|---|---|---|
| `docs/01_RULES.md` | distDir = `.next-build6` (actual = `.next-build8`); no mention of `QuestionReport` raw SQL rule | **FIXED** — distDir updated, QuestionReport rule added |
| `docs/00_AGENT_INDEX.md` | distDir = `.next-build6` (actual = `.next-build8`) | **FIXED** — distDir updated |
| `docs/ARCHITECTURE_BASELINE.md` | distDir = `.next-build6`; missing `QuestionReport` model; missing `/api/report-question`; missing `ResolveReportButton.tsx` | **FIXED** — all four items updated, Sprint 8 section added |
| `docs/TECHNICAL.md` | Missing `QuestionReport` in DB table; missing `ResolveReportButton.tsx` in components; missing `/api/report-question` in route list; no raw SQL caveat for new models | **FIXED** — all items updated |
| `docs/CONTENT_IMPORT.md` | Manifest naming convention documented as `batch-{subject}-{studentTarget}-g{grade}-{n}` but actual majority convention is `batch-{studentTarget}-g{grade}-{subject}-{n}`; Part 5 references deprecated P{1-4} answer pattern | Not yet fixed — recommended in §9 |

---

## 6. Unused Documents

| Document | Usage | Analysis |
|---|---|---|
| `docs/UX_FLOW.md` (~31 KB) | Listed in KNOWLEDGE_MAP.json under `ux-flows` and `ui` tasks | Theoretically loaded for UI tasks, but AI sessions rarely read it in full. It covers flows already derivable from the live routes. Consuming ~31KB of context for reference material that's mostly derivable from code. Candidate for lazy-load or summary extraction. |
| `docs/BACKLOG.md` (~49 KB) | Loaded for every feature/ticket query | Sprints 1–7 (completed) are archived inline, bloating the file. Active tickets are Sprints 8+. Splitting would reduce AI context cost significantly (see §11 TOKEN_OPTIMIZATION_REPORT). |
| `docs/ASSET_MODEL.md` | Listed under `assets` and `pdf-import` | Future design doc. Assets are not yet implemented in runtime. Loaded when asking about assets despite having no actionable runtime code yet. |
| `docs/RAG_ARCHITECTURE.md` | Listed under `rag` and `architecture-v2` | Future design doc. No RAG exists yet. Same pattern as ASSET_MODEL. |
| `docs/MIGRATION_STRATEGY.md` | Listed under `migration` | Future design doc. Current version is V1 only. |

---

## 7. Knowledge Gaps

| Gap | Impact | Recommended Action |
|---|---|---|
| QuestionReport system (Sprint 8) not documented in any single doc | AI agents in future sessions won't know the flag system exists without reading schema directly | Added Sprint 8 section to ARCHITECTURE_BASELINE.md; KNOWLEDGE_MAP.json `question-reports` key added |
| `$queryRaw`/`$executeRaw` pattern for runtime schema additions not explained in any consolidated place | AI will attempt typed Prisma calls on new models, which will fail with runtime errors | Added to INCIDENTS.md (rule exists there) and to 01_RULES.md as explicit DB rule |
| Manifest naming convention discrepancy not documented | Future AI content generators may use wrong naming pattern, creating 3rd convention | CONTENT_IMPORT.md needs a correction note |
| No docs describe the `checks` field in manifest JSON | AI content generators may omit it or set it incorrectly | `summer-quest/content/README.md` explains this; `docs/AI_DATA_STANDARDS.md` also covers it |
| `content_repository/english/2 Family and Friends 5.pdf` in repo violates documented rule | PDF may grow in size, NTFS permission issues possible, violates security posture | See §8 Risk and §9 Recommended Actions |
| No doc describes what `approved: false` means to the QuizEngine | AI fixing quiz bugs may not know AI lessons are invisible until parent approval | Documented in ARCHITECTURE_BASELINE.md under current architecture |
| No single doc describes end-to-end flag/report flow | Future developers debugging the flag system must read 5 files | ARCHITECTURE_BASELINE.md Sprint 8 section provides consolidated view |

---

## 8. Future Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `docs/BACKLOG.md` grows past 60KB | HIGH (adds ~5KB per sprint) | AI context waste, slower responses | Split into `BACKLOG_ACTIVE.md` + `BACKLOG_ARCHIVE.md` |
| Third manifest naming convention introduced | MEDIUM (each content generator works from docs) | Import script may not recognize files; namespace collisions | Fix CONTENT_IMPORT.md now; enforce convention in AI_DATA_STANDARDS.md |
| PDF files accumulate in `content_repository/` | MEDIUM (one already exists) | Repo size bloat; violates documented rule | Add `*.pdf` to `.gitignore` at project root; remove existing PDF |
| `prisma generate` remains unrun after Sprint 8 | MEDIUM (any new model addition will hit same EPERM) | All future new Prisma models need raw SQL workaround | Document as known limitation; plan `prisma generate` run when server is stopped |
| `docs/UX_FLOW.md` grows further (currently 31KB) | LOW-MEDIUM | AI context cost increases for every UI task | Extract summary; move full flows to an archive doc |
| `distDir` bumped again (EPERM cycle) | MEDIUM (has happened 8 times) | All 6 files need updating; if any missed, launcher breaks | 6-file update checklist is in AGENTS.md; add a pre-build check script |
| New Lesson added with `approved: true` by mistake in manifest | LOW | Children see unreviewed content | CONTENT_IMPORT.md and AI_DATA_STANDARDS.md both warn about this; currently mitigated by docs |
| `summer-quest/content/README.md` not created | Was HIGH before this audit | KNOWLEDGE_MAP.json routing would fail | **Resolved** — file created in this audit |

---

## 9. Recommended Actions

### Immediate (blocking correctness)

| # | Action | File(s) | Status |
|---|---|---|---|
| 1 | Fix distDir in `docs/01_RULES.md` | `docs/01_RULES.md` | **Done** |
| 2 | Fix distDir in `docs/00_AGENT_INDEX.md` | `docs/00_AGENT_INDEX.md` | **Done** |
| 3 | Fix distDir in `docs/ARCHITECTURE_BASELINE.md` | `docs/ARCHITECTURE_BASELINE.md` | **Done** |
| 4 | Add QuestionReport to `docs/TECHNICAL.md` | `docs/TECHNICAL.md` | **Done** |
| 5 | Add QuestionReport to `docs/ARCHITECTURE_BASELINE.md` | `docs/ARCHITECTURE_BASELINE.md` | **Done** |
| 6 | Fix broken reference in `docs/KNOWLEDGE_MAP.json` | `docs/KNOWLEDGE_MAP.json` | **Done** |
| 7 | Create `summer-quest/content/README.md` | new file | **Done** |

### High Priority

| # | Action | File(s) | Status |
|---|---|---|---|
| 8 | Fix manifest naming convention in `docs/CONTENT_IMPORT.md` | `docs/CONTENT_IMPORT.md` | Pending |
| 9 | Remove or gitignore `content_repository/english/2 Family and Friends 5.pdf` | `.gitignore` / file | Pending — needs parent decision |
| 10 | Review `docs/CONTENT_IMPORT_WORKFLOW.md` — merge or delete | `docs/CONTENT_IMPORT_WORKFLOW.md` | Pending |
| 11 | Review `docs/SUMMER_CURRICULUM_BLUEPRINT.md` — merge or delete | `docs/SUMMER_CURRICULUM_BLUEPRINT.md` | Pending |

### Medium Priority

| # | Action | File(s) | Status |
|---|---|---|---|
| 12 | Split `docs/BACKLOG.md` into active + archive | `docs/BACKLOG.md` | Pending |
| 13 | Remove deprecated P{1-4} pattern from `docs/CONTENT_IMPORT.md` Part 5 | `docs/CONTENT_IMPORT.md` | Pending |
| 14 | Add `*.pdf` rule to root `.gitignore` | `.gitignore` | Pending |
| 15 | Run `prisma generate` when server is stopped; update 01_RULES.md if pattern changes | N/A | Pending |

### Low Priority

| # | Action | File(s) | Status |
|---|---|---|---|
| 16 | Add lazy-load summary to `docs/UX_FLOW.md`; move full content to archive | `docs/UX_FLOW.md` | Pending |
| 17 | Add pre-build validation script that checks all 6 distDir files match | `scripts/` | Pending |

---

*Generated by V2 Knowledge Architecture Audit — 2026-06-09. Do not implement actions marked Pending without explicit parent approval.*
