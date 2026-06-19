# Science Module — Lesson Creation Guide

> Status: **Not yet active** — Subject `science` is not in the DB. No content can be imported until the Subject record is added.

---

## When Active

This module will follow the same universal rules as all subjects:
- Full rules: `docs/LESSON_CREATION_GUIDE.md` Section 1 (universal)
- Field schema: `docs/AI_DATA_STANDARDS.md`
- Question count: 10 per lesson (8 MC + 1 TF + 1 fill_blank)
- Language: Vietnamese throughout
- `approved: false` for all AI-generated content

## Planned Scope

| Field | Value |
|---|---|
| `subjectId` | `science` |
| Grades | 3–5 (both students) |
| Curriculum | Khoa học — Vietnamese national curriculum (2018) |
| Distinct from | `science_life_skills` (Kỹ năng sống — habits/hygiene, already active) |

---

## Activation Steps (when approved)

1. Add `{ id: "science", label: "Khoa học", emoji: "🔬", orderIndex: 6 }` to Prisma seed
2. Run `npm run prisma:migrate`
3. Add routes `/student/[id]/subject/science`
4. Add "Khoa học" card to student dashboard UI
5. Create content using this guide once the Subject record exists in DB

**Do not create or import manifests until the Subject record exists in DB.**

---

## Planned Topics (Grade 3–5)

See `modules/science/MODULE.md` for the full topic list.

---

## Lesson ID Format (when active)

```
{studentTarget}-g{grade}-sci-x{NNN}

sci = science abbreviation

Examples:
  girl-g3-sci-x001
  boy-g4-sci-x001
```

## Import Guide

See: [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)
