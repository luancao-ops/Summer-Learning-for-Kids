# Summer Quest — Content Model

**Version:** 1.0  
**Date:** 2026-05-26

---

## 1. Lesson JSON Schema

Mỗi bài học được lưu trong database (Prisma) và có thể được seed từ file JSON.

```typescript
// types/content.ts

export interface LessonSlide {
  id: string;                     // "slide-1", "slide-2"...
  type: "text" | "example" | "visual" | "summary";
  title?: string;                 // Tiêu đề slide (tuỳ chọn)
  content: string;                // Nội dung chính (Markdown)
  emoji?: string;                 // Emoji minh hoạ
  note?: string;                  // Ghi chú thêm (màu khác)
}

export interface Lesson {
  id: string;                     // "lesson-g4-math-001"
  studentTarget: "girl" | "boy" | "both";
  gradeLevel: 3 | 4 | 5;
  phase: "review" | "prep";       // Ôn tập hay Chuẩn bị
  subject: "math" | "vietnamese" | "english";
  orderIndex: number;             // Thứ tự trong môn học
  title: string;                  // "Phân số cơ bản"
  description: string;            // Mô tả ngắn 1–2 câu
  emoji: string;                  // Emoji đại diện bài học
  estimatedMinutes: number;       // Thời gian ước tính (phút)
  approved: boolean;              // false = chờ phụ huynh duyệt
  slides: LessonSlide[];          // Nội dung bài học
}
```

### 1.1 Ví dụ Lesson — Toán Lớp 4: Phân số cơ bản

```json
{
  "id": "lesson-g4-math-003",
  "studentTarget": "girl",
  "gradeLevel": 4,
  "phase": "review",
  "subject": "math",
  "orderIndex": 3,
  "title": "Phân số cơ bản",
  "description": "Tìm hiểu phân số là gì và cách đọc, viết phân số đơn giản.",
  "emoji": "🍕",
  "estimatedMinutes": 8,
  "approved": true,
  "slides": [
    {
      "id": "slide-1",
      "type": "text",
      "title": "Phân số là gì?",
      "content": "Khi chúng ta chia **đều** một thứ gì đó thành nhiều phần bằng nhau, mỗi phần đó được gọi là một **phân số**.",
      "emoji": "🍕",
      "note": "Ví dụ: Chia đều 1 chiếc bánh pizza cho 4 bạn → mỗi bạn được 1/4 chiếc bánh."
    },
    {
      "id": "slide-2",
      "type": "example",
      "title": "Cách viết phân số",
      "content": "Phân số gồm **2 phần** được ngăn cách bởi một gạch ngang:\n\n**a/b** (đọc là: a phần b)\n\n- **a** = Tử số (phần trên gạch) → số phần ta có\n- **b** = Mẫu số (phần dưới gạch) → tổng số phần bằng nhau",
      "emoji": "✏️"
    },
    {
      "id": "slide-3",
      "type": "example",
      "title": "Ví dụ thực tế",
      "content": "🍫 Một thanh sô-cô-la chia thành **8 miếng** bằng nhau.\n\nBạn An ăn **3 miếng** → Bạn An đã ăn **3/8** thanh sô-cô-la.\n\n- Tử số: **3** (số miếng An ăn)\n- Mẫu số: **8** (tổng số miếng bằng nhau)",
      "emoji": "🍫"
    },
    {
      "id": "slide-4",
      "type": "summary",
      "title": "Bạn đã biết!",
      "content": "✅ Phân số = số phần / tổng số phần bằng nhau\n✅ Tử số = số ở TRÊN gạch ngang\n✅ Mẫu số = số ở DƯỚI gạch ngang\n✅ Đọc: \"tử số PHẦN mẫu số\"",
      "emoji": "🌟"
    }
  ]
}
```

---

## 2. Quiz JSON Schema

```typescript
export type QuestionType = "multiple_choice" | "true_false" | "fill_blank";

export interface QuizOption {
  id: string;          // "A", "B", "C", "D"
  text: string;        // Nội dung lựa chọn
}

export interface Question {
  id: string;                    // "q-g4-math-003-001"
  lessonId: string;              // Tham chiếu đến bài học
  orderIndex: number;
  type: QuestionType;
  text: string;                  // Câu hỏi
  options: QuizOption[];         // 4 lựa chọn (multiple_choice) hoặc 2 (true_false)
  correctAnswer: string;         // "B" hoặc "true"/"false"
  explanation: string;           // Giải thích tại sao đúng
  hint?: string;                 // Gợi ý (nếu bé dùng hint)
  emoji?: string;                // Emoji minh hoạ câu hỏi
}

export interface Quiz {
  id: string;                    // "quiz-g4-math-003"
  lessonId: string;
  title: string;
  questions: Question[];
}
```

### 2.1 Ví dụ Quiz — Toán Lớp 4: Phân số cơ bản

```json
{
  "id": "quiz-g4-math-003",
  "lessonId": "lesson-g4-math-003",
  "title": "Kiểm tra: Phân số cơ bản",
  "questions": [
    {
      "id": "q-g4-math-003-001",
      "lessonId": "lesson-g4-math-003",
      "orderIndex": 1,
      "type": "multiple_choice",
      "text": "Phân số 3/5 đọc là gì?",
      "options": [
        { "id": "A", "text": "Năm phần ba" },
        { "id": "B", "text": "Ba phần năm" },
        { "id": "C", "text": "Ba phần tư" },
        { "id": "D", "text": "Năm phần tám" }
      ],
      "correctAnswer": "B",
      "explanation": "Phân số đọc từ trên xuống: Tử số là 3 (ba) → đọc trước, mẫu số là 5 (năm) → đọc sau. Vậy 3/5 đọc là 'ba phần năm'.",
      "hint": "Hãy nhớ: đọc tử số trước, rồi nói 'phần', rồi đọc mẫu số.",
      "emoji": "🍕"
    },
    {
      "id": "q-g4-math-003-002",
      "lessonId": "lesson-g4-math-003",
      "orderIndex": 2,
      "type": "true_false",
      "text": "Trong phân số 7/9, số 9 là tử số.",
      "options": [
        { "id": "true", "text": "Đúng" },
        { "id": "false", "text": "Sai" }
      ],
      "correctAnswer": "false",
      "explanation": "Số 9 là mẫu số (ở dưới gạch ngang). Tử số là 7 (ở trên gạch ngang).",
      "hint": "Nhớ lại: Tử số ở TRÊN, mẫu số ở DƯỚI gạch ngang.",
      "emoji": "✏️"
    },
    {
      "id": "q-g4-math-003-003",
      "lessonId": "lesson-g4-math-003",
      "orderIndex": 3,
      "type": "multiple_choice",
      "text": "Một thanh sô-cô-la được chia thành 8 phần bằng nhau. Mai ăn 5 phần. Phân số biểu diễn phần Mai ăn là?",
      "options": [
        { "id": "A", "text": "8/5" },
        { "id": "B", "text": "5/3" },
        { "id": "C", "text": "5/8" },
        { "id": "D", "text": "3/8" }
      ],
      "correctAnswer": "C",
      "explanation": "Tổng số phần = 8 (mẫu số). Số phần Mai ăn = 5 (tử số). Vậy phân số là 5/8.",
      "hint": "Số phần Mai ăn → tử số. Tổng số phần → mẫu số.",
      "emoji": "🍫"
    },
    {
      "id": "q-g4-math-003-004",
      "lessonId": "lesson-g4-math-003",
      "orderIndex": 4,
      "type": "true_false",
      "text": "Phân số có tử số bằng 0 thì bằng 0.",
      "options": [
        { "id": "true", "text": "Đúng" },
        { "id": "false", "text": "Sai" }
      ],
      "correctAnswer": "true",
      "explanation": "Đúng! Nếu tử số = 0 thì dù mẫu số là bao nhiêu, phân số vẫn bằng 0. Ví dụ: 0/5 = 0.",
      "emoji": "🔢"
    },
    {
      "id": "q-g4-math-003-005",
      "lessonId": "lesson-g4-math-003",
      "orderIndex": 5,
      "type": "multiple_choice",
      "text": "Phân số nào dưới đây đọc là 'bảy phần mười'?",
      "options": [
        { "id": "A", "text": "10/7" },
        { "id": "B", "text": "7/10" },
        { "id": "C", "text": "7/100" },
        { "id": "D", "text": "1/7" }
      ],
      "correctAnswer": "B",
      "explanation": "Bảy phần mười = 7 (tử số) / 10 (mẫu số) = 7/10.",
      "emoji": "✨"
    }
  ]
}
```

---

## 3. Student Profile Schema

```typescript
export interface StudentProfile {
  id: string;                    // "student-girl-001"
  name: string;                  // Tên bé
  gender: "girl" | "boy";
  gradeCompleted: 3 | 4;         // Lớp vừa hoàn thành
  theme: "princess" | "robot";
  
  // Gamification
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string | null;  // "2026-06-15"
  
  // Stats
  totalQuizzesCompleted: number;
  totalLessonsCompleted: number;
  totalCorrectAnswers: number;
  totalQuestionsAttempted: number;
}
```

### 3.1 Ví dụ Student Profiles

```json
[
  {
    "id": "student-girl-001",
    "name": "Bé Bông",
    "gender": "girl",
    "gradeCompleted": 4,
    "theme": "princess",
    "xp": 0,
    "coins": 0,
    "streak": 0,
    "lastActiveDate": null,
    "totalQuizzesCompleted": 0,
    "totalLessonsCompleted": 0,
    "totalCorrectAnswers": 0,
    "totalQuestionsAttempted": 0
  },
  {
    "id": "student-boy-001",
    "name": "Bé Cún",
    "gender": "boy",
    "gradeCompleted": 3,
    "theme": "robot",
    "xp": 0,
    "coins": 0,
    "streak": 0,
    "lastActiveDate": null,
    "totalQuizzesCompleted": 0,
    "totalLessonsCompleted": 0,
    "totalCorrectAnswers": 0,
    "totalQuestionsAttempted": 0
  }
]
```

*Lưu ý: Thay "Bé Bông" / "Bé Cún" bằng tên thật của 2 bé khi cài đặt.*

---

## 4. Theme Config Schema

```typescript
export interface ThemeConfig {
  id: "princess" | "robot";
  name: string;                  // "Princess Craft Kingdom"
  
  colors: {
    primary: string;             // "#9333ea" (tím)
    secondary: string;           // "#f9a8d4" (hồng nhạt)
    accent: string;              // "#fbbf24" (vàng)
    background: string;          // "#fdf4ff" (nền tím rất nhạt)
    cardBg: string;              // "#ffffff"
    text: string;                // "#1e1b4b"
    textMuted: string;           // "#6b7280"
    success: string;             // "#22c55e"
    error: string;               // "#f97316" (cam, không phải đỏ)
  };
  
  fonts: {
    heading: string;             // Google Font name
    body: string;
  };
  
  mascot: {
    name: string;                // "Công chúa thỏ trắng"
    emoji: string;               // "👑"
    description: string;
  };
  
  levelNames: string[];          // Array tên level từ 1 đến 7
  
  feedback: {
    correct1: string[];          // Array câu phản hồi đúng lần 1
    correct2: string[];          // Array câu phản hồi đúng lần 2
    wrong1: string[];            // Array câu phản hồi sai lần 1
    wrong2: string[];            // Array câu phản hồi xem đáp án
  };
  
  rewards: {
    levelUpMessage: string;      // Template: "Chúc mừng {name} lên Level {level}!"
    badgeMessage: string;        // Template: "Huy hiệu mới: {badge}!"
    streakMessage: string;       // Template: "{streak} ngày chăm chỉ! 🔥"
  };
}
```

### 4.1 Princess Theme Config Example

```json
{
  "id": "princess",
  "name": "Princess Craft Kingdom",
  "colors": {
    "primary": "#9333ea",
    "secondary": "#f9a8d4",
    "accent": "#fbbf24",
    "background": "#fdf4ff",
    "cardBg": "#ffffff",
    "text": "#1e1b4b",
    "textMuted": "#7c3aed",
    "success": "#22c55e",
    "error": "#f97316"
  },
  "fonts": {
    "heading": "Baloo 2",
    "body": "Nunito"
  },
  "mascot": {
    "name": "Thỏ Công Chúa",
    "emoji": "👑",
    "description": "Người bạn đồng hành của Công chúa trong cuộc phiêu lưu học tập"
  },
  "levelNames": [
    "Tiểu Học Viên",
    "Cô Bé Thông Minh",
    "Công Chúa Sáng Suốt",
    "Công Chúa Hiểu Biết",
    "Nàng Tiên Học Giỏi",
    "Công Chúa Xuất Sắc",
    "Nữ Hoàng Tri Thức"
  ]
}
```

### 4.2 Robot Theme Config Example

```json
{
  "id": "robot",
  "name": "Robot Sport Lab",
  "colors": {
    "primary": "#2563eb",
    "secondary": "#22d3ee",
    "accent": "#f97316",
    "background": "#eff6ff",
    "cardBg": "#ffffff",
    "text": "#1e3a5f",
    "textMuted": "#1d4ed8",
    "success": "#22c55e",
    "error": "#f97316"
  },
  "fonts": {
    "heading": "Orbitron",
    "body": "Nunito"
  },
  "mascot": {
    "name": "Robo-X",
    "emoji": "🤖",
    "description": "Robot đồng đội của Kỹ sư trong Lab"
  },
  "levelNames": [
    "Robot Tập Sự",
    "Kỹ Sư Cơ Bản",
    "Kỹ Sư Lành Nghề",
    "Chuyên Gia Lập Trình",
    "Kỹ Sư Hạng Nhất",
    "Nhà Khoa Học Trẻ",
    "Siêu Kỹ Sư Robot"
  ]
}
```

---

## 5. Ví dụ nội dung theo từng khối lớp

### 5.1 Lớp 3 — Bé trai (Ôn tập)

**Toán:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Cộng, trừ có nhớ trong phạm vi 1000 | 345 + 278 = ? |
| 2 | Bảng nhân 2, 3, 4, 5 | 7 × 4 = ? |
| 3 | Bảng nhân 6, 7, 8, 9 | 8 × 6 = ? |
| 4 | Hình học: chu vi hình chữ nhật | Hình chữ nhật dài 5cm, rộng 3cm có chu vi là? |
| 5 | Bài toán có lời văn | "Có 24 cái kẹo chia đều cho 4 bạn. Mỗi bạn được mấy cái?" |

**Tiếng Việt:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Vần khó: uyên, ươn, ươm | "Suối nguồn" — gạch chân vần trong từ |
| 2 | Từ ngữ về thiên nhiên | Xếp vào đúng nhóm: núi, sông, mây, cây |
| 3 | Câu đơn: Chủ ngữ - Vị ngữ | Tìm CN-VN: "Con mèo đang ngủ." |
| 4 | Dấu câu cơ bản | Điền dấu thích hợp: "Bạn tên là gì___" |
| 5 | Viết câu hoàn chỉnh | Đặt câu với từ: "vui vẻ" |

**Tiếng Anh:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Numbers 1–20 | "Eleven" = ? |
| 2 | Colors & shapes | Red, blue, green, circle, square |
| 3 | Greetings | "Good morning" / "How are you?" |
| 4 | Body parts | Head, shoulders, knees, toes |
| 5 | School objects | Pencil, book, ruler, bag |

### 5.2 Lớp 4 — Bé gái (Ôn tập)

**Toán:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Phép nhân số có 2-3 chữ số | 234 × 5 = ? |
| 2 | Số lớn đến triệu | Đọc số: 4.500.000 |
| 3 | Phân số cơ bản | 3/5 đọc là gì? |
| 4 | So sánh phân số cùng mẫu | 3/7 và 5/7: số nào lớn hơn? |
| 5 | Diện tích hình chữ nhật | S = dài × rộng; tính S khi dài 6, rộng 4 |

**Tiếng Việt:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Từ ghép / từ láy | "Lung linh" là từ láy gì? |
| 2 | Câu kể / câu hỏi / câu cảm | Xác định loại câu: "Bạn đang làm gì vậy?" |
| 3 | Đoạn văn: ý chính | Đọc đoạn văn → Câu nào là câu chủ đề? |
| 4 | Chính tả nâng cao | Chọn đúng: d/gi/r; n/ng |
| 5 | Luyện viết câu | Viết 2 câu tả con mèo của em |

**Tiếng Anh:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Colors & shapes (review) | "What color is the apple?" |
| 2 | Family members | Mother, father, sister, brother |
| 3 | Animals | Dog, cat, bird, fish, rabbit |
| 4 | School objects | "Point to the pencil case." |
| 5 | Simple sentences | "I have a ___." (dog/book/bag) |

### 5.3 Lớp 4 — Bé trai (Chuẩn bị cho Lớp 4)

**Toán:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Số đến triệu — đọc, viết | Đọc số: 3.200.000 — "ba triệu hai trăm nghìn" |
| 2 | Số La Mã cơ bản (I đến XII) | "Đồng hồ chỉ số VIII là mấy giờ?" |

*(2 bài chuẩn bị Lớp 4 trong MVP, mở rộng sau)*

**Tiếng Việt:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Chủ ngữ — Vị ngữ trong câu | Tìm CN-VN: "Chú mèo đang nằm ngủ trên bậu cửa." |
| 2 | Câu ghép đơn giản | Nối 2 câu ngắn thành câu ghép: "Nam học giỏi. Nam được cô khen." |

**Tiếng Anh:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Greetings & introductions | "Hello, my name is ___. I am ___ years old." |
| 2 | Daily routines (simple present) | "I wake up at 6 o'clock." / "I go to school every day." |

---

### 5.4 Lớp 5 — Bé gái (Chuẩn bị cho Lớp 5)

**Toán:**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Số thập phân cơ bản | 0.5 = 1/2; 0.25 = 1/4 |
| 2 | Phân số thập phân | 3/10 = 0.3; 7/100 = 0.07 |

*(2 bài chuẩn bị Lớp 5 trong MVP, mở rộng sau)*

**Tiếng Việt (chuẩn bị Lớp 5):**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Từ đồng nghĩa / trái nghĩa | "Vui" ↔ "buồn"; "nóng" ↔ "lạnh"; tìm từ đồng nghĩa của "xinh đẹp" |
| 2 | Đoạn văn miêu tả | Đọc đoạn tả con mèo → trả lời câu hỏi về chi tiết |

**Tiếng Anh (chuẩn bị Lớp 5):**
| Bài | Chủ đề | Ví dụ bài tập |
|---|---|---|
| 1 | Simple present tense | "She plays football every weekend." — Đúng hay Sai? |
| 2 | Describing people | "My friend is tall and has short hair." — Match with picture |

---

## 6. Quy tắc tạo nội dung gốc

### 6.1 Nguyên tắc cốt lõi

> **Không sao chép sách giáo khoa.** Tất cả bài tập phải là nội dung gốc, được tạo ra từ đầu, chỉ dựa trên mục tiêu học tập (learning objective) của chương trình.

### 6.2 Checklist khi tạo nội dung

- [ ] **Ngữ cảnh gần gũi:** Dùng tình huống thực tế bé quen thuộc (bánh, kẹo, đồ chơi, bạn bè, gia đình, thiên nhiên).
- [ ] **Không trích dẫn:** Không lấy câu, đoạn văn từ sách giáo khoa Tiểu học.
- [ ] **Ngôn ngữ đơn giản:** Câu ngắn, từ quen thuộc với lứa tuổi 9–10.
- [ ] **Ít nhất 2 ví dụ minh hoạ** trong mỗi bài học.
- [ ] **Giải thích rõ ràng:** Mỗi câu sai phải có phần `explanation` đủ để bé tự hiểu.
- [ ] **Hint không tiết lộ đáp án:** Gợi ý hướng suy nghĩ, không nói thẳng đáp án.
- [ ] **Emoji phù hợp:** Minh hoạ khái niệm bằng emoji, không quá 2–3 emoji/slide.
- [ ] **Phụ huynh review:** Bài học mới tạo bởi AI mặc định `approved: false`.

### 6.3 Learning Objectives Template

Trước khi tạo bài học, xác định rõ:

```
Môn học: [Toán / TV / Anh]
Lớp: [3 / 4 / 5]
Chủ đề: [VD: Phân số cơ bản]
Sau bài học, bé có thể:
  1. [Kỹ năng 1 — VD: Đọc và viết được phân số đơn giản]
  2. [Kỹ năng 2 — VD: Xác định tử số và mẫu số]
  3. [Kỹ năng 3 — VD: Lấy ví dụ phân số từ tình huống thực]
Quiz test kỹ năng nào: [1, 2, 3 — mỗi kỹ năng ít nhất 1 câu]
```
