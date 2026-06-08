# Summer Quest — RAG Architecture

> Future AI retrieval architecture plan.
> Phase 8 deliverable — documentation only.
> No vector database or retrieval system is implemented yet.

---

## Current State (V1)

All content is served directly from SQLite:
- Lesson content loaded by `lessonId` from `Lesson` table
- Questions loaded by `lessonId` from `Question` table
- No semantic search, no vector index, no embeddings

---

## Why RAG (Future)

As content grows to 300+ lessons per student across 3–4 subjects, two AI use cases emerge:

1. **Content generation:** AI needs to know what already exists before generating new lessons (avoid duplicates, maintain difficulty progression)
2. **Adaptive hints:** AI could retrieve the most relevant lesson chunk to explain a concept when a student gets a question wrong repeatedly

RAG (Retrieval-Augmented Generation) enables both without feeding the entire lesson library into every AI prompt.

---

## Guiding Rules

| Rule | Detail |
|---|---|
| Chunk size | 200–500 words per chunk |
| Never retrieve | Entire books or entire subjects |
| Always retrieve | Specific chunks relevant to the query |
| Metadata matters | Every chunk must carry: `subjectId`, `grade`, `studentTarget`, `lessonId`, `chunkType` |

---

## Retrieval Units (Chunk Types)

| Chunk Type | Contents | Typical Size |
|---|---|---|
| `lesson_chunk` | One section of lesson content (intro, explanation, or example) | 200–400 words |
| `question_chunk` | One question + its explanation | 50–150 words |
| `vocabulary_chunk` | A set of related vocabulary items with definitions | 100–300 words |
| `objective_chunk` | The learning objective + short explanation of a lesson | 50–100 words |

A single 10-question lesson produces approximately:
- 2–3 `lesson_chunk` records
- 10 `question_chunk` records
- 1 `objective_chunk` record

---

## Chunk Metadata Schema (Future)

```json
{
  "chunkId": "girl-g4-math-x001-lesson-01",
  "lessonId": "girl-g4-math-x001",
  "chunkType": "lesson_chunk",
  "subjectId": "math",
  "grade": 4,
  "studentTarget": "girl",
  "orderIndex": 1,
  "text": "...",
  "embedding": [0.12, -0.45, ...]
}
```

---

## Retrieval Pipeline (Future)

```
Query (e.g. "find lessons about fractions for Grade 4 girl")
    ↓
Embed query → vector
    ↓
Search vector store by cosine similarity
    ↓
Filter by metadata (subjectId, grade, studentTarget)
    ↓
Return top-K chunks (K = 3–10 depending on use case)
    ↓
Inject chunks into AI prompt context
    ↓
AI generates response grounded in retrieved content
```

---

## Vector Store Options (Future Decision)

| Option | Pros | Cons |
|---|---|---|
| SQLite + sqlite-vec extension | No new infrastructure; works local-first | Slower for large datasets |
| Chroma (local) | Fast; good Python SDK | Requires separate process |
| LanceDB | Embedded, fast, TypeScript SDK | Newer, less documented |

**Recommendation:** Start with `sqlite-vec` to stay local-first and avoid adding a new service dependency. Re-evaluate if content grows beyond 10,000 chunks.

**This decision requires separate approval before implementation.**

---

## Integration Points (Future)

| Where | How RAG is used |
|---|---|
| Content generation | Before generating a new lesson, retrieve existing `objective_chunk` records for same grade/subject to avoid duplicating topics |
| Mistake review | When student gets question wrong 3+ times, retrieve relevant `lesson_chunk` and `vocabulary_chunk` to surface as a hint |
| Parent dashboard | Retrieve related lessons when parent searches for a topic |

---

## What Must NOT Be Retrieved

- Entire subjects (too much context, expensive)
- Entire grade curricula
- Student progress data (this stays in SQLite only, never in vector store)
- Parent credentials or access codes

---

## Chunking Strategy (Future Implementation Guide)

When chunking lessons:
1. Split `Lesson.content` (Markdown) by heading (`##`) — each section becomes one `lesson_chunk`
2. If a section > 500 words, split at paragraph boundaries
3. Never split mid-sentence
4. Each `question_chunk` = one `Question` record (text + explanation combined)
5. `objective_chunk` = `learningObjective` + `shortExplanation` concatenated

---

## Acceptance Criteria for Phase 8

- [ ] RAG architecture documented (this file ✅)
- [ ] Chunk types defined
- [ ] Metadata schema defined
- [ ] Vector store options evaluated (not decided)
- [ ] No runtime changes — no vector DB, no embeddings generated yet
