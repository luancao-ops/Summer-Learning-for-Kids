# Content Expansion And AI Teacher Plan

This file captures the planning direction for expanding Summer Quest from a short summer app into a long-running AI-assisted learning system.

Current status:

- children have already started using the software
- real progress and history already exist in the local database
- future content updates must not damage lesson history, attempts, mistakes, rewards, or streaks

## Non-Negotiable Data Safety Rule

Do not use the current `prisma/seed.ts` to add new production content after children have real progress.

Reason:

- `seed.ts` deletes learning data before recreating content
- rerunning it can wipe attempts, mistakes, rewards, and other history

Safe expansion must be:

- append-only for new lessons
- no deletion of old lesson records
- no changing ids of already released lessons
- no reseeding of production progress data

Recommended future implementation approach:

- create a dedicated import script such as `scripts/import-lessons.ts`
- only insert or upsert brand-new lesson ids
- keep all existing lesson ids stable
- default AI-generated lessons to `approved: false`
- let parent review and approve before student visibility

## Summer Content Target

Per student:

- Math: `100` lessons
- Vietnamese: `100` lessons
- English core: `100` lessons

English exam track:

- Boy: Movers-focused
- Girl: Flyers-focused
- Every 2 weeks: `1` full mock exam

For an 8-12 week holiday plan:

- Movers full mocks for boy: `4` to `6`
- Flyers full mocks for girl: `4` to `6`

Recommended planning baseline:

- `100` Math
- `100` Vietnamese
- `100` English core
- `6` full English mocks for each child if planning for the longer 3-month version

## English Priority

English should have the highest content density and highest weekly frequency.

### Boy English Track

Focus:

- Cambridge Movers style vocabulary
- short reading comprehension
- sentence patterns
- listening-style picture/text tasks adapted to current UI
- mock exams every 2 weeks

### Girl English Track

Focus:

- Cambridge Flyers style vocabulary
- grammar and sentence completion
- longer reading tasks
- guided writing
- mock exams every 2 weeks

### English Weekly Weight

Suggested balance:

- English: `4-5` sessions per week
- Math: `2-3` sessions per week
- Vietnamese: `2-3` sessions per week

## Recommended Content Structure

For each subject per student:

- `70` review lessons
- `30` prep lessons
- every lesson must contain at least `20` questions

## Minimum Lesson Size

All newly expanded lesson content should follow this rule:

- each normal lesson: minimum `20` questions
- each full mock exam: can be significantly longer than `20` questions

Reason:

- current lesson size is too short for sustained summer usage
- longer lessons create enough practice depth before students exhaust the content library
- English exam preparation especially needs more repetition and full-length practice

For English core:

- vocabulary lessons
- grammar pattern lessons
- reading lessons
- writing/use-of-English lessons
- exam strategy lessons

Suggested English core split:

- `30` vocabulary
- `20` grammar
- `20` reading
- `15` writing/use-of-English
- `15` integrated skill and exam-prep lessons

## Mock Exam Design

Each full mock exam should be treated as a special lesson type.

Recommended metadata to support later:

- `contentTrack`: `core` or `exam_mock`
- `examLevel`: `movers` or `flyers`
- `examMockNumber`: `1`, `2`, `3`, ...
- `estimatedDurationMinutes`
- `skillsCovered`

Each mock should feel longer than normal lessons and cover multiple sections that imitate the real exam structure as closely as the current product allows.

## Expansion Phases

### Phase 1: Safe Content Infrastructure

Goal:

- build an append-only lesson import flow
- prove that new content can be added without affecting history

Output:

- import script
- lesson manifest format
- approval workflow for new content

### Phase 2: Summer Full-Cover Content

Goal:

- expand to `100` lessons per subject per child
- add recurring Movers/Flyers mock exams

Output:

- structured lesson banks
- English-heavy summer roadmap
- parent review queue for AI drafts

### Phase 3: 1-Year AI Teacher Assistant

Goal:

- keep children using the system across the next school year
- evolve from summer practice app into year-round guided study support

Output:

- monthly learning plans
- adaptive revision
- subject expansion beyond current three subjects
- stronger English workflow resembling an online English learning platform

## 1-Year Product Direction

If the children respond well, Summer Quest can evolve into an AI Teacher Assistant for daily study support.

### Core Direction

- keep the app local-first and parent-controlled
- expand lesson generation and review workflow
- increase adaptive review based on mistakes and weak topics
- keep the child experience simple even as the content library grows

### Likely Subject Expansion

- English first
- Math deeper by grade progression
- Vietnamese reading and writing depth
- science
- social studies
- logic / reasoning
- school test revision packs

### English As A Major Growth Area

The strongest long-term opportunity is to make English feel like a lightweight local alternative to an online English tutoring product.

Possible future capabilities:

- level-based learning tracks
- regular mock exams
- speaking prompts
- pronunciation practice integration later
- vocabulary spaced review
- guided writing feedback
- parent weekly English report

## Planning Rules For Future Work

When adding content from now on:

- never replace or reorder released lessons in a way that breaks progress interpretation
- prefer adding new lessons after the highest existing `orderIndex`
- keep old content stable
- track exam content separately from normal lessons
- preserve `approved: true` filtering for student-facing queries
- keep AI-generated content pending until parent review unless explicitly authored and approved by parent

## Next Planning Documents To Create Later

Not requested yet, but the next useful planning artifacts will be:

- per-student syllabus map for `100` Math lessons
- per-student syllabus map for `100` Vietnamese lessons
- per-student syllabus map for `100` English core lessons
- Movers mock exam blueprint set
- Flyers mock exam blueprint set
- append-only content import technical design
