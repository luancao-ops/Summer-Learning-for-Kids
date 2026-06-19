# Summer Quest — Content Import

> How content gets from source material into the database.
> Read this before generating or importing any lessons.

---

## Core Rule

**PDF and raw source files are temporary. Structured data is permanent.**

```
source_materials/{subject}/              ← Raw PDFs / textbooks (gitignored)
    ↓  (OCR + knowledge extraction)
content_repository/{subject}/lessons/    ← Validated JSON (long-term storage)
    ↓  (optional staging)
imports/{subject}/                       ← Staged batches waiting for import run
    ↓  (copy to manifests)
summer-quest/content/manifests/          ← Active import queue
    ↓  (npm run content:import)
summer-quest/prisma/dev.db               ← Live database
    ↓
Parent review (/parent/review)
    ↓
Children learn
```

Never read PDFs at runtime. Never store PDFs in the database. Process once, reuse forever.

---

## Part 1 — Current Import Pipeline (V1 — Active)

### Step 1: Create a manifest file

Place a JSON file in `summer-quest/content/manifests/`:

```
summer-quest/content/manifests/batch-{studentTarget}-g{grade}-{subject}-{n}.json
```

**Example:** `batch-girl-g4-math-01.json`, `batch-boy-g3-vi-04.json`

*(Note: 4 legacy files use `batch-english-boy-g3-{n}.json` — do not use this pattern for new batches)*

Format: see `docs/AI_DATA_STANDARDS.md` for full schema.

Key fields:
- `version: 1`
- `batchId`: unique identifier for this batch
- `defaults.approved`: set `true` if parent has pre-approved (e.g. review lessons)
- `lessons[]`: array of lesson objects with questions embedded

### Step 2: Run the import

```powershell
cd summer-quest
npm.cmd run content:import
```

The import script (`lib/content-import.ts`) is **append-only**:
- Lessons with existing IDs are skipped (never overwritten)
- Student progress records (Attempt, Mistake, Badge, StudentReward) are never touched
- New lessons appear in DB immediately after import

### Step 3: Parent review (if `approved: false`)

Parent navigates to `/parent/review` to approve or reject each imported lesson before children see it.

If `approved: true` was set in the manifest, lessons are immediately visible to students.

### Step 4: Verify lesson counts

```powershell
node -e "
const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
p.lesson.groupBy({ by: ['studentTarget','subjectId'], _count: true })
  .then(r => { console.table(r); p.\$disconnect(); })
"
```

### Import safety rules

| Rule | Detail |
|---|---|
| Append-only | Import never deletes or modifies existing lessons |
| ID stability | Lesson IDs must be permanent — never change after first import |
| orderIndex gaps | Leave gaps (e.g. multiples of 5) so future lessons can be inserted between |
| Student data | Attempt, Mistake, Badge, StudentReward records are NEVER modified by import |
| `approved` flag | Default `false` for AI drafts; only set `true` when parent has reviewed |

### Import script locations

```
summer-quest/scripts/import-lessons.ts    ← main import script
summer-quest/lib/content-import.ts        ← import logic
```

### Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Cannot read properties of undefined (reading 'trim')` | A field is `null`/`undefined` in a manifest | Find the null field in the failing manifest and fix it |
| `Unique constraint failed on id` | Lesson ID already exists | Import skipped it — correct behavior, not an error |
| `Foreign key constraint failed` | `subjectId` not in `Subject` table | Use only `math`, `vietnamese`, `english`, or `science_life_skills` |

---

## Part 2 — Book Import Workflow (V2 — Active)

> Full step-by-step guide: `tools/import_book/import_workflow.md`
> Overview: `tools/import_book/README.md`

### End-to-End Pipeline

```
source_materials/{subject}/         ← PDF placed here (gitignored, never committed)
    ↓ [Step 1] Register source in content_repository/{subject}/metadata/sources.json
    ↓ [Step 2] OCR — extract raw text, preserve structure
    ↓ [Step 3] Asset Extraction — pull diagrams, images, tables
    ↓ [Step 4] Knowledge Package — create imports/{subject}/grade{N}/{BookSlug}/
                  manifest.json       ← package identity + parent review record
                  curriculum.json     ← unit map, objectives, skills
                  vocabulary.json     ← all words with Vietnamese hints
                  grammar.json        ← grammar structures, examples, common errors
                  assessment_seed.json← question topics + stems (NOT actual quizzes)
                  assets.json         ← asset catalogue with extraction status
    ↓ [Step 5] Parent Review — approve units/scope via manifest.json parentReview field
    ↓ [Step 6] Lesson Generation — content_repository/{subject}/lessons/
                  (AI reads Knowledge Package, NOT the PDF)
    ↓ [Step 7] Validation — node scripts/validate-answers.js (zero errors required)
    ↓ [Step 8] Copy to summer-quest/content/manifests/ → npm run content:import
    ↓ [Step 9] Parent approves at /parent/review
    ↓ Children learn ✅
```

**Rule:** Once a Knowledge Package exists at `imports/`, the PDF is never read again. All lesson generation uses the Knowledge Package as the sole source of truth.

### Step 1: PDF Registration

Before processing any PDF:

1. Assign a source ID: `src-{subject}-{grade}-{title-slug}` (e.g. `src-math-g4-smart-start`)
2. Record in `content_repository/{subject}/metadata/sources.json`:
   ```json
   {
     "sourceId": "src-math-g4-smart-start",
     "title": "Smart Start Math Grade 4",
     "subject": "math",
     "grade": 4,
     "language": "vi",
     "pages": 180,
     "processedAt": "2026-06-08",
     "status": "registered"
   }
   ```
3. Store the PDF in a secure location **outside the repository** (never commit PDFs)
4. Note the file path in `sources.json` as `"localPath"` (absolute path on processing machine)

### Step 2: OCR Workflow

> See detailed steps in the **OCR Workflow** section below.

Output: plain text file per chapter, stored in `content_repository/{subject}/metadata/ocr/`

### Step 3: Asset Extraction

> See detailed steps in the **Asset Extraction Workflow** section below.

Output: processed image files in `content_repository/{subject}/extracted_assets/`

### Step 4: Knowledge Extraction

> See detailed steps in the **JSON Content Workflow** section below.

Output: structured lesson JSON files in `content_repository/{subject}/lessons/`

### Step 5: Validation

Before importing, run the validation checklist from `docs/AI_DATA_STANDARDS.md`:
- All lesson IDs unique and not in DB
- All question fields non-null
- Answer distribution balanced (2×A, 2×B, 2×C, 2×D)
- orderIndex values do not collide

### Step 6: Archive to content_repository

Copy validated JSON to permanent storage:
```
content_repository/{subject}/lessons/{sourceId}-grade{n}-{topic}.json
```

### Step 7: Import to database

```powershell
npm.cmd run content:import
```

---

## Part 3 — OCR Workflow (V2 — Planned)

### Purpose

Convert PDF pages to machine-readable text while preserving:
- Section headings and hierarchy
- Paragraph structure
- Table structure (if any)
- Mathematical notation (special handling required)

### Recommended Tools

| Tool | Use Case | Notes |
|---|---|---|
| `pdfplumber` (Python) | Text + table extraction | Best for structured PDFs |
| `pytesseract` + Poppler | Scanned image PDFs | Requires image pre-processing |
| Claude API (vision) | Complex layouts, mixed content | Most accurate, higher cost |

### OCR Process

```
1. Convert PDF pages to high-resolution images (300 DPI minimum)
2. Pre-process images:
   - Deskew (fix rotation)
   - Denoise
   - Increase contrast for Vietnamese diacritics
3. Run OCR engine
4. Post-process output:
   - Fix common Vietnamese OCR errors (à/á, ổ/ỗ, etc.)
   - Reconstruct paragraph breaks
   - Tag headings with markdown (#, ##, ###)
5. Save per-chapter text files:
   content_repository/{subject}/metadata/ocr/{sourceId}-ch{n}.txt
```

### Quality Checks

Before proceeding to knowledge extraction:
- [ ] Vietnamese diacritics render correctly (test: "Việt Nam", "số học", "phép tính")
- [ ] No missing words mid-sentence (check for suspiciously short lines)
- [ ] Chapter breaks are correct
- [ ] Tables (if any) are readable
- [ ] Math symbols extracted cleanly (test: ×, ÷, ≠, ≤, ≥, ²)

### OCR Output Format

```
content_repository/{subject}/metadata/ocr/
├── {sourceId}-ch01.txt     ← Chapter 1 raw text
├── {sourceId}-ch02.txt
├── ...
└── {sourceId}-manifest.json ← Chapter index: title, page range, filename
```

`{sourceId}-manifest.json` example:
```json
{
  "sourceId": "src-math-g4-smart-start",
  "chapters": [
    { "n": 1, "title": "Ôn tập số tự nhiên", "pages": "1-12", "file": "src-math-g4-smart-start-ch01.txt" },
    { "n": 2, "title": "Phép cộng và phép trừ", "pages": "13-28", "file": "src-math-g4-smart-start-ch02.txt" }
  ]
}
```

---

## Part 4 — Asset Extraction Workflow (V2 — Planned)

### Purpose

Extract diagrams, illustrations, and tables from PDFs and save them as reusable web assets, catalogued for reference by lesson content.

### What to Extract

| Asset Type | Examples | Action |
|---|---|---|
| Geometric diagrams | Shapes, number lines, coordinate grids | Extract + convert to SVG or PNG |
| Illustrations | Story pictures, vocabulary images | Extract as PNG |
| Tables | Data tables, comparison charts | Extract as PNG or convert to Markdown table |
| Mathematical notation | Equations, fractions displayed as images | Extract as PNG |

### What NOT to Extract

- Decorative borders or page backgrounds
- Textbook cover art or logos
- Portraits of people (copyright risk)

### Extraction Process

```
1. Identify asset-bearing pages from OCR manifest
2. Extract raw images from PDF pages using pdfplumber or PyMuPDF
3. For each image:
   a. Check minimum size (> 100×100 px — skip thumbnails and decorations)
   b. Assign an assetId: {subject}-{type}-{slug}-{n}
      Example: math-diagram-fractions-01
   c. Save to: content_repository/{subject}/extracted_assets/{assetId}.png
   d. Add catalog entry (see below)
4. For tables: extract text content, convert to Markdown table, save as .md
```

### Asset Catalog Entry

Add to `content_repository/{subject}/extracted_assets/catalog.json`:

```json
{
  "assetId": "math-diagram-fractions-01",
  "subject": "math",
  "type": "diagram",
  "sourceId": "src-math-g4-smart-start",
  "sourcePage": 42,
  "path": "content_repository/math/extracted_assets/math-diagram-fractions-01.png",
  "grade": 4,
  "tags": ["fractions", "number-line", "grade-4"],
  "description": "Number line showing 1/4, 1/2, 3/4 marked with arrows",
  "extractedAt": "2026-06-08"
}
```

### Asset Naming Convention

```
{subject}-{type}-{description-slug}-{sequence}

Types: diagram | illustration | table | chart | equation

Examples:
  math-diagram-circle-area-01
  vietnamese-illustration-farm-scene-03
  english-illustration-family-02
  science-diagram-water-cycle-01
```

---

## Part 5 — JSON Content Workflow (V2 — Planned)

### Purpose

Transform OCR text (raw) + extracted assets (catalogued) into structured lesson JSON manifests ready for database import.

### Input

- OCR text files: `content_repository/{subject}/metadata/ocr/{sourceId}-ch{n}.txt`
- Asset catalog: `content_repository/{subject}/extracted_assets/catalog.json`
- Curriculum map: `docs/CURRICULUM_STRUCTURE.md` (to assign correct grade/topic)

### Output

- Lesson manifests: `content_repository/{subject}/lessons/{sourceId}-{topic}.json`

### Transformation Process

```
1. Read OCR chapter text
2. Identify lesson boundaries (each "topic" = one lesson)
3. For each lesson:
   a. Extract: title, learning objective, explanation, examples
   b. Match any asset references from the catalog
   c. Generate 10 questions following AI_DATA_STANDARDS.md:
      - 8 multiple choice (balanced A/B/C/D distribution)
      - 1 true/false
      - 1 fill-in-the-blank
   d. Assign stable lesson ID and orderIndex
   e. Set approved: false
4. Write to manifest JSON
5. Copy manifest to summer-quest/content/manifests/ when ready to import
```

### AI Prompt for Knowledge Extraction

When using Claude API to extract lessons from OCR text:

```
You are extracting educational lesson content from Vietnamese primary school text.

Source text (OCR):
[paste OCR chapter text]

Known assets for this chapter (from catalog):
[paste relevant catalog entries]

Curriculum reference:
- Subject: {subject}
- Grade: {grade}
- Topic: {topic}

Task:
1. Identify 5 distinct lesson topics from this chapter
2. For each topic, create a lesson object following this exact schema: [paste AI_DATA_STANDARDS.md schema]
3. Generate 10 questions per lesson (8 MC + 1 TF + 1 fill)
4. Use answer distribution pattern P{1-4} from AI_DATA_STANDARDS.md
5. Reference any relevant assets by assetId
6. Set approved: false on all lessons

Output: JSON array of 5 lesson objects. No markdown wrapper.
```

### Validation Before Archiving

Run through `docs/AI_DATA_STANDARDS.md` validation checklist.
If any lesson fails validation: fix before archiving to `content_repository/`.

### Storage After Validation

```
content_repository/{subject}/lessons/
├── {sourceId}-{topic-slug}.json     ← validated lesson JSON
├── ...
└── index.json                        ← index of all lesson files in this subject
```

`index.json` format:
```json
{
  "subject": "math",
  "lastUpdated": "2026-06-08",
  "sources": [
    {
      "sourceId": "src-math-g4-smart-start",
      "files": ["src-math-g4-smart-start-numbers.json", "src-math-g4-smart-start-fractions.json"],
      "lessonCount": 25,
      "importedToDb": false
    }
  ]
}
```

Set `importedToDb: true` after running `npm run content:import` successfully.

---

## Manifest Naming Convention

```
batch-{studentTarget}-g{grade}-{subject}-{n}.json

Examples:
  batch-girl-g5-math-01.json
  batch-boy-g4-vietnamese-03.json
  batch-girl-g4-english-02.json
```

*(Note: 4 legacy files use `batch-english-boy-g3-{n}.json` — do not use this pattern for new batches)*

---

## Related Docs

| Doc | Purpose |
|---|---|
| `docs/AI_DATA_STANDARDS.md` | Lesson/question field specs, answer distribution, ID ranges |
| `docs/ASSET_MODEL.md` | Asset catalog format, naming convention, storage rules |
| `docs/RAG_ARCHITECTURE.md` | How processed content will eventually be chunked for retrieval |
| `docs/CURRICULUM_STRUCTURE.md` | Grade-by-grade topic map — use when assigning grade/topic to extracted lessons |
| `modules/{subject}/MODULE.md` | Per-subject content status and import notes |
