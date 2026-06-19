# Summer Quest — Lesson Creation Guide

> The authoritative reference for designing and writing new lessons for any subject.
> Read this before generating any lesson content.
> For field-level specs and JSON schema, see `docs/AI_DATA_STANDARDS.md`.
> For the import pipeline, see `docs/CONTENT_IMPORT.md`.

---

## Section 1 — Universal Rules (All Subjects)

These rules apply to every lesson regardless of subject.

### 1.1 Content Quality

| Rule | Detail |
|---|---|
| Original content only | Never reproduce textbook text, exercises, or examples verbatim. All examples must be original, set in everyday contexts a child knows. |
| Age-appropriate language | Sentences short, vocabulary familiar to 8–10 year-olds. Explain any unfamiliar term inline. |
| Encouraging tone | Use "bé đã làm được!", "cùng khám phá nhé!", "giỏi lắm!" — never use cold academic phrasing. |
| Minimum 2 examples | Every lesson must have at least 2 concrete worked examples before the quiz. |
| Emoji usage | ≤ 3 emoji per content section. Emoji must illustrate the concept, not decorate. Never use emoji in question text. |

### 1.2 Language

| Subject | Question language | Content language |
|---|---|---|
| Math | Vietnamese | Vietnamese |
| Vietnamese | Vietnamese | Vietnamese |
| English — Listening | Vietnamese | Dialogue/transcript in English |
| English — Speaking | Vietnamese | Phonics/phrases in English |
| English — Reading | Vietnamese (questions) | Passage in English |
| English — Writing | Vietnamese | Grammar examples in English |
| Science (future) | Vietnamese | Vietnamese |

### 1.3 Question Structure (mandatory for every lesson)

Every lesson must have **exactly 10 questions**:
- **8 multiple choice** (`multiple_choice`) — 4 options each (A, B, C, D)
- **1 true/false** (`true_false`) — options `true` / `false`
- **1 fill-in-the-blank** (`fill_blank`) — `options: []`, `correctAnswer` is the exact expected string

### 1.4 Answer Distribution (Multiple Choice)

Write each question so the **content determines the correct option** — do not pre-assign letters.

After writing all 8 MC questions, verify:
- No single letter is the correct answer more than **3 times**
- No two **consecutive** questions share the same correct answer letter

See `docs/AI_DATA_STANDARDS.md` — "Answer Distribution Rule" for the full incident history behind this rule.

### 1.5 Import Defaults

| Field | Value |
|---|---|
| `approved` | `false` — **always** for AI-generated content. Parent reviews at `/parent/review`. |
| `version` | `1` |
| `defaults.minimumQuestions` | `10` — import script enforces this |
| `storyContext` | Required non-empty string — a brief narrative wrapper for the lesson. Never `null`. |

Do NOT include a `rewardConfig` field in manifests — the import script computes this automatically.

### 1.6 Content Length

| Element | Target |
|---|---|
| Lesson `content` field | 150–500 words |
| `learningObjective` | One sentence starting with "Sau bài này bé sẽ…" |
| `shortExplanation` | 1–2 sentences shown before the quiz starts |
| Question `text` | 10–60 words |
| `explanation` | 1–3 sentences — enough for a child to understand without help |
| `hint` | 1 sentence — suggest a direction, do NOT reveal the answer |

---

## Section 2 — Math (Toán)

### 2.1 Scope

| Student | Grades | Phase |
|---|---|---|
| girl (Yumi) | Grade 4 (review), Grade 5 (prep) | `review` / `new` |
| boy (Johnny) | Grade 3 (review), Grade 4 (prep) | `review` / `new` |

### 2.2 Skill Areas

| Skill | Topic examples |
|---|---|
| Arithmetic | Addition/subtraction with regrouping, multiplication tables, long division |
| Large numbers | Reading/writing numbers to millions |
| Fractions | Basic fractions, comparing same-denominator fractions, mixed numbers |
| Decimals | Decimal notation, tenths/hundredths, comparing decimals |
| Measurement | Area of rectangles, perimeter, units of time, volume basics |
| Geometry | Shapes, angles, symmetry |
| Word problems | Real-life story problems testing any of the above |

### 2.3 Question Rules for Math

- Every MC question must include **one numeric distractor** that represents a common calculation error (e.g. wrong carry, wrong operation).
- Fill-blank answer must be a **number or short expression** (e.g. `"24"`, `"3/4"`, `"48 cm²"`). Never an open-ended sentence.
- True/false questions should test a **common misconception** (e.g. "Số 0 là số tự nhiên" — HS often get this wrong).
- Use **real objects** as context: food, toys, money, distances, time.

### 2.4 Lesson ID Format

```
{studentTarget}-g{grade}-math-x{NNN}

Examples:
  girl-g4-math-x026
  boy-g3-math-x026
```

ID ranges: see `docs/AI_DATA_STANDARDS.md` — "Lesson ID Ranges".

### 2.5 Batch File Name

```
batch-{studentTarget}-g{grade}-math-{n}.json

Examples:
  batch-girl-g5-math-06.json
  batch-boy-g4-math-03.json
```

---

## Section 3 — Vietnamese (Tiếng Việt)

### 3.1 Scope

Same grade/phase matrix as Math (see 2.1).

### 3.2 Skill Areas

| Skill | Topic examples |
|---|---|
| Grammar | Subject-predicate (CN-VN), sentence types (kể/hỏi/cảm/cầu), compound sentences |
| Spelling (chính tả) | Common errors: d/gi/r, n/ng, diacritics, double consonants |
| Vocabulary | Từ ghép / từ láy, synonyms (đồng nghĩa), antonyms (trái nghĩa), word families |
| Reading comprehension | Short original passages (80–120 words) → answer who/what/why questions |
| Composition | Identify topic sentence, add detail sentences, write a short paragraph |

### 3.3 Question Rules for Vietnamese

- Question context sentences must be **original** — never copied from a Vietnamese textbook.
- Use familiar settings: family, school, animals, nature, food.
- Grammar questions should test a single rule clearly — avoid ambiguous sentences.
- Fill-blank: the answer is a **word or short phrase** (e.g. a missing verb, a connective, a punctuation mark).

### 3.4 Lesson ID Format

```
{studentTarget}-g{grade}-vi-x{NNN}
```

### 3.5 Batch File Name

```
batch-{studentTarget}-g{grade}-vi-{n}.json
```

---

## Section 4 — English (Tiếng Anh) — 4 Skills

English lessons are divided into four distinct skill types. Each skill has different content structure, question style, and lesson ID convention. **A single lesson covers exactly one skill.**

### Skill Overview

| Skill | Vietnamese name | Emoji | Focus |
|---|---|---|---|
| Listening | Nghe | 🎧 | Comprehension of a spoken dialogue/story |
| Speaking | Nói | 🗣️ | Pronunciation, phonics, oral patterns |
| Reading | Đọc | 📖 | Comprehension of a written English passage |
| Writing | Viết | ✏️ | Grammar, sentence construction, written correctness |

---

### 4.1 Listening (Nghe) 🎧

#### Purpose
Train the child to understand spoken English by working through a transcript of a dialogue or short story, then answering comprehension questions.

#### Content Format

```markdown
# [Title] 🎧

> 🎧 Nghe đoạn hội thoại sau. Chú ý: ai nói gì? Họ đang nói về điều gì?

---

## Đoạn hội thoại (Transcript)

**[Character A]:** "[Line of dialogue]"
**[Character B]:** "[Line of dialogue]"
**[Character A]:** "[Line of dialogue]"
...

---

## Từ mới (New Words)

| English | Vietnamese | Heard in dialogue |
|---|---|---|
| word | nghĩa tiếng Việt | "[quote from dialogue]" |
...

---

## Ghi nhớ sau khi nghe (Comprehension Notes)

[2–3 bullet points summarising what happened in Vietnamese]
```

#### Question Rules

- 6 of 8 MC questions must reference **specific lines from the transcript** ("In the dialogue, what did [character] say about...?")
- 2 MC questions may test vocabulary meaning from the glossary box
- True/false: a statement about the dialogue content that is either confirmed or contradicted by the script
- Fill-blank: a word or short phrase that was spoken in the transcript (child must recall from reading the script)

#### Lesson ID Pattern

```
{target}-g{N}-en-lis-x{NNN}

Examples:
  girl-g5-en-lis-x001
  boy-g4-en-lis-x001
```

#### Batch File Name

```
batch-{target}-g{grade}-en-lis-{n}.json
```

---

### 4.2 Speaking (Nói) 🗣️

#### Purpose
Build pronunciation awareness and oral fluency patterns — phonics rules, word stress, minimal pairs, and common spoken phrases.

#### Content Format

```markdown
# [Title] 🗣️

## Quy tắc phát âm (Pronunciation Rule)

[Explain the phonics or stress rule in Vietnamese]

---

## Hướng dẫn phát âm (Pronunciation Guide)

| English word | Gợi ý phát âm (Vietnamese) | Ví dụ câu |
|---|---|---|
| garden | /GAR-đờn/ | "I work in the garden." |
| water  | /WO-tờ/   | "Drink more water!"   |
...

---

## Cặp từ dễ nhầm (Minimal Pairs)

| Word A | Word B | Khác nhau ở |
|---|---|---|
| ship /ʃɪp/ | sheep /ʃiːp/ | nguyên âm ngắn vs. dài |
| bit /bɪt/ | beat /biːt/ | /ɪ/ vs. /iː/ |

---

## Hội thoại mẫu (Model Dialogue)

[Short 4–6 line dialogue using the target sounds naturally, with stressed syllables in CAPS]

**Mom:** "Can you PASS the WATER please?"
**Yumi:** "Sure! Here you go."
```

#### Question Rules

- Questions must be **fully text-representable** — no actual audio required.
- MC: "Which word has the /ɪ/ sound?", "Which word is stressed on the FIRST syllable?", "Which sentence uses the correct pronunciation pattern?"
- True/false: a claim about a phonics rule (e.g. "The letter 'c' before 'e' sounds like /s/")
- Fill-blank: complete a minimal pair or phonics pattern ("ship → _____ (same vowel sound, means to count a flock of wool animals)")

#### Lesson ID Pattern

```
{target}-g{N}-en-spe-x{NNN}
```

#### Batch File Name

```
batch-{target}-g{grade}-en-spe-{n}.json
```

---

### 4.3 Reading (Đọc) 📖

#### Purpose
Build reading comprehension from an English passage (story, letter, article, description), focusing on understanding the text and vocabulary in context.

#### Content Format

```markdown
# [Title] 📖

> [1 sentence in Vietnamese setting the scene for the child]

---

## Đọc đoạn văn sau (Read the Passage)

[English passage — 150–200 words. Short paragraphs, 2–4 sentences each.
Grade-appropriate vocabulary. Named characters when possible.]

---

## Từ mới (Vocabulary)

| English | Vietnamese | Example from passage |
|---|---|---|
| habitat | môi trường sống | "The panda's habitat is..." |
...

---

## Trước khi làm bài, thử trả lời (Pre-Quiz Focus)

- Who is the main character? What are they doing?
- Where does the story take place?
- What is the most important fact in the passage?
```

#### Question Rules

- At least **5 of 8 MC** questions must be answerable **only by reading the passage** (i.e. not general knowledge).
- 2 MC questions may test vocabulary meaning from the glossary.
- 1 MC question should test **inference** ("What do you think [character] will do next?" or "Why did...?").
- True/false: a factual claim about the passage — either clearly confirmed or clearly contradicted.
- Fill-blank: a key word or phrase from the passage (vocabulary or a content fact).

#### Lesson ID Pattern

```
{target}-g{N}-en-rea-x{NNN}
```

#### Existing Lessons (Retroactive Tagging)

The following existing lessons are Reading-type and should be treated as `rea` when creating new IDs:
- `girl-g5-en-x026` through `girl-g5-en-x031` (batch-girl-g5-en-06 and en-07)
- `boy-g4-en-x001` onward (batch-boy-g4-en-01)

These use the legacy ID pattern (no `-rea-` segment). New lessons use the skill-typed pattern.

#### Batch File Name

```
batch-{target}-g{grade}-en-rea-{n}.json
```

---

### 4.4 Writing (Viết) ✏️

#### Purpose
Teach correct written English — grammar structures, sentence construction, punctuation, and common errors to avoid.

#### Content Format

```markdown
# [Title] ✏️

## Quy tắc ngữ pháp (Grammar Rule)

[Explain the rule in Vietnamese. Keep it under 3 sentences.]

---

## Công thức (Formula)

| Dạng câu | Cấu trúc | Ví dụ |
|---|---|---|
| Khẳng định | Subject + **will** + verb | "She will come tomorrow." |
| Phủ định | Subject + **won't** + verb | "He won't be late." |
| Câu hỏi | **Will** + subject + verb? | "Will you help me?" |

---

## Đúng ✅ và Sai ❌

| Câu | Nhận xét |
|---|---|
| ✅ "You must wear a helmet." | Đúng — bare infinitive sau must |
| ❌ "You must to wear a helmet." | Sai — không thêm "to" sau modal |
| ❌ "She musts follow the rules." | Sai — modal verbs không thêm -s |

---

## Lỗi thường gặp (Common Errors)

> ❌ Đừng viết: [wrong form]
> ✅ Hãy viết: [correct form]
> Lý do: [brief Vietnamese explanation]
```

#### Question Rules

- At least **4 of 8 MC** must be "identify the grammatically correct sentence" (one correct, three with specific named errors).
- 2 MC may test vocabulary/word-form (e.g. "Which is the past participle of 'see'?").
- 2 MC may test written meaning/usage.
- True/false: a claim about a grammar rule (e.g. "After 'must', we use the infinitive with 'to'.").
- Fill-blank: complete a sentence with the correct written form (e.g. correct tense, correct preposition, correct article).
- **All answer options must be plausible written forms** — distractors should represent errors children actually make (adding "to", wrong tense, wrong modal).

#### Lesson ID Pattern

```
{target}-g{N}-en-wri-x{NNN}
```

#### Batch File Name

```
batch-{target}-g{grade}-en-wri-{n}.json
```

---

### 4.5 English Skill Balance Per Grade

Aim for roughly equal coverage across skills per grade level. Suggested ratio per 20 English lessons:

| Skill | Lessons |
|---|---|
| Reading (Đọc) | 7–8 |
| Writing (Viết) | 5–6 |
| Listening (Nghe) | 3–4 |
| Speaking (Nói) | 2–3 |

Reading and Writing can stand alone more easily. Listening and Speaking benefit from being paired with a related Reading or Writing lesson on the same topic.

---

## Section 5 — Science & Life Skills (Kỹ năng sống)

> Full lesson creation rules: `modules/science_life_skills/LESSON_CREATION_GUIDE.md`
> Import guide: `modules/science_life_skills/IMPORT_GUIDE.md`

### 5.1 Overview

| Field | Value |
|---|---|
| `subjectId` | `science_life_skills` |
| DB label | "Kỹ năng sống" 🌱 |
| Grades | 4–5 (both students) |
| DB status | **Active** — Subject record exists, 20 lessons imported as of June 2026 |
| Distinct from | `modules/science/` (Khoa học — curriculum science, separate future module) |

### 5.2 Topic Categories

| Category | Examples |
|---|---|
| Daily Life Science | Food & nutrition, drinking water, sleep, exercise, body signals |
| Personal Hygiene | Brushing teeth, washing hands, bathing, nail care |
| Home Cleanliness | Tidy bedroom, organized desk, helping with chores |
| Communication & Soft Skills | Greeting adults, saying thank you/sorry, expressing feelings, handling disagreement |

### 5.3 Lesson Rules

- Language: **100% Vietnamese**
- Tone: gentle and encouraging — **never shame-based, never fear-based**
- For girl (Yumi): imaginative, princess/fairy-tale language
- For boy (Johnny): logical, robot/engineer language
- For `studentTarget: "both"`: neutral encouraging tone (use this when the lesson applies equally to both)
- Content structure: **4–5 slides** using `## Slide N` headings
- Questions: **8 MC + 1 TF + 1 fill_blank** (same as all subjects)

### 5.4 Question Type Mapping

| Life Skills question type | DB `type` |
|---|---|
| Multiple choice | `multiple_choice` |
| True / false | `true_false` |
| Situation choice (scenario → best response) | `multiple_choice` |
| Step ordering (correct sequence) | `multiple_choice` — options are full sequences e.g. "2→3→1→4" |
| Match action with benefit | `fill_blank` |

### 5.5 Lesson ID Pattern

```
{studentTarget}-g{grade}-sls-x{NNN}

sls = science_life_skills

Examples:
  girl-g5-sls-x001
  boy-g4-sls-x001
  both-g4-sls-x001
```

orderIndex: girl-g5-sls x001–x010 (orderIndex 1–10) and boy-g4-sls x001–x010 (orderIndex 1–10) are taken. Next IDs start at x011 / orderIndex 11.

### 5.6 Curriculum Science (Khoa học) — Separate Module

The `modules/science/` folder is a **separate planned module** for curriculum-based science (biology, physics, earth science, Grades 3–5 Vietnamese curriculum). It also requires a DB migration but uses `subjectId: "science"` and different lesson rules. Do not confuse the two.

---

## Section 6 — English Skill ID Ranges

These extend the ranges in `docs/AI_DATA_STANDARDS.md`. Start new IDs **after** the highest number below.

| Combo | Skill | ID prefix | orderIndex range |
|---|---|---|---|
| girl-g4-en | reading | girl-g4-en-rea-x001 → x025 | 12–36 |
| girl-g4-en | writing | girl-g4-en-wri-x001 → x025 | 37–61 |
| girl-g4-en | listening | girl-g4-en-lis-x001 → x015 | 62–76 |
| girl-g4-en | speaking | girl-g4-en-spe-x001 → x015 | 77–91 |
| girl-g5-en | reading | girl-g5-en-rea-x001 → x025 | 37–61 (legacy: x026 → x031 = orderIndex 62–67) |
| girl-g5-en | writing | girl-g5-en-wri-x001 → x025 | 68–92 |
| girl-g5-en | listening | girl-g5-en-lis-x001 → x015 | 93–107 |
| girl-g5-en | speaking | girl-g5-en-spe-x001 → x015 | 108–122 |
| boy-g3-en | reading | boy-g3-en-rea-x001 → x025 | 12–36 |
| boy-g3-en | writing | boy-g3-en-wri-x001 → x025 | 37–61 |
| boy-g3-en | listening | boy-g3-en-lis-x001 → x015 | 62–76 |
| boy-g3-en | speaking | boy-g3-en-spe-x001 → x015 | 77–91 |
| boy-g4-en | reading | boy-g4-en-rea-x001 → x025 | 37–61 (legacy: x001 → x00N = orderIndex 32+) |
| boy-g4-en | writing | boy-g4-en-wri-x001 → x025 | use highest existing + 5 |
| boy-g4-en | listening | boy-g4-en-lis-x001 → x015 | use highest existing + 5 |
| boy-g4-en | speaking | boy-g4-en-spe-x001 → x015 | use highest existing + 5 |

**Before generating IDs:** query the database for the current highest orderIndex per student+subject to avoid collisions:
```powershell
node -e "
const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();
p.lesson.findMany({where:{subjectId:'english'},select:{id:true,orderIndex:true,studentTarget:true},orderBy:{orderIndex:'desc'}})
  .then(r=>console.table(r)).finally(()=>p.\$disconnect())
"
```

---

## Section 7 — Pre-Creation Checklist

Run through this before writing any lesson:

### Planning
- [ ] Subject confirmed: `math` | `vietnamese` | `english` | `science_life_skills`
- [ ] For English: skill confirmed: `listening` | `speaking` | `reading` | `writing`
- [ ] Student target: `girl` | `boy` | `both`
- [ ] Grade confirmed and matches student's current phase
- [ ] Learning objective written as one sentence: "Sau bài này bé sẽ…"

### Content
- [ ] Content is original — no textbook text reproduced
- [ ] Lesson content is 150–500 words
- [ ] Minimum 2 worked examples included
- [ ] Language correct for subject (see Section 1.2 table)
- [ ] `storyContext` set (optional but recommended for engagement)

### Questions
- [ ] Exactly 10 questions: 8 MC + 1 TF + 1 fill_blank
- [ ] All `text` and `explanation` fields are non-null and non-empty
- [ ] `hint` does not reveal the answer — only points in a direction
- [ ] Fill-blank `options` is empty array `[]`
- [ ] Answer distribution: no letter > 3 times across 8 MC; no two consecutive same letter

### Import Readiness
- [ ] `approved: false`
- [ ] Lesson ID is unique (not in DB; not in any existing manifest)
- [ ] `orderIndex` does not collide with existing lessons for same student+subject
- [ ] After import: run `node scripts/validate-answers.js` — must report **zero flagged questions**

---

## Related Docs

| Doc | Purpose |
|---|---|
| `docs/AI_DATA_STANDARDS.md` | Exact field types, validation rules, answer distribution rule, full ID ranges |
| `docs/CONTENT_IMPORT.md` | Full pipeline from source material to live database |
| `summer-quest/docs/CONTENT_MODEL.md` | JSON schema with worked examples for lessons and quizzes |
| `content_repository/english/README.md` | English content status, priority, and CEFR levels |
| `content_repository/english/lessons/` | Existing English lesson files to use as style references |
