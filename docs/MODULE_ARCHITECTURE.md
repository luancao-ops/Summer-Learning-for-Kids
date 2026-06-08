# Summer Quest — Module Architecture

> Defines the future subject module structure.
> Phase 3 deliverable — folder structure and documentation only.
> No runtime code exists yet. This documents what modules WILL become.

---

## What is a Module?

A module is a self-contained subject package. It owns:
- Its curriculum definition
- Its raw content (JSON lessons, assets)
- Its import tooling
- Its game/activity extensions

Modules are **independent** — adding or updating one module does not affect others.

---

## Current vs. Future

| | Current (V1) | Future (V2+) |
|---|---|---|
| Subjects | Flat DB records in `Subject` table | Self-contained modules with owned content |
| Content | In `Lesson`/`Question` tables, imported via manifest | In `modules/{subject}/content/` with typed importers |
| Assets | None | In `modules/{subject}/assets/` with asset catalog |
| Games | None | In `modules/{subject}/games/` |
| Import | Manual manifest + `npm run content:import` | Per-module importer scripts |

**Migration to module architecture requires separate approval (V2 Phase 9).**
The folder structure created in Phase 3 is scaffolding only — it does not replace the current runtime.

---

## Module Folder Structure

```
modules/
├── english/
│   ├── MODULE.md          ← Module definition (status, grades, topics, owner)
│   ├── README.md          ← Developer guide for this module
│   ├── content/           ← Structured lesson JSON (future imports)
│   ├── assets/            ← Images, audio, diagrams (referenced by assetId)
│   ├── games/             ← Mini-games and interactive activities
│   └── importers/         ← Scripts to import content into the DB
├── math/
│   └── (same structure)
├── vietnamese/
│   └── (same structure)
└── science/
    └── (same structure)
```

---

## MODULE.md Schema

Every `MODULE.md` must contain:

```markdown
# {Subject} Module

## Status
{Active | In Development | Planned}

## Grade Levels
{e.g. Grade 3–5}

## Students
{girl | boy | both}

## Curriculum Reference
{Vietnamese Ministry of Education grade-level standard}

## Topics
- Topic 1
- Topic 2
- ...

## Content Location
modules/{subject}/content/

## Current DB Lessons
{Count as of last audit}

## Import Pipeline
See: docs/CONTENT_IMPORT.md

## Notes
{Any special rules, limitations, or future plans}
```

---

## Module Status Values

| Status | Meaning |
|---|---|
| `Active` | Content exists in DB, children are learning from it |
| `In Development` | Content being created, not yet in DB |
| `Planned` | Architecture defined, no content yet |

---

## Module Isolation Rules

1. Each module owns its `orderIndex` namespace — no cross-module collisions
2. Asset IDs are namespaced by subject: `{subject}-{type}-{slug}` (e.g. `math-diagram-fractions-01`)
3. Lesson IDs are namespaced by module: `{studentTarget}-{grade}-{subject}-{slug}`
4. Importers in one module must not write to another module's DB records

---

## Future: Runtime Module Loading

When approved (separate approval required), modules will:
1. Register themselves via a `module.config.ts` at the module root
2. Be discovered at build time by the Next.js app
3. Expose content to the DB import pipeline automatically

**This is NOT implemented.** The current runtime uses the flat `Lesson`/`Question` DB structure.

---

## Relationship to Other Docs

| Doc | Relationship |
|---|---|
| `docs/CURRICULUM_STRUCTURE.md` | What topics each module covers, by grade |
| `docs/CONTENT_IMPORT.md` | How content flows from raw files into the DB |
| `docs/ASSET_MODEL.md` | How assets are catalogued and referenced |
| `docs/RAG_ARCHITECTURE.md` | How module content will be chunked for retrieval |
| `docs/ARCHITECTURE_BASELINE.md` | Current production state this builds on |
