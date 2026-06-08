# Summer Quest — Asset Model

> Standards for educational assets (images, diagrams, audio).
> Phase 7 deliverable — documents future asset architecture.
> No runtime asset system exists yet. This defines what it WILL look like.

---

## Current State (V1)

- Lessons contain **text only** (Markdown stored in `Lesson.content`)
- No images, diagrams, or audio in any lesson
- No asset storage or catalog

---

## Future Asset System (V2+)

Assets will live in `assets/{subject}/` at the project root, catalogued by an asset manifest. Lessons will **reference** assets by `assetId` — never embed binary content inside lesson text.

---

## Asset Catalog Format

Every asset must have a catalog entry:

```json
{
  "assetId": "math-diagram-fractions-01",
  "subject": "math",
  "type": "diagram",
  "path": "assets/math/diagrams/fractions-01.png",
  "tags": ["fractions", "grade-4", "visual"],
  "source": "original",
  "grade": 4,
  "description": "Number line showing 1/2, 1/4, 3/4"
}
```

---

## Asset Fields

| Field | Type | Rule |
|---|---|---|
| `assetId` | string | Unique. Format: `{subject}-{type}-{slug}-{n}`. Never reuse. |
| `subject` | string | `math`, `vietnamese`, `english`, `science` |
| `type` | string | `diagram`, `image`, `audio`, `chart`, `illustration` |
| `path` | string | Relative path from project root |
| `tags` | string[] | Keywords for search and filtering |
| `source` | string | `original` (created for this app), `adapted` (modified from source), `licensed` (with attribution) |
| `grade` | int | Primary grade level this asset targets |
| `description` | string | One sentence describing content |

---

## Asset ID Namespace

All asset IDs are namespaced by subject to prevent collisions:

```
math-{type}-{slug}-{n}          e.g. math-diagram-fractions-01
vietnamese-{type}-{slug}-{n}    e.g. vietnamese-image-alphabet-05
english-{type}-{slug}-{n}       e.g. english-illustration-animals-03
science-{type}-{slug}-{n}       e.g. science-diagram-water-cycle-01
```

---

## Referencing Assets in Lessons

When the asset system is implemented, lessons will reference assets like this (future syntax):

```markdown
Here is a number line showing fractions:

{{asset:math-diagram-fractions-01}}

Notice that 1/2 is exactly in the middle...
```

The runtime will resolve `{{asset:assetId}}` to the correct `<img>` or `<audio>` element.

**Until this is implemented:** Lessons remain text-only. Do not embed base64 images or external URLs in lesson content.

---

## Asset Storage Structure (Future)

```
assets/
├── math/
│   ├── diagrams/       ← geometric shapes, number lines, charts
│   ├── illustrations/  ← visual examples for word problems
│   └── catalog.json    ← asset index for this subject
├── vietnamese/
│   ├── images/         ← story illustrations, vocabulary images
│   └── catalog.json
├── english/
│   ├── images/         ← vocabulary pictures, scene illustrations
│   ├── audio/          ← pronunciation clips (future)
│   └── catalog.json
└── science/
    ├── diagrams/       ← anatomy, ecosystems, physics diagrams
    ├── illustrations/
    └── catalog.json
```

---

## Asset Rules

1. **Never embed images directly in lesson content** — always reference by `assetId`
2. **Never store PDFs or DOCXs in `assets/`** — only processed, ready-to-use assets
3. **Original assets preferred** — avoid copyright issues; create simple diagrams instead
4. **One asset, many lessons** — the same diagram can be referenced by multiple lessons
5. **Stable IDs** — once an `assetId` is assigned, never change it; lessons depend on it

---

## Acceptance Criteria for Phase 7

- [ ] `assets/` folder structure created (Phase 7)
- [ ] `catalog.json` template exists per subject
- [ ] Asset ID convention documented and followed
- [ ] No runtime changes — asset system is docs + folder structure only until separate approval
