# imports/

> Staging area for content batches that are ready to import into the database.
> Full pipeline: `docs/CONTENT_IMPORT.md`

---

## Purpose

This folder is an **optional staging checkpoint** between `content_repository/` and the live manifests folder. Use it to hold validated batches that are waiting for a scheduled import run or parent pre-approval.

```
content_repository/{subject}/lessons/    ← Validated lesson JSON (long-term storage)
    ↓  (copy when ready to import)
imports/{subject}/                       ← THIS FOLDER (staged for next import run)
    ↓  (copy to manifests + run import)
summer-quest/content/manifests/          ← Active import queue
    ↓
summer-quest/prisma/dev.db               ← Live database
```

---

## Structure

```
imports/
├── README.md
├── english/
│   ├── grade3/                      ← English source materials for Grade 3
│   ├── grade4/                      ← English source materials for Grade 4
│   └── grade5/
│       └── FamilyandFriend5/        ← Knowledge package from Family and Friends 5 (Oxford)
│           ├── manifest.json
│           ├── curriculum.json
│           ├── vocabulary.json
│           ├── grammar.json
│           ├── assessment_seed.json
│           └── assets.json
├── math/
│   ├── grade3/
│   ├── grade4/
│   └── grade5/
├── vietnamese/
│   ├── grade3/
│   ├── grade4/
│   └── grade5/
└── science/
    ├── grade3/
    ├── grade4/
    └── grade5/
```

## Naming Convention

Each source textbook gets its own subfolder under `imports/{subject}/grade{N}/{BookName}/`:

```
imports/{subject}/grade{N}/{BookSlug}/
├── manifest.json         ← Package identity, source metadata, parent review record
├── curriculum.json       ← Unit structure, topics, learning objectives
├── vocabulary.json       ← All words with definitions, examples, Vietnamese hints
├── grammar.json          ← All grammar structures with examples and teaching notes
├── assessment_seed.json  ← Question topics + stems per unit (NOT actual quizzes)
└── assets.json           ← Asset inventory (images, illustrations) — extraction status
```

**The grade folder makes explicit which student year group the material targets.** A book that spans multiple grades (e.g. Grade 4–5) should go in the grade it primarily targets, with a note in `curriculum.json`.

## Knowledge Packages vs Staged Batches

| Type | Path | Purpose |
|---|---|---|
| Knowledge package | `imports/{subject}/grade{N}/{BookSlug}/` | Reference only — input for lesson generation |
| Staged batch | `imports/{subject}/grade{N}/{batch}.json` | Ready to copy to `summer-quest/content/manifests/` and import |


---

## Rules

1. Files here must already be validated against `docs/AI_DATA_STANDARDS.md`
2. Batch filenames follow the standard: `batch-{studentTarget}-g{grade}-{subject}-{n}.json`
3. After copying to `summer-quest/content/manifests/` and importing, move or delete the file here
4. Do not import directly from this folder — always copy to `summer-quest/content/manifests/` first

---

## Import Command

```powershell
# 1. Copy batch to manifests
Copy-Item "imports\math\batch-girl-g4-math-06.json" "summer-quest\content\manifests\"

# 2. Run import
cd summer-quest
npm.cmd run content:import

# 3. Verify lesson count increased, then clean up this folder
```
