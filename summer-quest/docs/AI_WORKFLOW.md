# Summer Quest — AI Workflow

**Version:** 1.0  
**Date:** 2026-05-26  
**Mục tiêu:** Hướng dẫn cách PM (Claude), Developer Agent, và Phụ huynh phối hợp để xây dựng và vận hành app.

---

## 1. Tổng quan vai trò

```
┌──────────────────────────────────────────────────────────┐
│                   SUMMER QUEST WORKFLOW                   │
│                                                          │
│  👨‍💼 Claude Code (PM/Designer)                            │
│      ↓ Tạo PRD, Backlog, thiết kế UX                     │
│      ↓ Review implementation                             │
│      ↓ Tạo nội dung mẫu (cần parent duyệt)              │
│                                                          │
│  👨‍💻 Developer Agent (Codex / Claude)                     │
│      ↓ Nhận task từ BACKLOG.md                           │
│      ↓ Implement code theo thiết kế                      │
│      ↓ Báo cáo kết quả                                  │
│                                                          │
│  👨‍👩‍👧‍👦 Phụ huynh                                         │
│      ↓ Review nội dung AI tạo ra                        │
│      ↓ Duyệt/Từ chối/Chỉnh sửa bài học                 │
│      ↓ Theo dõi tiến độ 2 bé                            │
│                                                          │
│  👧👦 Bé gái + Bé trai                                  │
│      ↓ Chỉ thấy nội dung đã được duyệt                  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Claude Code đóng vai PM

### 2.1 Nhiệm vụ PM của Claude Code

Claude Code trong dự án này đóng vai PM/Designer và có thể thực hiện:

1. **Viết và duy trì tài liệu:**
   - PRD.md — Product requirements
   - BACKLOG.md — User stories và tickets
   - ROADMAP.md — Kế hoạch xây dựng

2. **Tạo tasks cho Developer:**
   - Phân tích yêu cầu từ backlog
   - Viết task description chi tiết
   - Xác định acceptance criteria

3. **Review code và UI:**
   - Kiểm tra xem implementation có đúng spec không
   - Phát hiện UX issues
   - Đề xuất cải tiến

4. **Tạo nội dung học tập:**
   - Tạo bài học mẫu theo `CONTENT_MODEL.md`
   - Tạo câu hỏi quiz original
   - Tất cả nội dung AI tạo ra **phải qua parent review** trước khi vào app

### 2.2 Cách Claude Code tạo task cho Developer

Khi phụ huynh muốn thêm tính năng mới, Claude Code sẽ:

**Bước 1: Phân tích yêu cầu**
```
Phụ huynh: "Tôi muốn thêm bài học về phép nhân cho bé trai"
Claude Code → Kiểm tra BACKLOG.md → Tạo ticket mới
```

**Bước 2: Viết task spec**
```markdown
## TASK-045: Thêm bài học Toán Lớp 3 - Bảng nhân 6, 7, 8, 9

**Mô tả:** Thêm bài học và quiz về bảng nhân 6–9 cho bé trai (Lớp 3 review).

**File cần tạo/sửa:**
- prisma/seed.ts — thêm lesson + quiz mới
- (Không cần thêm UI — lesson viewer đã có)

**Data cần thêm:**
[Lesson JSON và Quiz JSON đầy đủ theo CONTENT_MODEL.md]

**Acceptance criteria:**
- [ ] Bài học hiển thị đúng trong danh sách Toán của bé trai
- [ ] Quiz có đủ 5 câu (3 trắc nghiệm + 2 đúng/sai)
- [ ] Approved = false (chờ phụ huynh duyệt)
- [ ] Content không sao chép sách giáo khoa

**Priority:** P1
```

**Bước 3: Developer thực hiện → Claude Code review**

---

## 3. Developer Agent — Cách nhận và thực hiện tasks

### 3.1 Quy trình làm việc của Developer

```
1. Đọc BACKLOG.md → chọn ticket P0 chưa làm
2. Đọc DATA_MODEL.md → hiểu schema database
3. Đọc CONTENT_MODEL.md → hiểu format nội dung
4. Implement code
5. Test thủ công:
   - npm run dev
   - Kiểm tra UI theo UX_FLOW.md
   - Kiểm tra database
6. Báo cáo: "Đã hoàn thành TICKET-XXX"
```

### 3.2 Quy tắc Developer phải tuân thủ

```
✅ PHẢI làm:
- Dùng TypeScript strict mode
- Dùng Prisma client (không viết SQL thô)
- Giao diện tiếng Việt
- Theme dựa trên ThemeContext
- Approved = false cho tất cả nội dung mới
- Xử lý loading và error state

❌ KHÔNG được:
- Hardcode màu sắc (dùng CSS variables từ theme)
- Hiển thị từ "Sai", "Thất bại", "0 điểm" trực tiếp
- Bỏ qua approved check khi hiển thị lesson cho bé
- Dùng setTimeout thay cho proper loading state
- Sao chép nội dung sách giáo khoa vào seed data
```

### 3.3 Cấu trúc lệnh cho Developer Agent

Khi giao task cho Developer Agent:

```
Nhiệm vụ: Implement [TICKET-XXX]

Context:
- Đọc: docs/DATA_MODEL.md (schema Prisma)
- Đọc: docs/UX_FLOW.md (flow màn hình liên quan)
- Đọc: docs/CONTENT_MODEL.md (nếu cần tạo nội dung)

Files liên quan:
- src/app/[studentId]/[route]/page.tsx
- src/components/[ComponentName].tsx
- prisma/schema.prisma (nếu cần thay đổi schema)

Yêu cầu cụ thể:
[Chi tiết từ ticket]

Kiểm tra sau khi xong:
1. npm run dev không báo lỗi
2. [Các bước test cụ thể]
3. Screenshot nếu có UI mới
```

---

## 4. Tạo nội dung học tập bằng AI

### 4.1 Quy trình tạo nội dung an toàn

```
Claude Code tạo nội dung
         ↓
Nội dung được lưu với approved = false
         ↓
Phụ huynh vào /parent/review
         ↓
Phụ huynh đọc từng bài học và quiz
         ↓
Duyệt ✅ → Bài hiện cho bé
Từ chối ❌ → Bài ẩn hoàn toàn
Chỉnh sửa ✏️ → Sửa và lưu → Bài vẫn pending
```

### 4.2 Prompt template tạo bài học

Khi cần tạo nội dung mới, dùng prompt sau cho Claude:

```
Tạo 1 bài học Toán cho [bé gái/bé trai], lớp [3/4/5], chủ đề: "[chủ đề]".

Yêu cầu:
- Nội dung gốc hoàn toàn, không sao chép sách giáo khoa
- Ngôn ngữ đơn giản, phù hợp [9/10] tuổi
- 4 slide: Giới thiệu, Ví dụ minh hoạ, Thực hành mẫu, Tóm tắt
- Dùng tình huống thực tế gần gũi (đồ ăn, đồ chơi, gia đình)
- Đừng dùng từ ngữ trong sách giáo khoa

Sau đó tạo quiz 5 câu:
- 3 câu trắc nghiệm 4 lựa chọn
- 2 câu đúng/sai
- Mỗi câu có: explanation rõ ràng, hint không tiết lộ đáp án
- Test đúng learning objectives đã nêu

Output format: JSON theo CONTENT_MODEL.md
```

### 4.3 Checklist review nội dung (cho phụ huynh)

Khi phụ huynh duyệt nội dung AI:

```
Bài học:
□ Nội dung đúng kiến thức không?
□ Ngôn ngữ phù hợp với con không?
□ Không có từ khó hoặc khái niệm quá cao không?
□ Ví dụ có thực tế và dễ hiểu không?

Quiz:
□ Câu hỏi rõ ràng, không mơ hồ?
□ Đáp án đúng có thực sự đúng không?
□ Explanation giải thích đủ để con tự hiểu?
□ Không có nội dung không phù hợp?

Tổng thể:
□ Tone phù hợp (không quá khó, không quá dễ)?
□ Sẵn sàng cho con học?
```

---

## 5. Quy trình review implementation

### 5.1 Claude Code review UI

Sau khi Developer implement xong một màn hình:

**Checklist UI Review:**
```
Theme & Design:
□ Màu sắc đúng với theme của student?
□ Font chữ đúng (Baloo 2 / Orbitron cho heading)?
□ Button đủ lớn (≥ 44px)?
□ Không có hardcode màu sắc?

Nội dung:
□ Tất cả text tiếng Việt?
□ Không có placeholder text tiếng Anh?
□ Không có từ harsh/negative với bé?

Tính năng:
□ Dữ liệu load từ database (không hardcode)?
□ Xử lý state loading?
□ Xử lý state empty (bé chưa có dữ liệu)?

Gamification:
□ XP/Coin cập nhật đúng?
□ Streak tính đúng?
□ Badge check đúng điều kiện?
```

### 5.2 Cách báo cáo bug

Developer/PM tìm ra bug, tạo ticket theo format:

```markdown
## BUG-XXX: [Tên bug ngắn gọn]

**Màn hình:** /[route]
**Điều kiện xảy ra:** [Bước 1 → Bước 2 → Bug xuất hiện]
**Expected:** [Phải xảy ra điều gì]
**Actual:** [Thực tế xảy ra gì]
**Priority:** P0/P1/P2
**Screenshot:** [nếu có]
```

---

## 6. Phụ huynh review nội dung trước khi bé dùng

### 6.1 Quy tắc bảo vệ trẻ em

> **KHÔNG BAO GIỜ** hiển thị bài học hoặc quiz có `approved = false` cho bé.

Implementation trong code:

```typescript
// src/app/[studentId]/subject/[subject]/page.tsx
// Luôn filter approved = true khi hiển thị cho bé

const lessons = await prisma.lesson.findMany({
  where: {
    subjectId: subject.id,
    studentTarget: { in: [student.gender, "both"] },
    gradeLevel: { lte: student.gradeCompleted + 1 },
    approved: true, // ← KHÔNG BAO GIỜ bỏ dòng này
  },
  orderBy: { orderIndex: "asc" },
});
```

### 6.2 Notification cho phụ huynh

Khi có nội dung mới chờ duyệt:
- Parent Dashboard hiển thị badge đỏ: "📋 X bài chờ duyệt"
- Phụ huynh vào `/parent/review` để xem

### 6.3 Workflow chỉnh sửa nội dung

Nếu phụ huynh muốn chỉnh sửa bài học AI tạo ra:

```
1. Vào /parent/review
2. Chọn bài cần chỉnh
3. Click "✏️ Chỉnh sửa"
4. Form editor hiện ra (đơn giản, text only trong MVP)
5. Lưu → bài vẫn pending (approved = false)
6. Đọc lại lần nữa → click "✅ Duyệt"
```

---

## 7. Lệnh hữu ích cho Developer

```bash
# Khởi động app
npm run dev

# Chạy Prisma migrations sau khi sửa schema
npx prisma migrate dev --name "describe_change"

# Seed lại database (xoá và tạo mới)
npx prisma db push --force-reset
npx prisma db seed

# Xem database bằng Prisma Studio
npx prisma studio

# Build production
npm run build
npm start

# Kiểm tra TypeScript
npx tsc --noEmit

# Format code
npx prettier --write src/
```

---

## 8. Cấu trúc thư mục dự án

```
summer-quest/
├── docs/                        ← Tài liệu (file này ở đây)
│   ├── PRD.md
│   ├── ROADMAP.md
│   ├── BACKLOG.md
│   ├── UX_FLOW.md
│   ├── GAME_DESIGN.md
│   ├── CONTENT_MODEL.md
│   ├── DATA_MODEL.md
│   └── AI_WORKFLOW.md
│
├── prisma/
│   ├── schema.prisma            ← Database schema
│   ├── seed.ts                  ← Seed data (lessons, quizzes)
│   └── summer-quest.db          ← SQLite file (gitignore)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← Root layout
│   │   ├── page.tsx             ← Student selection
│   │   ├── [studentId]/
│   │   │   ├── layout.tsx       ← Theme provider
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── subject/
│   │   │   │   └── [subject]/
│   │   │   │       └── page.tsx
│   │   │   ├── lesson/
│   │   │   │   └── [lessonId]/
│   │   │   │       └── page.tsx
│   │   │   ├── quiz/
│   │   │   │   └── [quizId]/
│   │   │   │       └── page.tsx
│   │   │   └── review/
│   │   │       └── page.tsx     ← Ôn luyện câu sai
│   │   ├── parent/
│   │   │   ├── page.tsx         ← Parent dashboard
│   │   │   └── review/
│   │   │       └── page.tsx     ← AI content review
│   │   └── api/
│   │       ├── quiz/
│   │       │   └── [quizId]/
│   │       │       └── submit/route.ts
│   │       ├── missions/route.ts
│   │       └── parent/
│   │           └── approve/route.ts
│   │
│   ├── components/
│   │   ├── ui/                  ← Shared UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Modal.tsx
│   │   ├── student/
│   │   │   ├── XPBar.tsx
│   │   │   ├── DailyMission.tsx
│   │   │   ├── BadgeCard.tsx
│   │   │   └── SubjectCard.tsx
│   │   ├── lesson/
│   │   │   ├── SlideViewer.tsx
│   │   │   └── LessonCard.tsx
│   │   ├── quiz/
│   │   │   ├── QuizEngine.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── AnswerButton.tsx
│   │   │   ├── FeedbackPanel.tsx
│   │   │   └── ResultScreen.tsx
│   │   └── parent/
│   │       ├── ProgressChart.tsx
│   │       └── MistakeList.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts            ← Prisma singleton
│   │   ├── themes.ts            ← Theme configs (Princess / Robot)
│   │   ├── xp.ts                ← XP/level calculations
│   │   ├── streak.ts            ← Streak logic
│   │   ├── badges.ts            ← Badge condition checker
│   │   └── missions.ts          ← Daily mission generator
│   │
│   └── types/
│       └── index.ts             ← Shared TypeScript types
│
├── public/
│   └── (images, icons)
│
├── .env                         ← DATABASE_URL (gitignore)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 9. Getting Started — Fresh Developer Agent Onboarding

When a new developer agent (Codex, Claude, or any LLM-based coding assistant) joins this project, give it the following bootstrap prompt **before any ticket**:

```
You are a senior TypeScript/Next.js developer on a project called Summer Quest.

READ THESE DOCS FIRST (in order):
1. docs/DATA_MODEL.md   — Prisma schema, all DB tables, data flow examples
2. docs/CONTENT_MODEL.md — TypeScript types for Lesson, Quiz, Student, Theme
3. docs/UX_FLOW.md       — ASCII wireframes for every screen
4. docs/AI_WORKFLOW.md   — Rules you must follow (section 3.2 especially)

TECH STACK:
- Next.js 14 (App Router), TypeScript strict mode
- Tailwind CSS with CSS variables for theming
- Prisma + SQLite
- Framer Motion for animations
- Recharts for parent dashboard charts

CRITICAL RULES (never break these):
1. Never show lessons/quizzes where approved = false to students.
2. Never hardcode colors — always use CSS variables from theme.
3. Never display "Sai", "Thất bại", or "0 điểm" as standalone feedback.
4. All API routes must use prisma singleton from src/lib/prisma.ts.
5. All new lesson/quiz seed content must have approved = false.

DATABASE:
- Run `npx prisma studio` to inspect data at any time.
- Run `npx prisma db seed` to reset + re-seed.
- Run `npx prisma migrate dev --name "your_change"` after schema edits.

Now read the ticket I will give you and implement it.
```

---

## 10. Content Generation Prompt Library

These are ready-to-use prompts for generating original lesson content. Always paste into a fresh Claude conversation (not the developer session).

### Prompt A — Generate a Math Lesson + Quiz

```
Generate an original Vietnamese math lesson for a [9/10]-year-old child.
Grade level: [3 / 4 / 5]
Topic: [e.g., "Fractions — reading and writing simple fractions"]
Phase: [review / prep]

Requirements:
- 4 slides: Introduction, Illustrated Example, Practice Example, Summary
- Use real-world contexts (food, toys, family, nature) — NOT textbook scenarios
- Language: simple Vietnamese, sentences max 20 words
- Do NOT copy or paraphrase any Vietnamese textbook
- Emoji: 1–2 per slide to illustrate concepts

Then generate a 5-question quiz:
- 3 multiple-choice (4 options each)
- 2 true/false
- Each question needs: text, options, correctAnswer, explanation (≥2 sentences), hint (direction only, not the answer)

Output: Valid JSON matching this schema → [paste Lesson + Quiz schema from CONTENT_MODEL.md § 1 and § 2]

Set approved: false on the lesson object.
```

### Prompt B — Generate a Vietnamese Language Lesson + Quiz

```
Generate an original Vietnamese language lesson for a [9/10]-year-old.
Grade level: [3 / 4 / 5]
Topic: [e.g., "Compound words (từ ghép) vs. reduplicative words (từ láy)"]
Phase: [review / prep]

Requirements:
- 4 slides with clear progression: concept → example → guided practice → summary
- Use familiar, cheerful Vietnamese words — animals, family, nature, school
- Never use sentences from the Vietnamese primary school textbook series
- Include at least 2 concrete word examples per slide

Then generate a 5-question quiz:
- Mix of multiple-choice and true/false
- Explanation for each must state WHY the answer is correct in child-friendly terms
- Hint must guide thinking, not reveal the answer

Output: Valid JSON per CONTENT_MODEL.md schema. Set approved: false.
```

### Prompt C — Generate an English Lesson + Quiz

```
Generate an English vocabulary/grammar lesson for a Vietnamese child aged [9/10].
CEFR level: A1
Topic: [e.g., "School objects — naming and describing"]
Phase: [review / prep]

Requirements:
- Bilingual lesson: English target language with Vietnamese explanations
- 4 slides: New words + pictures (emoji), Pronunciation guide, Example sentences, Mini summary
- Keep sentences under 6 words
- Vietnamese explanation for each new word

Then generate a 5-question quiz:
- 3 multiple-choice, 2 true/false
- Questions test recognition, not production (choose the right word, not fill-in-blank)
- Explanation in Vietnamese so the child fully understands

Output: Valid JSON per CONTENT_MODEL.md schema. Set approved: false.
```

### Prompt D — Generate a Batch of 5 Lessons (Efficient)

```
I need to populate Summer Quest with content for [studentTarget: girl/boy], grade [3/4], subject [math/vietnamese/english].

Generate 5 lessons in sequence, covering these topics:
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]
4. [Topic 4]
5. [Topic 5]

Each lesson should:
- Be self-contained and work without the others
- Build slightly on the previous (orderIndex matches the list above)
- Follow the 4-slide format (Intro / Example / Practice / Summary)
- Include a 5-question quiz

Output: A JSON array of 5 Lesson objects (each with nested Quiz + Questions).
All approved: false.
Follow schema in CONTENT_MODEL.md.
```

---

## 11. Git Workflow

```
main
  └── Luôn stable, chạy được
      ↑
feature/ticket-XXX
  └── Một branch per ticket
      └── Merge vào main khi done + tested
```

Commit message format:
```
feat: thêm quiz engine (TICKET-013)
fix: sửa streak reset sai ngày (BUG-001)
content: thêm bài Toán phân số cho bé gái (TICKET-028)
docs: cập nhật BACKLOG.md
```
