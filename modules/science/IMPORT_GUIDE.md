# Science — Import Guide

> Status: **Not yet active** — `subjectId: "science"` is not in the DB.

---

## Activation Required

Before any content can be imported, the following must be completed (requires parent/developer approval):

1. Modify `prisma/schema.prisma` to add `science` as a valid Subject ID
2. Run `npm run prisma:migrate` to apply the migration
3. Add UI routes and dashboard card for the Science subject

These steps require explicit parent approval — see `docs/01_RULES.md` Production Safety Rule.

---

## When Active

Follow the same import pipeline as all other subjects:

1. Create lesson manifests in `content_repository/science/lessons/`
2. Copy to `summer-quest/content/manifests/`
3. Run `npm run content:import` from `summer-quest/`
4. Verify: `node scripts/validate-answers.js`

Full pipeline: `docs/CONTENT_IMPORT.md`

---

## Planned ID Convention

```
{studentTarget}-g{grade}-sci-x{NNN}
```

---

## Related Docs

- [LESSON_CREATION_GUIDE.md](./LESSON_CREATION_GUIDE.md) — planned content rules
- [MODULE.md](./MODULE.md) — planned topic list
- [docs/AI_DATA_STANDARDS.md](../../docs/AI_DATA_STANDARDS.md) — manifest schema
- [docs/CONTENT_IMPORT.md](../../docs/CONTENT_IMPORT.md) — full import pipeline
