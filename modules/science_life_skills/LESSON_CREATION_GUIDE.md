# Science & Life Skills Module — Lesson Creation Guide

## Purpose

This guide defines how to create lessons for the **Science & Life Skills** module in Summer Quest.

This module teaches children practical daily-life knowledge, healthy habits, hygiene, personal care, home cleanliness, food and drink awareness, and soft communication skills.

Target learners:

* Yumi: girl, around 10 years old
* Johnny: boy, around 9 years old

All lessons must be child-friendly, practical, positive, and applicable in daily family life.

---

# Module Scope

## 1. Daily Life Science

Topics include:

* Food and nutrition
* Drinking water
* Healthy snacks
* Sleep and rest
* Exercise and movement
* Body signals: hungry, thirsty, tired, uncomfortable
* Safe use of household items
* Basic environmental awareness

## 2. Personal Hygiene

Topics include:

* Brushing teeth
* Rinsing mouth
* Washing hands
* Bathing
* Changing clothes
* Keeping hair clean
* Nail care
* Keeping body fresh and clean

## 3. Home Cleanliness

Topics include:

* Keeping bedroom tidy
* Organizing study desk
* Putting toys away
* Keeping bathroom clean
* Keeping dining area clean
* Separating dirty and clean items
* Helping family with small chores

## 4. Communication & Soft Skills

Topics include:

* Greeting adults politely
* Listening when others speak
* Understanding a question before answering
* Asking for clarification
* Answering friends kindly
* Answering older people respectfully
* Saying thank you
* Saying sorry
* Handling disagreement
* Waiting for one's turn
* Expressing feelings calmly

---

# Lesson Principles

Each lesson must:

* Teach one clear life skill or concept
* Use simple Vietnamese
* Avoid fear-based language
* Avoid blaming or shaming
* Explain benefits clearly
* Include real-life examples
* Include small practice tasks
* Encourage habit building
* Be suitable for both children

Do not use:

* Harsh warnings
* Scary disease descriptions
* Shame-based hygiene language
* Adult-level medical explanation
* Long lectures
* Complex biology terms

---

# Lesson Structure

Each lesson should contain 4–5 slides.

## Slide 1 — Situation

Introduce a daily-life situation.

Example:

"Buổi sáng thức dậy, con cần làm gì để cơ thể sạch sẽ và sẵn sàng cho ngày mới?"

## Slide 2 — Key Idea

Explain the main concept simply.

Example:

"Đánh răng giúp làm sạch thức ăn còn sót lại trong miệng và giúp hơi thở thơm tho hơn."

## Slide 3 — Steps / How To Do It

Give clear steps.

Example:

1. Lấy bàn chải và kem đánh răng.
2. Chải mặt ngoài, mặt trong và mặt nhai của răng.
3. Súc miệng sạch.
4. Rửa bàn chải và để đúng chỗ.

## Slide 4 — Benefits

Explain why it matters.

Example:

"Khi con đánh răng đều đặn, răng sạch hơn, hơi thở dễ chịu hơn, và con tự tin hơn khi nói chuyện."

## Slide 5 — Practice / Reflection

Ask the child to apply the lesson.

Example:

"Hôm nay con hãy tự đánh răng buổi tối và kể lại 2 bước con đã làm tốt."

---

# Tone Guide

## For Yumi

Use gentle, imaginative, encouraging language.

Examples:

* "Công chúa nhỏ chăm sóc bản thân thật khéo léo."
* "Một căn phòng gọn gàng giúp vương quốc nhỏ của con sáng đẹp hơn."
* "Khi con trả lời lễ phép, lời nói của con giống như một bông hoa dễ thương."

## For Johnny

Use logical, practical, encouraging language.

Examples:

* "Kỹ sư nhỏ đang bảo trì cơ thể như chăm sóc một robot khỏe mạnh."
* "Khi bàn học gọn gàng, bộ não tìm đồ nhanh hơn."
* "Trả lời rõ ràng giúp người khác hiểu đúng ý của con."

---

# Quiz Rules

Each lesson should have **10 questions** (standard Summer Quest format).

Map all question types to the 3 supported DB types:

| Guide type | DB type | Notes |
|---|---|---|
| Multiple choice | `multiple_choice` | Standard 4 options A/B/C/D |
| True / false | `true_false` | Options: true / false |
| Situation choice | `multiple_choice` | Scenario as question text, responses as options |
| Best response | `multiple_choice` | Dialogue scenario, choose best reply |
| Step ordering | `multiple_choice` | Options are numbered sequences (e.g. "2→3→1→4") |
| Match action / benefit | `fill_blank` | Complete: "Rửa tay giúp con ___" |

Recommended mix per lesson: **8 MC + 1 TF + 1 fill_blank** (same as all other subjects).

Each question must include (in the `checks` manifest format):

| Field | MC | TF | Fill blank |
|---|---|---|---|
| `type` | `"multiple_choice"` | `"true_false"` | `"fill_blank"` |
| `text` | Question text in Vietnamese | Statement to evaluate | Sentence with `___` |
| `options` | `["Option A", "Option B", "Option C", "Option D"]` | *(omit — script adds Đúng/Sai)* | *(omit or `[]`)* |
| `correctIndex` | 0-based integer: 0=A 1=B 2=C 3=D | *(omit)* | *(omit)* |
| `correct` | *(omit)* | `true` or `false` | *(omit)* |
| `answer` | *(omit)* | *(omit)* | Exact answer string |
| `explanation` | Why correct | Why true/false | Why this answer |
| `hint` | One sentence, direction only | One sentence | One sentence |

> ⚠️ Do NOT use `correctAnswer: "A"` or `options: [{id, text}]` — those formats are not accepted by the import script. See `docs/AI_DATA_STANDARDS.md` for the full schema.

### Answer distribution (same rule as all subjects)

Across 8 MC questions: no letter used more than 3 times, no two consecutive questions with the same correct letter.

### Explanation tone

Bad:

"Con sai vì không biết giữ vệ sinh."

Good:

"Cách tốt hơn là rửa tay trước khi ăn, vì tay có thể dính bụi hoặc vi khuẩn nhỏ mà mắt mình không thấy."

---

# Example Question Types

## Multiple Choice

```
Câu hỏi:
"Trước khi ăn cơm, con nên làm gì?"

A. Chơi thêm một chút
B. Rửa tay sạch
C. Cầm đồ ăn ngay
D. Chạy quanh nhà

Đáp án đúng: B

Giải thích:
"Rửa tay trước khi ăn giúp tay sạch hơn. Nhờ vậy, con ăn uống an toàn và dễ chịu hơn."
```

## Situation Choice (mapped to multiple_choice)

```
Câu hỏi:
"Bạn hỏi con: 'Vì sao bạn không chơi với mình?' Con nên trả lời thế nào?"

A. 'Kệ bạn.'
B. 'Mình đang hơi mệt, lát nữa mình chơi nhé.'
C. Im lặng bỏ đi
D. Nói thật to cho bạn sợ

Đáp án đúng: B

Giải thích:
"Câu trả lời này rõ ràng và lịch sự. Con nói được cảm xúc của mình mà vẫn tôn trọng bạn."
```

## Step Ordering (mapped to multiple_choice)

```
Câu hỏi:
"Thứ tự đúng các bước đánh răng buổi tối là?"

A. Lấy bàn chải → Chải răng → Súc miệng → Cất bàn chải
B. Súc miệng → Lấy bàn chải → Chải răng → Cất bàn chải
C. Chải răng → Lấy bàn chải → Súc miệng → Cất bàn chải
D. Lấy bàn chải → Súc miệng → Chải răng → Cất bàn chải

Đáp án đúng: A

Giải thích:
"Đúng thứ tự: lấy bàn chải và kem → chải răng nhẹ nhàng → súc miệng sạch → rửa và cất bàn chải đúng chỗ."
```

---

# Recommended Lesson Topics

## Food & Drink

1. Vì sao cần uống đủ nước?
2. Đồ ăn tốt cho cơ thể
3. Ăn chậm và nhai kỹ
4. Không ăn quá nhiều đồ ngọt
5. Bữa sáng giúp con có năng lượng

## Personal Hygiene

1. Đánh răng buổi sáng và buổi tối
2. Rửa tay đúng lúc
3. Tắm rửa và thay quần áo sạch
4. Giữ móng tay gọn gàng
5. Che miệng khi ho hoặc hắt hơi

## Home Habits

1. Dọn giường sau khi ngủ dậy
2. Giữ bàn học gọn gàng
3. Cất đồ chơi đúng chỗ
4. Giữ phòng ngủ sạch
5. Giúp ba mẹ việc nhỏ trong nhà

## Communication Skills

1. Chào hỏi lễ phép
2. Lắng nghe trước khi trả lời
3. Khi chưa hiểu câu hỏi thì hỏi lại
4. Cách trả lời bạn bè cùng tuổi
5. Cách trả lời người lớn
6. Nói lời cảm ơn
7. Nói lời xin lỗi
8. Nói cảm xúc của mình bình tĩnh

---

# Lesson ID Convention

```
{studentTarget}-g{grade}-sls-x{NNN}

sls = science_life_skills

Examples:
  girl-g5-sls-x001
  boy-g4-sls-x001
  both-g4-sls-x001   ← use studentTarget "both" when lesson applies equally to both students
```

orderIndex: start from 1 (no existing lessons). Leave gaps of 5 between batches.

Batch file naming:
```
batch-{studentTarget}-g{grade}-sls-{n}.json

Examples:
  batch-girl-g5-sls-01.json
  batch-boy-g4-sls-01.json
  batch-both-g4-sls-01.json
```

---

# Content Generation Prompt Template

Use this template when generating a lesson.

```
Read docs/00_AGENT_INDEX.md.

Task:
Create one Science & Life Skills lesson.

subjectId: science_life_skills
studentTarget: [both / girl / boy]
grade: [4 or 5]
phase: review

Topic:
[TOPIC from the recommended list above]

Requirements:
- Simple Vietnamese
- Practical daily-life context
- 4–5 slides in the content field (use ## headings per slide)
- 10 quiz questions: 8 MC + 1 TF + 1 fill_blank
- No fear-based language, no shaming
- Child-friendly explanation
- approved: false
- For girl: gentle, imaginative tone (Công chúa / Yumi)
- For boy: logical, practical tone (Kỹ sư / Johnny)
- For both: neutral encouraging tone

Answer distribution: no letter > 3× in 8 MC, no consecutive same letter.

Read:
modules/science_life_skills/LESSON_CREATION_GUIDE.md
docs/AI_DATA_STANDARDS.md
docs/LESSON_CREATION_GUIDE.md

Output:
Valid lesson manifest JSON using the `checks` array format.
See docs/AI_DATA_STANDARDS.md — "Manifest File Format" for the exact schema.
Use `checks` (NOT `questions`). Use `correctIndex` (NOT `correctAnswer: "A"`).
Ensure `storyContext` is a non-empty string (never null).
```

---

# Approval Rules

All AI-generated lessons must have `approved: false`.

Parent review should check:

* Is the advice appropriate for the child's age?
* Is the tone gentle — not blaming or shaming?
* Is the behavior realistic for the child?
* Is there any scary or medically inappropriate language?
* Are quiz answers clear and correct?

---

# Safety Notes

This module is educational, not medical advice.

For health-related topics:

* Keep advice general
* Focus on habits
* Avoid diagnosis
* Avoid treatment instructions
* Encourage asking parents when unsure

Good:

"Nếu con thấy đau bụng hoặc khó chịu, con nên nói với ba mẹ."

Avoid:

"Con cần uống thuốc..."

---

# File Placement

```
modules/science_life_skills/
  MODULE.md               ← Module status and DB requirements
  README.md               ← Developer guide
  LESSON_CREATION_GUIDE.md ← This file
  content/                ← Lesson JSON files
  assets/                 ← Icons and illustrations
  games/                  ← Future: habit-building mini-games
  importers/              ← Future: batch import scripts

content_repository/science_life_skills/
  hygiene/
  food_and_drink/
  home_habits/
  communication/
```
