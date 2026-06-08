# Summer Quest — Future Migration Strategy

> Phase 9 deliverable — planning document only.
> DO NOT MIGRATE. This document describes what a future migration WOULD look like.
> No schema changes, no code changes, no data changes.

---

## Why This Document Exists

The current V1 data model is flat and functional for 2 students with 3 subjects.
As the platform grows to support more students, more subjects (Science, Grade 6+), and richer
content types (vocabulary, assets, books), the schema will need to evolve.

This document maps the migration path so that when the time comes, no design decisions are made under pressure.

**Current rule:** No migration happens without explicit parent approval + a separate implementation sprint.

---

## Current Schema (V1 — Production)

```
Subject
  └── Lesson (studentTarget, grade, phase, orderIndex)
        └── Question (type, options, correctAnswer)

Student
  └── Attempt (score, xp, coins)
        └── AttemptAnswer (questionId, isCorrect)
  └── Mistake (lessonId, questionId, resolved)
  └── StudentBadge
  └── StudentReward
  └── ChoreAssignment
  └── ReadingEntry
```

**Strengths:**
- Simple — fast to build, fast to query
- Flat lesson list works well for current content volume
- Easy to import new lessons via manifest

**Limitations:**
- No curriculum hierarchy (can't say "Chapter 3, Unit 2")
- No vocabulary model (vocabulary embedded in lesson text)
- No asset model (lesson content is text-only)
- `studentTarget` is a string field — couples content to specific students
- No reuse of questions across lessons
- Difficult to build adaptive sequencing without unit/objective structure

---

## Target Schema (V2 — Future, Not Approved)

```
Subject
  └── Book (grade, title, edition)
        └── Unit (orderIndex, title, topic)
              └── Lesson (orderIndex, title, learningObjective)
                    ├── Objective (measurable outcome)
                    ├── Vocabulary (term, definition, assetId)
                    └── Question (type, options, correctAnswer)

Asset
  └── AssetCatalog (assetId, subject, type, path, tags)

Student
  └── Attempt  ← unchanged
  └── Mistake  ← unchanged
  └── Progress (bookId, unitId, lessonId, completedAt) ← replaces flat orderIndex tracking
```

---

## Field-by-Field Migration Map

### Lesson

| V1 Field | V2 Target | Notes |
|---|---|---|
| `id` | `Lesson.id` | Keep stable — existing Attempt and Mistake records reference it |
| `subjectId` | `Lesson.subjectId` (via Unit → Book → Subject) | Same value, new path |
| `studentTarget` | Remove from Lesson → move to `BookAssignment` table | Decouple content from student |
| `grade` | `Book.grade` | Grade moves up to Book level |
| `phase` | `Unit.topic` | Phase becomes a richer unit concept |
| `orderIndex` | `Lesson.orderIndex` within Unit | Scoped to unit, not global subject list |
| `title` | `Lesson.title` | Unchanged |
| `learningObjective` | `Objective.text` | Becomes a separate model for querying |
| `shortExplanation` | `Lesson.shortExplanation` | Unchanged |
| `content` | `Lesson.content` | Unchanged (Markdown body) |
| `storyContext` | `Lesson.storyContext` | Unchanged |
| `rewardConfig` | `Lesson.rewardConfig` | Unchanged |
| `approved` | `Lesson.approved` | Unchanged |

### Question

| V1 Field | V2 Target | Notes |
|---|---|---|
| `id` | `Question.id` | Keep stable — Mistake and AttemptAnswer reference it |
| `lessonId` | `Question.lessonId` | Unchanged |
| `orderIndex` | `Question.orderIndex` | Unchanged |
| `type` | `Question.type` | Unchanged |
| `text` | `Question.text` | Unchanged |
| `options` | `Question.options` | Unchanged (JSON string) |
| `correctAnswer` | `Question.correctAnswer` | Unchanged |
| `explanation` | `Question.explanation` | Unchanged |
| `hint` | `Question.hint` | Unchanged |

### Student

| V1 Field | V2 Target | Notes |
|---|---|---|
| `id` | `Student.id` | Keep `"girl"` / `"boy"` — too many FK references to change |
| All progress fields | Unchanged | xp, coins, streak, readingStreak untouched |
| `Attempt` | Unchanged | All attempt records preserved as-is |
| `Mistake` | Unchanged | All mistake records preserved as-is |
| `StudentBadge` | Unchanged | All badge records preserved |
| `StudentReward` | Unchanged | All reward records preserved |

---

## New Models (V2 — Not Yet Approved)

### Book
```prisma
model Book {
  id        String  @id
  subjectId String
  grade     Int
  title     String
  edition   String?
  units     Unit[]
}
```

### Unit
```prisma
model Unit {
  id         String @id
  bookId     String
  orderIndex Int
  title      String
  topic      String
  lessons    Lesson[]
}
```

### Objective
```prisma
model Objective {
  id       String @id
  lessonId String
  text     String
}
```

### Vocabulary
```prisma
model Vocabulary {
  id         String  @id
  lessonId   String
  term       String
  definition String
  assetId    String?
}
```

### Asset (replaces catalog.json files)
```prisma
model Asset {
  id          String @id
  subject     String
  type        String
  path        String
  grade       Int
  tags        String
  description String
  source      String
}
```

---

## Migration Safety Rules

These rules apply when the migration is eventually approved:

| Rule | Detail |
|---|---|
| Never delete Lesson records | Existing Attempt and Mistake records reference `lessonId` — lessons must stay |
| Never delete Question records | Mistake and AttemptAnswer reference `questionId` |
| Never change `Student.id` | `"girl"` and `"boy"` are referenced across the entire DB |
| Migrate in a separate sprint | Never combine a schema migration with feature work |
| Backup dev.db first | Copy `prisma/dev.db` to a timestamped backup before running any migration |
| Test on a copy | Run the migration on a copy of the DB before applying to production |
| Keep `approved` logic | The `Lesson.approved` gate must be preserved in any new schema |

---

## Migration Sequence (When Approved)

This is the recommended order to minimize risk:

```
Step 1: Add new tables (Book, Unit, Objective, Vocabulary, Asset)
        ← additive only, no existing tables touched

Step 2: Backfill new tables from existing Lesson data
        ← create one default Book per subject/grade
        ← create one default Unit per phase value
        ← link existing Lessons to their Units

Step 3: Add foreign keys from Lesson to Unit
        ← nullable at first, populate, then make required

Step 4: Migrate studentTarget to BookAssignment table
        ← keep Lesson.studentTarget as nullable for backward compat during transition

Step 5: Update application queries to use new hierarchy
        ← feature sprint, separate approval

Step 6: Remove deprecated fields
        ← only after Step 5 is fully verified in production
```

---

## What Is NOT Approved

The following require their own approval before implementation:

| Item | Reason |
|---|---|
| Adding `Book`, `Unit`, `Objective`, `Vocabulary`, `Asset` tables | Schema change |
| Removing `Lesson.studentTarget` | Breaking change — many queries depend on it |
| Changing `Lesson.orderIndex` scope | Affects all lesson ordering logic |
| Vector database implementation | Infrastructure change |
| Runtime module loading | Architecture change |
| Plugin architecture | Architecture change |

---

## Related Docs

| Doc | Relationship |
|---|---|
| `docs/ARCHITECTURE_BASELINE.md` | V1 schema that this migration evolves from |
| `docs/MODULE_ARCHITECTURE.md` | How modules map to the Book/Unit hierarchy |
| `docs/CURRICULUM_STRUCTURE.md` | Grade/topic hierarchy that informs Book and Unit structure |
| `docs/RAG_ARCHITECTURE.md` | RAG chunking strategy assumes the V2 hierarchy |
| `prisma/schema.prisma` | Current production schema — source of truth for V1 |
