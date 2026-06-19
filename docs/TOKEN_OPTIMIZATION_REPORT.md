# Summer Quest — Token Optimization Report

> AI context cost analysis. Documents which docs cost the most tokens and recommends loading strategies.
> Snapshot date: 2026-06-09.

---

## Context Budget Problem

Every AI agent session starts fresh. Before writing a single line of code, the agent must load enough documentation to avoid repeating past bugs. The more text loaded, the more expensive each session. The goal is: **load only what's needed for the current task.**

The current `KNOWLEDGE_MAP.json` routing system is a good start, but several docs are loaded unnecessarily due to over-broad task categories.

---

## Document Size Analysis

| Document | Approx. Size | Loaded For | Assessment |
|---|---|---|---|
| `docs/BACKLOG.md` | ~49 KB | Every feature/ticket task | **Oversized.** Sprints 1–7 (done) are inline. Active tickets are Sprint 8+. |
| `docs/UX_FLOW.md` | ~31 KB | Every `ui` task | **Rarely read fully.** Flows are mostly derivable from live routes. |
| `docs/AGENTS.md` | ~18 KB | Content generation + features | Acceptable. Split into sub-sections if it grows further. |
| `docs/INCIDENTS.md` | ~12 KB | Bugs, quiz, ui tasks | Acceptable. Read-once for bug context. |
| `docs/TECHNICAL.md` | ~8 KB | Many task types | Acceptable. Well-targeted. |
| `docs/ARCHITECTURE_BASELINE.md` | ~7 KB | Architecture tasks | Acceptable. Will grow with each sprint. |
| `docs/CONTENT_IMPORT.md` | ~10 KB | Content import tasks | Acceptable. |
| `docs/CURRICULUM_STRUCTURE.md` | ~5 KB | Curriculum tasks | Acceptable. |
| `docs/AI_DATA_STANDARDS.md` | ~6 KB | Content tasks | Acceptable. |
| `docs/MODULE_ARCHITECTURE.md` | ~5 KB | Module tasks | Acceptable. Rarely needed. |
| `docs/RAG_ARCHITECTURE.md` | ~4 KB | RAG tasks | Acceptable. Future doc, rarely needed. |
| `docs/ASSET_MODEL.md` | ~3 KB | Asset tasks | Acceptable. Future doc, rarely needed. |
| `docs/MIGRATION_STRATEGY.md` | ~4 KB | Migration tasks | Acceptable. Future doc, rarely needed. |
| `docs/01_RULES.md` | ~3 KB | Rules tasks | Good. Small and dense. |
| `docs/00_AGENT_INDEX.md` | ~4 KB | Every session | Good. Targeted routing. |
| `docs/KNOWLEDGE_MAP.json` | ~2 KB | Every session | Good. |
| 54 × manifest files | ~8 KB each | Not auto-loaded | Good. Only loaded when explicitly reading manifests. |

**Total worst-case load (every category):** ~200 KB+
**Typical session load (3–5 relevant docs):** ~25–40 KB

---

## Top 2 Cost Drivers

### 1. `docs/BACKLOG.md` — 49 KB

**Problem:** Sprints 1–7 are complete and documented inline. They are never modified again, but every feature-related query loads all 49KB.

**Recommendation:**
- Create `docs/BACKLOG_ARCHIVE.md` — move all completed sprints (1–7) there
- Keep `docs/BACKLOG.md` — active tickets only (Sprint 8+), target < 10KB
- Update KNOWLEDGE_MAP.json to load only `BACKLOG.md` for current tasks
- Update KNOWLEDGE_MAP.json to add a `"sprint-history"` key that loads `BACKLOG_ARCHIVE.md`

**Estimated savings:** ~42KB per feature-related session

### 2. `docs/UX_FLOW.md` — 31 KB

**Problem:** Loaded for all `ui` tasks, but the flows are largely derivable from the live route structure. Full screen-by-screen descriptions are rarely needed in a code-writing session.

**Recommendation:**
- Add a 1-page summary section at the top of `UX_FLOW.md` (< 2KB) covering the main flows in outline form
- Move full screen descriptions to an appendix or separate `docs/UX_FLOW_DETAIL.md`
- For `ui` task routing, load only the summary
- Load full detail only for `ux-flows` task type (rare)

**Estimated savings:** ~25KB per UI-related session

---

## KNOWLEDGE_MAP.json Load Strategy Review

Current task categories that load large docs:

| Task Key | Docs Loaded | Total Size | Notes |
|---|---|---|---|
| `feature` | BACKLOG.md + TECHNICAL.md + AGENTS.md | ~75 KB | BACKLOG.md dominates |
| `backlog-tickets` | BACKLOG.md | ~49 KB | Direct load |
| `ui` | UX_FLOW.md + INCIDENTS.md + AGENTS.md | ~61 KB | UX_FLOW.md dominates |
| `bugs` | INCIDENTS.md | ~12 KB | Acceptable |
| `content-generation` | AGENTS.md + README + AI_DATA_STANDARDS.md | ~30 KB | Acceptable |

**Recommended:** After splitting BACKLOG.md, reassess `feature` and `backlog-tickets` to confirm < 10KB per task load.

---

## Manifest Loading

54 manifest files × ~8 KB each = ~432 KB total. These are never auto-loaded by KNOWLEDGE_MAP.json — agents only read them when explicitly asked to audit or edit manifests.

**Current practice (correct):** Read manifests individually when needed. Do not load all 54.

**Risk:** An agent tasked with "audit all manifests" may read all 54 in sequence, consuming 432KB of context. Use a targeted Grep instead of bulk reads.

---

## Recommended Token Budget Per Task Type

| Task Type | Target context load | Notes |
|---|---|---|
| Bug fix | < 15 KB | INCIDENTS.md + relevant component |
| New feature | < 20 KB | BACKLOG_ACTIVE + TECHNICAL.md |
| Content generation | < 25 KB | AGENTS.md + AI_DATA_STANDARDS.md + content/README.md |
| Schema change | < 15 KB | schema.prisma + TECHNICAL.md + 01_RULES.md |
| Architecture review | < 30 KB | ARCHITECTURE_BASELINE + TECHNICAL.md + INCIDENTS.md |
| distDir bump | < 5 KB | INCIDENTS.md quick reference |

---

## Recommended Actions

| # | Action | Impact | Priority |
|---|---|---|---|
| 1 | Split `docs/BACKLOG.md` → active + archive | -42KB per feature session | HIGH |
| 2 | Add summary section to `docs/UX_FLOW.md` | -25KB per UI session | MEDIUM |
| 3 | Update KNOWLEDGE_MAP.json `feature` to load `BACKLOG_ACTIVE.md` | Requires action #1 first | HIGH |
| 4 | Add `ux-summary` task type to KNOWLEDGE_MAP.json for lightweight UI guidance | Decouples quick vs. deep UX loads | LOW |
| 5 | Add manifest count / subject coverage table to `summer-quest/content/README.md` | Avoids reading 54 files to get coverage data | Done ✅ |
