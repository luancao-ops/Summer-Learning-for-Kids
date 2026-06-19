# Book Import Workflow

> Step-by-step process for importing a physical textbook or PDF into Summer Quest.
> Overview: `README.md`
> Full pipeline with DB import: `docs/CONTENT_IMPORT.md`

---

## Before You Start

**Required reading:**
- `docs/01_RULES.md` — PDF rules, Knowledge Package rules
- `docs/AI_DATA_STANDARDS.md` — Knowledge Package schema, lesson format standards
- `docs/CURRICULUM_STRUCTURE.md` — confirm which grade the book targets
- `modules/{subject}/MODULE.md` — confirm subject ownership and current coverage gaps

**Decision gate:** Does a Knowledge Package already exist for this book?
- Yes → skip to Step 5 (Generate Lessons)
- No → continue from Step 1

---

## Step 1 — Drop PDF into source_materials/

Place the source PDF in the correct subject folder:

```
source_materials/{subject}/
```

**Naming:** Use the book's full title as the filename. No abbreviations.

```
source_materials/english/2 Family and Friends 5.pdf        ✅
source_materials/english/ff5.pdf                           ❌  (ambiguous)
```

**Rules:**
- PDFs are gitignored — they will NOT be committed to the repository
- Do NOT place PDFs in `content_repository/` or `imports/`
- One PDF = one source material. Do not merge books into a single file.

---

## Step 2 — Register the Source

Before extracting anything, register the source in:

```
content_repository/{subject}/metadata/sources.json
```

Add a new entry:

```json
{
  "sourceId": "src-{subject}-g{grade}-{title-slug}",
  "title": "Full Book Title",
  "publisher": "Publisher Name",
  "subject": "{subject}",
  "grade": {grade},
  "language": "en",
  "localPath": "source_materials/{subject}/filename.pdf",
  "registeredAt": "YYYY-MM-DD",
  "status": "registered"
}
```

Update `status` at each step: `registered` → `extracting` → `knowledge-extracted` → `lessons-generated` → `published`.

---

## Step 3 — Generate Knowledge Package

Create a new folder:

```
imports/{subject}/grade{N}/{BookSlug}/
```

**BookSlug:** CamelCase, no spaces, no version numbers in the slug itself.

```
imports/english/grade5/FamilyandFriend5/        ✅
imports/english/grade5/family_and_friends_5/    ❌  (use CamelCase)
```

Generate all 6 required files. See schema in `docs/AI_DATA_STANDARDS.md` — Knowledge Package Standard section.

### 3a — manifest.json

Package identity and completeness tracker. **Create this first.**

```json
{
  "packageId": "{subject}-g{N}-{BookSlug}",
  "sourceId": "src-{subject}-g{N}-{title-slug}",
  "title": "Book Title",
  "subject": "{subject}",
  "grade": {N},
  "targetStudents": ["girl", "boy"],
  "extractedAt": "YYYY-MM-DD",
  "status": "knowledge-extracted",
  "files": {
    "curriculum": true,
    "vocabulary": true,
    "grammar": true,
    "assessmentSeed": true,
    "assets": true
  }
}
```

### 3b — curriculum.json

Map every unit/chapter:
- Unit number, title, page range
- Vocabulary sets (names only — words go in vocabulary.json)
- Grammar structure name
- Phonics focus
- Values/themes
- Skills (reading, writing, speaking, listening)
- Learning objectives (bullet list)

### 3c — vocabulary.json

All vocabulary organised by unit → set → word. Each word entry:

```json
{
  "word": "endangered",
  "partOfSpeech": "adjective",
  "definition": "At serious risk of becoming extinct",
  "example": "Tigers are endangered animals.",
  "vietnameseHint": "có nguy cơ tuyệt chủng"
}
```

Vietnamese hints are mandatory — both students are native Vietnamese speakers.

### 3d — grammar.json

Each grammar structure per unit:
- Structure name and concept
- Form table (affirmative / negative / question / short answer)
- Minimum 4 examples per form type
- Common errors with corrections
- Teaching note
- Vietnamese translation note

### 3e — assessment_seed.json

Question topics and stems for each unit. **This is NOT a quiz.** It provides raw material for quiz generation later.

For each unit include:
- Key assessment topics (what concepts to test)
- Sample question stems (10–15 per unit)
- Vocabulary to prioritise in questions
- Grammar patterns to test
- Skill areas (reading comprehension, grammar application, vocabulary meaning)

```json
{
  "unit": 1,
  "assessmentTopics": [
    "Identify extended family members by name",
    "Use adjectives to describe physical appearance"
  ],
  "questionStems": [
    "Your parent's sister is your ___.",
    "Which word describes hair with tight spirals?",
    "Complete: 'She _____ just arrived home.' (present perfect)"
  ]
}
```

### 3f — assets.json

Catalogue all images, diagrams, and illustrations in the book:
- Asset ID (naming: `{subject}-{type}-{description-slug}-{n}`)
- Type: `illustration | photo | diagram | comic-strip | table | chart`
- Description of what the asset shows
- Estimated page number
- Priority: `HIGH | MEDIUM | LOW`
- `extracted: false` (until image files are actually extracted)

If PDF rendering tools (pdftoppm / pdfplumber) are unavailable, catalogue the expected assets based on book knowledge. Note the limitation in `_meta.extractionNote`.

---

## Step 4 — Parent Review

Before generating any lessons, the parent reviews the Knowledge Package:

1. Share `curriculum.json` with the parent — confirm which units/grades to prioritise
2. Parent confirms the book is appropriate for the child's current level
3. Parent approves the vocabulary and grammar scope
4. Note any units to skip (e.g. topics already mastered)

**Do not generate lessons for units the parent has not approved.**

Update `manifest.json` with parent approval:

```json
"parentReview": {
  "reviewedAt": "YYYY-MM-DD",
  "approvedUnits": [1, 2, 3, 4],
  "skippedUnits": [],
  "notes": "Start with Units 1-4 for girl only"
}
```

---

## Step 5 — Generate Lessons

With the Knowledge Package approved, generate lesson manifests using the vocabulary, grammar, and curriculum as source material.

**Input:**
- `imports/{subject}/grade{N}/{BookSlug}/curriculum.json` → unit structure + objectives
- `imports/{subject}/grade{N}/{BookSlug}/vocabulary.json` → words for lesson content + questions
- `imports/{subject}/grade{N}/{BookSlug}/grammar.json` → grammar rules + examples
- `imports/{subject}/grade{N}/{BookSlug}/assessment_seed.json` → question topics

**Output:**
```
content_repository/{subject}/lessons/{sourceId}-unit{N}-{topic}.json
```

**Rules:**
- Follow `docs/AI_DATA_STANDARDS.md` lesson schema exactly
- 5 lessons per unit (one per vocabulary/grammar focus)
- 10 questions per lesson (8 MC + 1 TF + 1 fill)
- Answer distribution: no letter used more than 3 times; no consecutive same letter
- Set `approved: false` on all generated lessons
- Assign stable lesson IDs from the reserved ranges in `docs/AI_DATA_STANDARDS.md`

---

## Step 6 — Generate Quizzes

Quizzes are embedded in lessons (the `questions[]` array inside each lesson manifest). They are generated at the same time as lessons in Step 5.

There is no separate quiz generation step — quizzes live inside the lesson JSON.

**Validation before moving to Step 7:**
```powershell
cd summer-quest
node scripts/validate-answers.js
```
Must report zero flagged questions.

---

## Step 7 — Publish

**7a — Copy to manifests folder:**
```powershell
Copy-Item "content_repository\{subject}\lessons\{batch}.json" "summer-quest\content\manifests\"
```

**7b — Import to database:**
```powershell
cd summer-quest
npm.cmd run content:import
```

**7c — Verify:**
```powershell
node -e "
const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
p.lesson.groupBy({ by: ['studentTarget','subjectId'], _count: true })
  .then(r => { console.table(r); p.\$disconnect(); })
"
```

**7d — Parent approval in app:**
Navigate to `/parent/review` — approve each imported lesson before children can see it.

**7e — Update source status:**
In `content_repository/{subject}/metadata/sources.json`, set `"status": "published"`.

---

## Step 8 — Update Knowledge Package Index

After publishing, update `manifest.json`:

```json
"lessonsGenerated": {
  "count": 20,
  "importedToDb": true,
  "importedAt": "YYYY-MM-DD",
  "manifestFiles": ["batch-girl-g5-en-06.json", "batch-girl-g5-en-07.json"]
}
```

---

## Complete Checklist

```
[ ] Step 1: PDF placed in source_materials/{subject}/
[ ] Step 2: Source registered in content_repository/{subject}/metadata/sources.json
[ ] Step 3a: manifest.json created
[ ] Step 3b: curriculum.json created
[ ] Step 3c: vocabulary.json created
[ ] Step 3d: grammar.json created
[ ] Step 3e: assessment_seed.json created
[ ] Step 3f: assets.json created
[ ] Step 4: Parent reviewed and approved units
[ ] Step 5: Lessons generated in content_repository/{subject}/lessons/
[ ] Step 6: validate-answers.js reports zero errors
[ ] Step 7a: Batches copied to summer-quest/content/manifests/
[ ] Step 7b: npm run content:import successful
[ ] Step 7c: DB lesson counts verified
[ ] Step 7d: Parent approved lessons in /parent/review
[ ] Step 7e: sources.json status updated to "published"
[ ] Step 8: manifest.json updated with lesson counts and import date
```
