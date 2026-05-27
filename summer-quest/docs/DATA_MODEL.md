# Summer Quest — Data Model

**Version:** 1.0  
**Date:** 2026-05-26  
**Database:** SQLite (local-first)  
**ORM:** Prisma

---

## 1. Entity Relationship Overview

```
Student ──────────────────────────────────────────────────┐
   │                                                       │
   ├── LessonProgress ──── Lesson ──── Quiz ──── Question  │
   │                         │                    │        │
   ├── QuizAttempt ──────────┘        QuestionAttempt     │
   │       │                               │              │
   │       └───────────────────────────────┘              │
   │                                                       │
   ├── StudentBadge ─── Badge                              │
   │                                                       │
   └── DailyMission                                        │
                                                           │
Subject ──── Lesson ────────────────────────────────────────┘
```

---

## 2. Database Entities

### 2.1 Student

Lưu thông tin học sinh và trạng thái gamification.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Tên bé |
| gender | String | "girl" hoặc "boy" |
| gradeCompleted | Int | Lớp vừa hoàn thành (3 hoặc 4) |
| theme | String | "princess" hoặc "robot" |
| xp | Int | Tổng XP tích luỹ |
| coins | Int | Số xu hiện có |
| streak | Int | Chuỗi ngày học liên tiếp |
| lastActiveDate | String? | Ngày học gần nhất (YYYY-MM-DD) |
| createdAt | DateTime | Ngày tạo hồ sơ |

### 2.2 Subject

Môn học — dữ liệu cố định.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| slug | String | "math", "vietnamese", "english" |
| label | String | "Toán", "Tiếng Việt", "Tiếng Anh" |
| emoji | String | "🔢", "📖", "🌍" |
| orderIndex | Int | Thứ tự hiển thị |

### 2.3 Lesson

Bài học, có thể chứa nhiều slide.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| subjectId | String | FK → Subject.id |
| studentTarget | String | "girl", "boy", hoặc "both" |
| gradeLevel | Int | Lớp học (3, 4, 5) |
| phase | String | "review" hoặc "prep" |
| orderIndex | Int | Thứ tự trong môn học |
| title | String | Tiêu đề bài học |
| description | String | Mô tả ngắn |
| emoji | String | Emoji đại diện |
| estimatedMinutes | Int | Thời gian ước tính (phút) |
| slides | String | JSON array của LessonSlide[] |
| approved | Boolean | Phụ huynh đã duyệt? (default: false cho AI content) |
| createdAt | DateTime | Ngày tạo |

### 2.4 Quiz

Bài kiểm tra gắn với 1 bài học.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| lessonId | String | FK → Lesson.id (unique — 1 quiz/bài) |
| title | String | Tiêu đề quiz |

### 2.5 Question

Câu hỏi trong quiz.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| quizId | String | FK → Quiz.id |
| orderIndex | Int | Thứ tự câu hỏi |
| type | String | "multiple_choice", "true_false", "fill_blank" |
| text | String | Nội dung câu hỏi |
| options | String | JSON array QuizOption[] |
| correctAnswer | String | "A"/"B"/"C"/"D" hoặc "true"/"false" |
| explanation | String | Giải thích đáp án đúng |
| hint | String? | Gợi ý cho bé |
| emoji | String? | Emoji minh hoạ |

### 2.6 LessonProgress

Theo dõi bài học nào bé đã hoàn thành.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| studentId | String | FK → Student.id |
| lessonId | String | FK → Lesson.id |
| completed | Boolean | Đã hoàn thành chưa? |
| completedAt | DateTime? | Thời điểm hoàn thành |
| **Unique** | | (studentId, lessonId) |

### 2.7 QuizAttempt

Mỗi lần bé làm quiz — lưu điểm tổng.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| studentId | String | FK → Student.id |
| quizId | String | FK → Quiz.id |
| score | Int | Số câu đúng |
| totalQuestions | Int | Tổng số câu |
| xpEarned | Int | XP nhận được trong lần này |
| coinsEarned | Int | Coin nhận được |
| completedAt | DateTime | Thời điểm hoàn thành |

### 2.8 QuestionAttempt

Mỗi câu trả lời của bé trong 1 lần làm quiz.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| quizAttemptId | String | FK → QuizAttempt.id |
| questionId | String | FK → Question.id |
| selectedAnswer | String | Đáp án bé chọn |
| isCorrect | Boolean | Đúng hay sai |
| attemptsUsed | Int | Số lần thử (1 hoặc 2) |

### 2.9 Badge

Định nghĩa huy hiệu — dữ liệu cố định.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| slug | String | "first-quiz", "streak-3" |
| name | String | "Bước Đầu Tiên" |
| description | String | Mô tả điều kiện đạt được |
| icon | String | Emoji hoặc tên icon |
| theme | String? | "princess", "robot", hoặc null (chung) |
| condition | String | JSON: {"type": "quiz_completed", "value": 1} |
| xpReward | Int | XP thưởng khi đạt |

### 2.10 StudentBadge

Huy hiệu bé đã đạt được.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| studentId | String | FK → Student.id |
| badgeId | String | FK → Badge.id |
| earnedAt | DateTime | Thời điểm đạt huy hiệu |
| **Unique** | | (studentId, badgeId) — chỉ trao 1 lần |

### 2.11 DailyMission

Nhiệm vụ ngày của từng học sinh.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| studentId | String | FK → Student.id |
| date | String | Ngày (YYYY-MM-DD) |
| missions | String | JSON array của DailyMissionItem[] |
| **Unique** | | (studentId, date) |

```typescript
// Cấu trúc DailyMissionItem
interface DailyMissionItem {
  id: string;
  type: "complete_lesson" | "review_mistakes" | "score_threshold" | "streak";
  description: string;        // "Hoàn thành 1 bài Toán hôm nay"
  target: number;             // 1, 3, 80 (%)...
  current: number;            // Progress hiện tại
  completed: boolean;
  xpReward: number;
  coinReward: number;
}
```

### 2.12 Reward (Phase 2)

Phần thưởng vật phẩm trong vương quốc/robot.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| theme | String | "princess" hoặc "robot" |
| name | String | "Vườn hoa lâu đài" |
| description | String | Mô tả |
| icon | String | Emoji hoặc image path |
| type | String | "castle_decoration", "robot_part" |
| unlockCondition | String | JSON: {"type": "level", "value": 2} |

### 2.13 StudentReward (Phase 2)

Vật phẩm bé đã mở khoá.

| Field | Type | Description |
|---|---|---|
| id | String (cuid) | Primary key |
| studentId | String | FK → Student.id |
| rewardId | String | FK → Reward.id |
| unlockedAt | DateTime | |
| **Unique** | | (studentId, rewardId) |

### 2.14 ThemeConfig (Code/JSON — not a DB table)

Theme configuration is stored as a **TypeScript constant and JSON file**, not in the database. This is intentional — themes are fixed per student and do not change at runtime. The schema is defined in `src/lib/themes.ts` and `CONTENT_MODEL.md § 4`.

> **Why not in DB?** Theme is set once at profile creation and stored on `Student.theme ("princess" | "robot")`. All visual config is looked up from the static `THEMES` map using that key. No runtime mutations needed.

```typescript
// src/lib/themes.ts
export const THEMES: Record<"princess" | "robot", ThemeConfig> = {
  princess: { ... },  // see CONTENT_MODEL.md § 4.1
  robot:    { ... },  // see CONTENT_MODEL.md § 4.2
};

// Usage in any component:
const theme = THEMES[student.theme];
```

### 2.15 Explicit "Mistake" concept

There is **no separate `Mistake` table**. Mistakes are derived from `QuestionAttempt` rows where `isCorrect = false`. This keeps the schema lean and avoids denormalization.

```typescript
// Helper query — "Get all unresolved mistakes for a student"
const mistakes = await prisma.questionAttempt.findMany({
  where: {
    isCorrect: false,
    quizAttempt: { studentId },
    // Exclude questions the student later answered correctly in Review mode
    resolvedInReview: false,   // ← add this boolean column (see below)
  },
  include: { question: { include: { quiz: { include: { lesson: true } } } } },
});
```

**Add `resolvedInReview` to `QuestionAttempt`** so the Review flow can mark a mistake as cleared without deleting data:

```prisma
model QuestionAttempt {
  // ... existing fields ...
  resolvedInReview  Boolean  @default(false)  // ← ADD THIS
}
```

---

## 3. Prisma Schema (Full Draft)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./summer-quest.db"
}

model Student {
  id              String    @id @default(cuid())
  name            String
  gender          String    // "girl" | "boy"
  gradeCompleted  Int       // 3 or 4
  theme           String    // "princess" | "robot"
  xp              Int       @default(0)
  coins           Int       @default(0)
  streak          Int       @default(0)
  lastActiveDate  String?   // YYYY-MM-DD
  createdAt       DateTime  @default(now())

  lessonProgress  LessonProgress[]
  quizAttempts    QuizAttempt[]
  studentBadges   StudentBadge[]
  dailyMissions   DailyMission[]
}

model Subject {
  id          String   @id @default(cuid())
  slug        String   @unique // "math" | "vietnamese" | "english"
  label       String   // "Toán" | "Tiếng Việt" | "Tiếng Anh"
  emoji       String
  orderIndex  Int

  lessons     Lesson[]
}

model Lesson {
  id                String   @id @default(cuid())
  subjectId         String
  studentTarget     String   // "girl" | "boy" | "both"
  gradeLevel        Int      // 3 | 4 | 5
  phase             String   // "review" | "prep"
  orderIndex        Int
  title             String
  description       String
  emoji             String
  estimatedMinutes  Int      @default(10)
  slides            String   // JSON: LessonSlide[]
  approved          Boolean  @default(false)
  createdAt         DateTime @default(now())

  subject     Subject          @relation(fields: [subjectId], references: [id])
  quiz        Quiz?
  progress    LessonProgress[]
}

model Quiz {
  id        String   @id @default(cuid())
  lessonId  String   @unique
  title     String

  lesson    Lesson        @relation(fields: [lessonId], references: [id])
  questions Question[]
  attempts  QuizAttempt[]
}

model Question {
  id             String   @id @default(cuid())
  quizId         String
  orderIndex     Int
  type           String   // "multiple_choice" | "true_false" | "fill_blank"
  text           String
  options        String   // JSON: QuizOption[]
  correctAnswer  String
  explanation    String
  hint           String?
  emoji          String?

  quiz             Quiz              @relation(fields: [quizId], references: [id])
  questionAttempts QuestionAttempt[]
}

model LessonProgress {
  id          String    @id @default(cuid())
  studentId   String
  lessonId    String
  completed   Boolean   @default(false)
  completedAt DateTime?

  student  Student @relation(fields: [studentId], references: [id])
  lesson   Lesson  @relation(fields: [lessonId], references: [id])

  @@unique([studentId, lessonId])
}

model QuizAttempt {
  id             String   @id @default(cuid())
  studentId      String
  quizId         String
  score          Int      // số câu đúng
  totalQuestions Int
  xpEarned       Int      @default(0)
  coinsEarned    Int      @default(0)
  completedAt    DateTime @default(now())

  student          Student           @relation(fields: [studentId], references: [id])
  quiz             Quiz              @relation(fields: [quizId], references: [id])
  questionAttempts QuestionAttempt[]
}

model QuestionAttempt {
  id                String   @id @default(cuid())
  quizAttemptId     String
  questionId        String
  selectedAnswer    String
  isCorrect         Boolean
  attemptsUsed      Int      @default(1)
  resolvedInReview  Boolean  @default(false) // true = student later answered correctly in Review mode

  quizAttempt QuizAttempt @relation(fields: [quizAttemptId], references: [id])
  question    Question    @relation(fields: [questionId], references: [id])
}

model Badge {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String
  icon        String
  theme       String?  // null = chung cả 2; "princess" | "robot" = riêng
  condition   String   // JSON: BadgeCondition
  xpReward    Int      @default(0)

  studentBadges StudentBadge[]
}

model StudentBadge {
  id        String   @id @default(cuid())
  studentId String
  badgeId   String
  earnedAt  DateTime @default(now())

  student Student @relation(fields: [studentId], references: [id])
  badge   Badge   @relation(fields: [badgeId], references: [id])

  @@unique([studentId, badgeId])
}

model DailyMission {
  id        String   @id @default(cuid())
  studentId String
  date      String   // YYYY-MM-DD
  missions  String   // JSON: DailyMissionItem[]

  student Student @relation(fields: [studentId], references: [id])

  @@unique([studentId, date])
}
```

---

## 4. Badge Condition JSON Schema

```typescript
type BadgeConditionType =
  | "quiz_completed"       // Tổng số quiz đã hoàn thành >= value
  | "lesson_completed"     // Tổng số bài học >= value
  | "streak_days"          // Streak >= value ngày
  | "xp_total"             // Tổng XP >= value
  | "subject_completed"    // Hoàn thành X bài trong môn subject
  | "score_perfect"        // Đạt 100% quiz liên tiếp X lần
  | "mistakes_reviewed"    // Ôn lại >= X câu sai thành công
  | "first_login"          // Lần đầu tiên vào app

interface BadgeCondition {
  type: BadgeConditionType;
  value: number;
  subject?: "math" | "vietnamese" | "english"; // cho subject_completed
}

// Ví dụ:
// { "type": "streak_days", "value": 7 }
// { "type": "subject_completed", "value": 5, "subject": "math" }
// { "type": "xp_total", "value": 500 }
```

---

## 5. Indexes và Performance

```sql
-- Các index quan trọng cho query nhanh

-- Tìm tiến độ bài học của học sinh
CREATE INDEX idx_lesson_progress_student ON LessonProgress(studentId);

-- Tìm quiz attempt của học sinh
CREATE INDEX idx_quiz_attempt_student ON QuizAttempt(studentId, completedAt);

-- Tìm câu sai của học sinh (isCorrect = false)
CREATE INDEX idx_question_attempt_correct ON QuestionAttempt(quizAttemptId, isCorrect);

-- Tìm bài học theo môn và target
CREATE INDEX idx_lesson_subject_target ON Lesson(subjectId, studentTarget, gradeLevel);

-- Daily mission theo ngày
CREATE INDEX idx_daily_mission_date ON DailyMission(studentId, date);
```

---

## 6. Data Flow Examples

### 6.1 Khi bé hoàn thành quiz

```
QuizAttempt {score, totalQuestions} được tạo
  → Mỗi câu: QuestionAttempt được tạo
  → XP tính: (correctAnswers × 10) + (nếu 100%: +30) + (nếu hoàn thành: +20)
  → Student.xp += xpEarned
  → Student.coins += coinsEarned
  → LessonProgress.completed = true
  → Kiểm tra streak:
      if (Student.lastActiveDate != today):
          if (Student.lastActiveDate == yesterday): Student.streak += 1
          else: Student.streak = 1
      Student.lastActiveDate = today
  → Kiểm tra badge conditions:
      for each Badge: if condition met AND not already earned → create StudentBadge
  → Cập nhật DailyMission progress
```

### 6.2 Khi phụ huynh duyệt nội dung

```
Parent truy cập /parent/review
  → Query: SELECT * FROM Lesson WHERE approved = false
  → Phụ huynh click "Duyệt"
  → UPDATE Lesson SET approved = true WHERE id = ?
  → Bài học xuất hiện trong danh sách của bé ngay lập tức
```
