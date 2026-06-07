# Summer Quest — Product Backlog

**Version:** 1.0  
**Date:** 2026-05-26  
**Priority:** P0 = Must have MVP | P1 = Should have | P2 = Nice to have

---

## Epic 1 — Project Foundation (Nền tảng dự án)

### EPIC-1.1 — Project Setup

**P0** `TICKET-001` **Khởi tạo dự án Next.js**
- Setup Next.js 14 với App Router + TypeScript
- Cài Tailwind CSS
- Cài Prisma + SQLite driver
- Cài Framer Motion (animation)
- Cài Recharts (biểu đồ parent dashboard)
- Chạy được tại `localhost:3000`
- **Acceptance criteria:**
  - `npm run dev` chạy không lỗi
  - Trang chủ hiển thị được
  - TypeScript không có type error

**P0** `TICKET-002` **Thiết kế Prisma Schema**
- Tạo file `prisma/schema.prisma` với đầy đủ models
- Models: Student, Subject, Lesson, Quiz, Question, LessonProgress, QuizAttempt, QuestionAttempt, Badge, StudentBadge, DailyMission
- Chạy `prisma migrate dev`
- **Acceptance criteria:**
  - Database `summer-quest.db` tồn tại sau migrate
  - Tất cả tables được tạo đúng

**P0** `TICKET-003` **Seed data cơ bản**
- Tạo script `prisma/seed.ts`
- Seed 2 student profiles (bé gái + bé trai)
- Seed 3 subjects (Toán, Tiếng Việt, Tiếng Anh)
- Seed 5 bài học × 3 môn × 2 bé = 30 bài học có quiz
- Seed badge list
- **Acceptance criteria:**
  - `npx prisma db seed` chạy không lỗi
  - Dữ liệu hiển thị đúng khi query

---

## Epic 2 — Theme System (Hệ thống giao diện)

**P0** `TICKET-004` **Theme Config & Provider**
- Tạo file `src/lib/themes.ts` với 2 theme config
- Theme Princess: màu tím/hồng, font chữ nhẹ nhàng, emoji 👑🌸✨
- Theme Robot: màu xanh/cam, font chữ kỹ thuật, emoji ⚙️🤖🔵
- ThemeProvider bọc toàn bộ layout của từng student
- CSS variables cho màu sắc theme
- **Acceptance criteria:**
  - Chuyển giữa 2 theme không bị lỗi
  - Màu sắc áp dụng đúng theo hồ sơ học sinh

**P0** `TICKET-005` **Layout & Navigation cơ bản**
- Layout chính: sidebar hoặc top nav với mascot
- Breadcrumb: Trang chủ → Dashboard → Môn học → Bài học
- Nút "Về trang chủ" luôn hiển thị
- Responsive tối thiểu 1280×720
- **Acceptance criteria:**
  - Navigation hoạt động đúng
  - Không bị layout broken ở 1280×720

---

## Epic 3 — Student Selection (Chọn học sinh)

**P0** `TICKET-006` **Màn hình chọn học sinh**
- Trang `/` hiển thị 2 card avatar
- Card bé gái: Princess theme, tên, level, streak
- Card bé trai: Robot theme, tên, level, streak
- Hover effect và animation khi chọn
- Click → navigate đến `/[studentId]/dashboard`
- **Acceptance criteria:**
  - 2 card hiển thị đúng tên, level, streak
  - Click điều hướng đúng

---

## Epic 4 — Dashboard cá nhân

**P0** `TICKET-007` **Dashboard layout & XP Bar**
- Header: tên bé, mascot, level badge
- XP Bar với animation fill
- Coin counter với icon
- Streak counter với icon lửa
- Responsive grid layout
- **Acceptance criteria:**
  - XP bar hiển thị đúng % dựa trên XP/100
  - Coin và streak lấy từ database

**P0** `TICKET-008` **Daily Mission Widget**
- Hiển thị 2–3 nhiệm vụ ngày hôm nay
- Mỗi nhiệm vụ: icon, mô tả, tiến độ (0/1 hoặc 0/3)
- Tick xanh khi hoàn thành
- Logic tạo mission theo ngày (dựa trên bài chưa học)
- **Acceptance criteria:**
  - Mission reset mỗi ngày (dựa trên date)
  - Hoàn thành mission → cập nhật trực tiếp không cần reload

**P0** `TICKET-009` **Subject Cards trên Dashboard**
- 3 card môn học: Toán, Tiếng Việt, Tiếng Anh
- Mỗi card: icon môn, % hoàn thành, số bài còn lại
- Click vào card → vào danh sách bài học môn đó
- **Acceptance criteria:**
  - % hoàn thành tính đúng dựa trên LessonProgress
  - Icon và màu khác nhau cho mỗi môn

**P1** `TICKET-010` **Badge Showcase trên Dashboard**
- Hiển thị 3 badge gần nhất
- Nút "Xem tất cả" → mở badge gallery
- Badge chưa đạt hiển thị mờ (locked state)
- **Acceptance criteria:**
  - Badge earned hiển thị đủ màu
  - Badge locked hiển thị icon mờ + mô tả điều kiện

---

## Epic 5 — Lesson Viewer (Xem bài học)

**P0** `TICKET-011` **Danh sách bài học theo môn**
- Trang `/[studentId]/subject/[subject]`
- Liệt kê bài học theo thứ tự
- Mỗi bài: tiêu đề, mô tả ngắn, trạng thái (chưa học/đang học/hoàn thành)
- Badge "Khóa" nếu bài trước chưa hoàn thành (sequential unlock)
- **Acceptance criteria:**
  - Bài đã hoàn thành có icon tick xanh
  - Bài bị khóa không click được

**P0** `TICKET-012` **Lesson Viewer**
- Trang `/[studentId]/lesson/[lessonId]`
- Hiển thị nội dung bài học dạng slide (từng trang)
- Nút "Tiếp theo" / "Quay lại"
- Progress indicator (trang x/y)
- Nút "Làm bài" cuối bài → redirect sang quiz
- **Acceptance criteria:**
  - Slide chuyển trang mượt
  - Không mất dữ liệu khi navigate giữa các slide

---

## Epic 6 — Quiz Engine (Hệ thống bài kiểm tra)

**P0** `TICKET-013` **Quiz Engine — Câu hỏi trắc nghiệm**
- Trang `/[studentId]/quiz/[quizId]`
- Hiển thị câu hỏi + 4 lựa chọn
- Chọn đáp án → highlight + disable các nút khác
- Hiển thị feedback ngay (đúng/sai + giải thích)
- Nút "Câu tiếp theo"
- **Acceptance criteria:**
  - Không thể chọn lại sau khi đã chọn
  - Feedback text đúng theo theme (Princess vs Robot)

**P0** `TICKET-014` **Quiz Engine — True/False**
- Câu hỏi đúng/sai với 2 nút lớn
- Feedback tương tự trắc nghiệm
- **Acceptance criteria:**
  - Layout 2 nút rõ ràng, dễ bấm

**P0** `TICKET-015` **Quiz Engine — Retry Logic**
- Sai lần 1: hiển thị "Thử lại nhé!" + cho chọn lại (không mất điểm nặng)
- Sai lần 2: hiển thị đáp án đúng + giải thích
- XP nhận được: lần 1 đúng = 10 XP, lần 2 đúng = 7 XP, lần 3 = xem đáp án = 0 XP nhưng +2 XP "cố gắng"
- **Acceptance criteria:**
  - Retry counter hoạt động đúng
  - Không bao giờ hiển thị "0 điểm" một cách brutal

**P0** `TICKET-016` **Quiz Result Screen**
- Sau câu cuối: hiển thị màn hình kết quả
- Điểm: X/Y câu đúng
- XP nhận được hôm nay
- Coin nhận được
- Danh sách câu sai (nếu có)
- Nút "Ôn lại câu sai" và nút "Về Dashboard"
- Animation ăn mừng nếu điểm ≥ 80%
- **Acceptance criteria:**
  - XP và coin được cộng vào database ngay
  - Câu sai được lưu vào MistakeLog

**P0** `TICKET-017` **Lưu kết quả quiz vào database**
- Tạo QuizAttempt record
- Tạo QuestionAttempt record cho từng câu
- Cập nhật LessonProgress (completed = true)
- Cộng XP và coin vào Student record
- Cập nhật streak nếu đây là activity đầu tiên trong ngày
- **Acceptance criteria:**
  - Sau quiz, reload dashboard → XP đã cộng đúng
  - LessonProgress đánh dấu completed

---

## Epic 7 — Gamification

**P0** `TICKET-018` **XP & Level System**
- Level = Math.floor(XP / 100) + 1
- Level-up animation khi vượt ngưỡng
- Level badge hiển thị trên dashboard
- Tên level theo theme:
  - Princess: Học Viên Thần Tiên → Công Chúa Sáng Suốt → ...
  - Robot: Robot Tập Sự → Kỹ Sư Cơ Bản → ...
- **Acceptance criteria:**
  - Level tính đúng
  - Level-up modal hiện ra khi đủ XP

**P0** `TICKET-019` **Streak System**
- Streak tăng 1 khi bé hoàn thành ít nhất 1 quiz trong ngày
- Streak reset về 0 nếu bỏ 1 ngày
- Hiển thị streak trên dashboard với icon lửa 🔥
- **Acceptance criteria:**
  - Streak tính dựa trên date, không phải session
  - Streak 0 khi bỏ ngày

**P1** `TICKET-020` **Daily Mission System**
- Tạo 2–3 mission ngẫu nhiên mỗi ngày dựa trên:
  - Bài chưa học trong tuần
  - Môn học chưa làm hôm nay
  - Câu sai cần ôn
- Mission examples:
  - "Hoàn thành 1 bài Toán hôm nay"
  - "Ôn lại 3 câu sai"
  - "Đạt 80%+ trong bài quiz bất kỳ"
- **Acceptance criteria:**
  - Mission không lặp lại trong ngày
  - Hoàn thành mission → cộng bonus XP

**P0** `TICKET-021` **Badge System**
- Định nghĩa 10 badge (5/bé) trong seed data
- Check badge condition sau mỗi quiz hoàn thành
- Nếu đủ điều kiện → tạo StudentBadge record
- Hiển thị modal ăn mừng badge
- **Acceptance criteria:**
  - Badge chỉ được trao 1 lần/học sinh
  - Modal hiển thị đúng theme

---

## Epic 8 — Mistake Review (Ôn luyện câu sai)

**P0** `TICKET-022` **Trang Ôn luyện**
- Trang `/[studentId]/review`
- Liệt kê câu sai gần nhất (giới hạn 20 câu)
- Mỗi câu: câu hỏi, đáp án đã chọn (sai), nút "Làm lại"
- **Acceptance criteria:**
  - Hiển thị đúng câu sai với nội dung đầy đủ

**P1** `TICKET-023` **Ôn lại từng câu sai**
- Click "Làm lại" → modal quiz nhỏ cho câu đó
- Trả lời đúng → remove câu khỏi danh sách sai
- Trả lời sai → giữ nguyên + hiện giải thích
- **Acceptance criteria:**
  - Danh sách câu sai cập nhật sau khi làm đúng

---

## Epic 9 — Parent Dashboard

**P1** `TICKET-024` **Trang Parent Dashboard**
- Route: `/parent`
- Tổng quan: 2 card (bé gái + bé trai) với XP, streak, số bài hoàn thành
- Không cần password trong MVP (có thể thêm sau)
- **Acceptance criteria:**
  - Trang load đúng dữ liệu từ database
  - Không crash nếu bé chưa học bài nào

**P1** `TICKET-025` **Biểu đồ tiến độ (Progress Chart)**
- Biểu đồ line chart: XP theo ngày trong 7 ngày gần nhất
- Dùng Recharts
- Hiển thị cả 2 bé trên cùng biểu đồ hoặc tab riêng
- **Acceptance criteria:**
  - Chart render đúng không lỗi
  - Trục X là ngày, trục Y là XP tích luỹ

**P1** `TICKET-026` **Danh sách câu sai của từng bé**
- Tab hoặc section riêng cho từng bé
- Danh sách câu sai với: môn học, câu hỏi, đáp án sai, đáp án đúng, ngày sai
- **Acceptance criteria:**
  - Dữ liệu đúng và đầy đủ
  - Có thể lọc theo môn học

**P1** `TICKET-027` **AI Content Review Queue**
- Danh sách bài học/quiz có `approved = false`
- Phụ huynh xem nội dung từng bài
- Nút "Duyệt" / "Từ chối" / "Chỉnh sửa"
- Bài bị từ chối → ẩn khỏi danh sách bé
- **Acceptance criteria:**
  - Bài chưa approved không hiển thị cho bé
  - Sau khi duyệt → bài hiển thị ngay cho bé

---

## Epic 10 — Content Management

**P0** `TICKET-028` **Seed nội dung bài học bé gái (Lớp 4)**
- 5 bài Toán: Phép nhân/chia; Phân số; Hình học; Đo lường; Bài toán lời văn
- 5 bài Tiếng Việt: Từ ghép/láy; Câu kể; Viết đoạn văn; Chính tả; Từ ngữ
- 5 bài Tiếng Anh: Colors & shapes; Family; Animals; School; Simple sentences
- Mỗi bài có quiz 5 câu (trắc nghiệm + đúng/sai)
- **Acceptance criteria:**
  - Tất cả 15 bài + 75 câu hỏi có trong database
  - Nội dung tiếng Việt, không sao chép sách giáo khoa

**P0** `TICKET-029` **Seed nội dung bài học bé trai (Lớp 3)**
- 5 bài Toán: Cộng/trừ có nhớ; Bảng nhân; Hình học đơn; Đo lường; Bài toán
- 5 bài Tiếng Việt: Vần khó; Từ ngữ thiên nhiên; Câu đơn; Chính tả; Kể chuyện
- 5 bài Tiếng Anh: Numbers; Greetings; Body parts; School items; Simple Q&A
- Mỗi bài có quiz 5 câu
- **Acceptance criteria:**
  - Tất cả 15 bài + 75 câu hỏi có trong database

---

## Tổng hợp Tickets theo Priority

### P0 — Must Have (MVP Blockers)
TICKET-001, 002, 003, 004, 005, 006, 007, 008, 009, 011, 012, 013, 014, 015, 016, 017, 018, 019, 021, 022, 028, 029

### P1 — Should Have (Sprint 2)
TICKET-010, 020, 023, 024, 025, 026, 027

### P2 — Nice to Have (Post-MVP)

---

## Epic 11 — Boss Challenge (Phase 2)

**P2** `TICKET-030` **Boss Challenge Engine**
- Quiz tổng hợp 15 câu từ tất cả bài đã học
- Princess version: "Giải cứu lâu đài" narrative wrapper
- Robot version: "Chiến dịch Robo-X" narrative wrapper
- Không có retry (mỗi câu 1 lần duy nhất)
- Thắng = ≥10/15 câu đúng → badge đặc biệt
- **Acceptance criteria:**
  - Chỉ mở khi bé đã hoàn thành ≥10 bài học
  - Kết quả lưu vào QuizAttempt với type="boss"

**P2** `TICKET-031` **Boss Challenge Content — Cuối Giai đoạn Ôn Tập**
- 15 câu mix 3 môn (5 Toán + 5 TV + 5 Anh) từ các bài đã học
- Seed cho bé gái và bé trai riêng biệt
- **Acceptance criteria:**
  - Câu hỏi không trùng với quiz thông thường (original content)
  - Approved = false (phụ huynh duyệt trước)

---

## Epic 12 — Mini-Games (Phase 2)

**P2** `TICKET-032` **Mini-game: Xếp số (Math — Cả 2 bé)**
- Drag-and-drop các ô số để sắp xếp từ nhỏ đến lớn
- Dùng với bài học về so sánh số
- **Acceptance criteria:**
  - Hoạt động trên desktop (mouse drag)
  - Kết quả tính vào XP

**P2** `TICKET-033` **Mini-game: Ghép từ (Vietnamese — Princess theme)**
- Thẻ chữ xuất hiện → bé nối 2 thẻ thành từ ghép đúng
- Hiệu ứng: thẻ đúng biến thành hoa 🌸
- **Acceptance criteria:**
  - Ít nhất 8 cặp từ/lượt chơi
  - Không có từ trùng nhau trong cùng 1 lượt

**P2** `TICKET-034` **Mini-game: Bắn bóng từ vựng (English — Robot theme)**
- Bóng bay lên có từ tiếng Anh
- Bé click vào bóng có nghĩa đúng với hình minh hoạ
- **Acceptance criteria:**
  - Tốc độ bóng có thể điều chỉnh (dễ/thường/nhanh)
  - Không có đồng hồ đếm ngược bắt buộc

---

## Epic 13 — Enhanced Quiz Types (Phase 2)

**P2** `TICKET-035` **Fill-in-the-Blank Question Type**
- Thêm type "fill_blank" vào Quiz Engine
- Bé gõ đáp án vào ô trống
- So sánh không phân biệt hoa thường, cho phép dấu câu khác nhau
- **Acceptance criteria:**
  - Hỗ trợ cả tiếng Việt (có dấu)
  - Gợi ý hiện số ký tự của đáp án đúng

**P2** `TICKET-036` **Drag-and-Drop Matching Question Type**
- Nối cột trái (từ/câu) với cột phải (nghĩa/hình)
- Dùng cho: từ vựng tiếng Anh, từ đồng nghĩa tiếng Việt
- **Acceptance criteria:**
  - Hoạt động trên chuột desktop
  - Tối đa 5 cặp/câu hỏi

---

## Epic 14 — Enhanced Parent Features (Phase 2)

**P2** `TICKET-037` **PIN bảo vệ Parent Dashboard**
- Cài PIN 4 số khi setup lần đầu
- Nhập PIN trước khi vào /parent
- Reset PIN: xoá file local config
- **Acceptance criteria:**
  - PIN lưu dạng hash (bcrypt hoặc SHA-256) trong SQLite
  - Không lock account sau nhiều lần sai (an toàn cho gia đình)

**P2** `TICKET-038` **Export báo cáo PDF**
- Nút "Xuất báo cáo" trên Parent Dashboard
- PDF gồm: tiến độ 8 tuần, danh sách bài đã học, badge đạt được, câu sai thường gặp
- Dùng `@react-pdf/renderer`
- **Acceptance criteria:**
  - PDF đẹp, có tên bé, ngày xuất
  - Không cần kết nối internet

**P2** `TICKET-039` **Custom Content Creator (Parent)**
- Form đơn giản để phụ huynh tự thêm bài học + quiz
- Không cần AI — nhập thủ công
- **Acceptance criteria:**
  - Phụ huynh tạo được bài học với ≥2 slide và ≥3 câu hỏi
  - Bài tự tạo tự động approved = true (vì phụ huynh tự viết)

---

## Epic 15 — Audio & Accessibility (Phase 2)

**P2** `TICKET-040` **Text-to-Speech cho câu hỏi Tiếng Anh**
- Dùng Web Speech API (browser built-in, không cần key)
- Nút 🔊 cạnh câu hỏi tiếng Anh → đọc to câu hỏi
- **Acceptance criteria:**
  - Hoạt động trên Chrome/Edge
  - Không crash nếu browser không hỗ trợ

**P2** `TICKET-041` **Sound Effects (tùy chọn, mặc định tắt)**
- Âm thanh nhẹ khi đúng / sai / level up / badge
- Nút bật/tắt trong Settings
- Dùng howler.js với file âm thanh local
- **Acceptance criteria:**
  - Mặc định tắt tiếng
  - Không có âm thanh harsh hoặc đáng sợ

---

---

## Epic 16 — Công việc nhà (Chores Module)

> **Yêu cầu từ phụ huynh (2026-05-27):** Mẹ muốn giao danh sách việc nhà cho 2 bé mỗi ngày. Bé tự kiểm tra list, thực hiện, rồi mô tả mức độ hoàn thành và tự check vào từng việc đã xong.

**P0** `TICKET-042` ✅ **Schema + Migration + Seed — Chores & Reading** *(Done — Sprint 4)*

> Thực hiện trước tất cả ticket trong Epic 16 và 17 — mọi thứ phụ thuộc vào bước này.

Thêm 4 model mới vào `prisma/schema.prisma`:

```prisma
model ChoreTemplate {
  id          String  @id @default(cuid())
  name        String                        // "Rửa bát", "Quét nhà"
  icon        String  @default("🧹")       // emoji hiển thị trên checklist
  description String  @default("")         // gợi ý cách làm cho bé

  assignments ChoreAssignment[]
}

model ChoreAssignment {
  id           String   @id @default(cuid())
  choreId      String
  studentId    String
  assignedDate String                       // "YYYY-MM-DD" — không dùng timestamp
  createdAt    DateTime @default(now())

  chore        ChoreTemplate    @relation(fields: [choreId], references: [id])
  student      Student          @relation(fields: [studentId], references: [id])
  completion   ChoreCompletion?

  @@index([studentId, assignedDate])
  @@unique([choreId, studentId, assignedDate])
}

model ChoreCompletion {
  id           String   @id @default(cuid())
  assignmentId String   @unique
  level        String                       // "great" | "okay" | "partial"
  description  String                       // bé tự mô tả bằng lời
  completedAt  DateTime @default(now())

  assignment   ChoreAssignment @relation(fields: [assignmentId], references: [id])
}

model ReadingEntry {
  id        String   @id @default(cuid())
  studentId String
  readDate  String                          // "YYYY-MM-DD"
  bookTitle String
  pagesRead Int      @default(0)
  summary   String                          // tóm tắt nội dung đã đọc
  feelings  String                          // cảm nhận của bé
  createdAt DateTime @default(now())

  student   Student  @relation(fields: [studentId], references: [id])

  @@index([studentId, readDate])
}
```

Thêm 2 relation vào `model Student`:
```prisma
  choreAssignments  ChoreAssignment[]
  readingEntries    ReadingEntry[]
```

Sau đó chạy: `npx prisma migrate dev --name add_chores_reading`

Seed 8 `ChoreTemplate` mặc định (không seed assignment — mẹ giao từng ngày):
```ts
await prisma.choreTemplate.createMany({ data: [
  { name: "Rửa bát",        icon: "🍽️",  description: "Rửa sạch và xếp gọn bát đĩa sau bữa ăn." },
  { name: "Quét nhà",       icon: "🧹",  description: "Quét sạch sàn phòng khách và phòng ngủ." },
  { name: "Lau bàn",        icon: "🧽",  description: "Lau sạch mặt bàn ăn và bàn học." },
  { name: "Tưới cây",       icon: "🌿",  description: "Tưới nước cho cây trong nhà và ngoài ban công." },
  { name: "Gấp quần áo",    icon: "👕",  description: "Gấp gọn quần áo đã phơi khô và xếp vào tủ." },
  { name: "Dọn phòng ngủ",  icon: "🛏️",  description: "Dọn dẹp và sắp xếp lại phòng ngủ của mình." },
  { name: "Đổ rác",         icon: "🗑️",  description: "Mang túi rác ra thùng rác ngoài cửa." },
  { name: "Cho thú cưng ăn",icon: "🐾",  description: "Cho thú cưng ăn đúng giờ và đổi nước sạch." },
]});
```

- **Acceptance criteria:**
  - `npx prisma migrate status` → clean, không pending migration
  - 4 bảng mới tồn tại trong DB
  - 8 `ChoreTemplate` có trong DB sau seed
  - `npm run build` không TypeScript error

---

**P0** `TICKET-043` ✅ **Parent — Giao việc nhà hàng ngày** *(Done — Sprint 4)*

Trang mới: `app/parent/chores/page.tsx`

Layout: 2 cột (1 cột/bé). Mỗi cột hiển thị:
- Danh sách việc đã giao hôm nay (với nút ❌ xoá nếu bé chưa hoàn thành)
- Dropdown chọn từ `ChoreTemplate` + nút "➕ Thêm" để giao việc mới
- Date picker (`<input type="date">`) ở đầu trang để giao việc cho ngày khác

API cần xây:
- `POST /api/parent/chores/assign` — body: `{ choreId, studentId, date }` → tạo `ChoreAssignment`. Trả 409 nếu đã tồn tại (unique constraint).
- `DELETE /api/parent/chores/assign` — body: `{ assignmentId }` → xoá assignment. Trả 400 nếu bé đã báo cáo hoàn thành (có `ChoreCompletion`).

Thêm nút "📋 Giao việc nhà" vào `app/parent/page.tsx` bên cạnh nút "Duyệt nội dung".

- **Acceptance criteria:**
  - Mẹ vào trang, chọn "Rửa bát" cho bé gái ngày hôm nay → bấm Thêm → xuất hiện trong danh sách
  - Xoá được việc nếu bé chưa báo cáo
  - Không thể xoá nếu bé đã báo cáo (nút xoá ẩn hoặc disabled)

---

**P0** `TICKET-044` ✅ **Student — Checklist công việc nhà trên Dashboard** *(Done — Sprint 4)*

Component mới: `components/ChoreChecklist.tsx` — **client component** (`"use client"`)

Props:
```ts
{
  studentId: string;
  assignments: (ChoreAssignment & { chore: ChoreTemplate; completion: ChoreCompletion | null })[];
  theme: AppTheme;
}
```

Mỗi hàng trong checklist:
- Icon + tên công việc
- Trạng thái: ⬜ chưa làm / ✅ đã xong (hiện label level + description của bé)
- Nếu chưa làm: nút "📝 Báo cáo" → mở inline form:
  - 3 nút level: `🌟 Làm tốt lắm` / `👍 Được rồi` / `🔄 Chưa xong hẳn`
  - `<textarea>` mô tả: placeholder "Kể cho mẹ nghe mình đã làm thế nào…"
  - Nút "Lưu" → gọi `POST /api/chores/complete`
  - **Optimistic UI**: khi bấm Lưu → show ✅ ngay, revert nếu API lỗi
- Nếu đã làm: hiển thị level badge + description trong card mềm

API cần xây: `POST /api/chores/complete`
```ts
// Body: { assignmentId, studentId, level, description }
// Validate: assignment.studentId === studentId
// Tạo ChoreCompletion
// Award XP + coins:
//   "great"   → +10 XP, +5 xu
//   "okay"    → +5 XP, +3 xu
//   "partial" → +2 XP, +0 xu
// Dùng prisma.$transaction để update Student.xp và Student.coins
```

Trong `app/student/[studentId]/page.tsx`:
1. Tính `today` một lần: `const today = new Date().toLocaleDateString("sv")` (cho "YYYY-MM-DD")
2. Query assignments:
```ts
const choreAssignments = await prisma.choreAssignment.findMany({
  where: { studentId: student.id, assignedDate: today },
  include: { chore: true, completion: true },
  orderBy: { createdAt: "asc" },
});
```
3. Thêm section mới giữa "Nhiệm vụ hôm nay" và "Môn học":
```tsx
{choreAssignments.length > 0 && (
  <section>
    <h2 className="mb-4 text-2xl font-black">🏠 Công việc nhà hôm nay</h2>
    <ChoreChecklist
      studentId={student.id}
      assignments={choreAssignments}
      theme={theme}
    />
  </section>
)}
```

- **Acceptance criteria:**
  - Bé gái vào dashboard → thấy "Rửa bát" trong checklist
  - Bấm "Báo cáo" → chọn "Làm tốt lắm" + gõ mô tả → Lưu → card hiển thị ✅ + text bé vừa nhập
  - XP của bé tăng đúng (+10 với "great")
  - Không hiện section "Công việc nhà" nếu hôm nay chưa có việc giao

---

**P1** `TICKET-045` ✅ **Parent — Xem báo cáo công việc nhà** *(Done — Sprint 4)*

Trong `app/parent/page.tsx`, thêm section mới "🏠 Công việc nhà hôm nay":
- Query `ChoreAssignment` với `assignedDate = today`, cả 2 bé, include `chore` và `completion`
- Hiển thị dạng bảng: tên bé | icon + tên việc | trạng thái | mô tả của bé
- Trạng thái dùng màu: xanh lá = great, vàng = okay, cam = partial, xám = chưa làm

- **Acceptance criteria:**
  - Mẹ vào `/parent` → thấy đúng việc đã giao, đúng báo cáo của từng bé
  - Không crash khi không có việc nào hôm nay

---

## Epic 17 — Đọc sách hằng ngày (Daily Reading Module)

> **Yêu cầu từ phụ huynh (2026-05-27):** Thêm mục đọc sách mỗi ngày. Sau khi bé đọc xong, bé tự mô tả summary lại những gì đã đọc và cảm nhận của mình.

**P0** `TICKET-046` ✅ **Student — Nhật ký đọc sách trên Dashboard** *(Done — Sprint 4)*

> Schema đã được tạo trong TICKET-042.

Component mới: `components/ReadingLogCard.tsx` — **client component** (`"use client"`)

Props:
```ts
{
  studentId: string;
  existingEntry: ReadingEntry | null;   // entry hôm nay nếu đã có
  theme: AppTheme;
}
```

**Trạng thái A — Chưa đọc hôm nay** (existingEntry = null):
Hiển thị form:
- Text input `bookTitle`: "Tên sách / tên truyện đã đọc hôm nay"
- Number input `pagesRead` (optional): "Số trang đã đọc" — để trống cũng được
- Textarea `summary` (required): placeholder "Hôm nay mình đọc về…" — tóm tắt nội dung
- Textarea `feelings` (required): placeholder "Mình thấy câu chuyện này… vì…" — cảm nhận
- Nút submit: "📖 Lưu buổi đọc hôm nay"
- Gọi `POST /api/reading/log` khi submit

**Trạng thái B — Đã đọc hôm nay** (existingEntry có dữ liệu):
Hiển thị card read-only:
- Header: tên sách + số trang (nếu có)
- Box "Mình đã đọc": nội dung `summary`
- Box "Cảm nhận của mình": nội dung `feelings`
- Nút nhỏ "✏️ Chỉnh sửa" → chuyển về form đã điền sẵn, gọi `PUT /api/reading/log`

API cần xây:
- `POST /api/reading/log`
  ```ts
  // Body: { studentId, bookTitle, pagesRead, summary, feelings }
  // Kiểm tra đã có ReadingEntry cho (studentId, today) chưa → 409 nếu rồi
  // Tạo entry. Award +15 XP, +8 xu (đọc sách quan trọng hơn quiz)
  // prisma.$transaction: tạo entry + update Student.xp/coins
  ```
- `PUT /api/reading/log`
  ```ts
  // Body: { entryId, studentId, bookTitle, pagesRead, summary, feelings }
  // Validate entry.studentId === studentId → 403 nếu sai
  // Update entry. Không award XP lần hai.
  ```

Trong `app/student/[studentId]/page.tsx`:
1. Dùng lại biến `today` đã tính ở TICKET-044
2. Query:
```ts
const todayReadingEntry = await prisma.readingEntry.findFirst({
  where: { studentId: student.id, readDate: today },
});
```
3. Thêm section sau chores:
```tsx
<section>
  <h2 className="mb-4 text-2xl font-black">📚 Đọc sách hôm nay</h2>
  <ReadingLogCard
    studentId={student.id}
    existingEntry={todayReadingEntry}
    theme={theme}
  />
</section>
```

- **Acceptance criteria:**
  - Bé gái thấy section "Đọc sách hôm nay" trên dashboard
  - Điền tên sách "Harry Potter" + 12 trang + summary + feelings → Lưu → hiện card read-only đúng nội dung
  - XP tăng +15, xu tăng +8
  - Lưu lần 2 cùng ngày → 409 error được xử lý gracefully (hiện thông báo thân thiện, không crash)
  - Bấm "Chỉnh sửa" → form hiện lại với dữ liệu cũ → sửa → Lưu lại → card cập nhật, không award XP thêm

---

**P1** `TICKET-047` ✅ **Parent — Xem nhật ký đọc sách** *(Done — Sprint 4)*

Trong `app/parent/page.tsx`, thêm section "📚 Nhật ký đọc sách (7 ngày gần nhất)":
- Query `ReadingEntry` trong 7 ngày qua, cả 2 bé, include `student`
- Hiển thị dạng timeline theo ngày: ngày → tên bé → tên sách (+ số trang) → summary trích đoạn → cảm nhận trích đoạn
- Mỗi entry là 1 card nhỏ có thể expand để đọc đầy đủ (`<details>` element)

- **Acceptance criteria:**
  - Mẹ vào `/parent` → thấy đúng nhật ký đọc sách của từng bé 7 ngày qua
  - Không hiện section nếu chưa có entry nào

---

**P2** `TICKET-048` ✅ **Reading Streak — Chuỗi ngày đọc sách** *(Done — Sprint 4)*

> Schema + API logic + DashboardHeader display tất cả hoàn tất. Streak chỉ hiện khi > 0.

Thêm field `readingStreak Int @default(0)` vào `model Student` trong schema → chạy migration.

Logic trong `POST /api/reading/log`: sau khi tạo entry thành công, kiểm tra xem hôm qua (`readDate - 1 ngày`) có `ReadingEntry` không:
- Có → `readingStreak += 1`
- Không có → `readingStreak = 1`

Hiển thị trên dashboard:
- Thêm stat "📚🔥 {readingStreak}" bên cạnh stat streak học bài trong `DashboardHeader`
- Chỉ hiện nếu `readingStreak > 0`

- **Acceptance criteria:**
  - Đọc sách 3 ngày liên tiếp → reading streak = 3
  - Bỏ 1 ngày → reading streak reset = 1 ngày hôm sau đọc lại
  - Build không lỗi

---

## Tổng hợp Tickets theo Priority (cập nhật)

### P0 — Must Have (MVP Blockers)
TICKET-001, 002, 003, 004, 005, 006, 007, 008, 009, 011, 012, 013, 014, 015, 016, 017, 018, 019, 021, 022, 028, 029

### P1 — Should Have (Sprint 2–3)
TICKET-010, 020, 023, 024, 025, 026, 027

### P0 — Sprint 4 (Habits Module — mới thêm 2026-05-27)
TICKET-042, 043, 044, 046

### P1 — Sprint 4 (Habits Module)
TICKET-045, 047

### P2 — Nice to Have (Post-MVP, Phase 2)
TICKET-030, 031, 032, 033, 034, 035, 036, 037, 038, 039, 040, 041, 048

---

## Epic 18 — Chore Checklist UX Fix (Sprint 5)

> **Lý do:** Yêu cầu gốc từ ba mẹ là "có check list cho từng công việc" — nghĩa là bé thấy ô trống ⬜ bên cạnh mỗi việc, tích vào khi làm xong. Implementation Sprint 4 dùng nút "Báo cáo" (UX kiểu form) thay vì UX kiểu checklist thật sự. Cần redesign lại component.

**P0** `TICKET-049` **ChoreChecklist — Redesign sang UX checklist thật sự**

> 📋 **PM Brief đầy đủ cho Codex:** xem `docs/SPRINT-5.md`

**File cần sửa:** `components/ChoreChecklist.tsx`

**Vấn đề hiện tại:**
- Mỗi task hiện 1 nút "📝 Báo cáo" ở góc phải
- Không có ô ⬜ nào — bé không thấy rõ "việc này chưa làm"
- UX trông như form báo cáo, không phải checklist

**Yêu cầu mới:**

Mỗi row trong checklist hiển thị:
```
[⬜ lớn, clickable]  🍽️ Rửa bát
                     Rửa sạch và xếp gọn bát đĩa sau bữa ăn.
```

Khi bé click vào ⬜ (hoặc vào tên việc) → expand inline form ngay bên dưới:
```
[✅ đã chọn]  🍽️ Rửa bát

Mình làm thế nào?
  [🌟 Làm tốt lắm]  [👍 Được rồi]  [🔄 Chưa xong hẳn]

  ┌────────────────────────────────────────┐
  │ Kể cho mẹ nghe mình đã làm thế nào... │
  └────────────────────────────────────────┘

  [Lưu]
```

Khi đã hoàn thành:
```
[✅]  🍽️ Rửa bát    [🌟 Làm tốt lắm]
      "Mình rửa hết bát rồi, xếp vào kệ gọn lắm ạ"
```

**Chi tiết implement:**

1. Thay nút "📝 Báo cáo" bằng một **checkbox lớn** dạng custom (không dùng `<input type="checkbox">` mặc định của browser — xấu):
```tsx
// Uncompleted: large clickable circle
<button
  type="button"
  onClick={() => setOpenId(id)}
  className="flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center"
  style={{ borderColor: theme.palette.primary, backgroundColor: "transparent" }}
  aria-label="Đánh dấu đã làm"
>
  <span className="text-lg opacity-30">○</span>
</button>

// Completed: filled circle with checkmark
<div
  className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
  style={{ backgroundColor: theme.palette.primary }}
>
  <span className="text-white text-base">✓</span>
</div>
```

2. Layout row: `flex items-start gap-3` — checkbox ở ngoài cùng bên trái, nội dung bên phải

3. Khi form đang mở (`openId === assignment.id`): checkbox hiện trạng thái "đang điền" — circle được tô một phần hoặc có dot ở giữa

4. Giữ nguyên logic: optimistic UI, 3 level buttons, textarea, API call — chỉ thay đổi visual layout

5. Section header "🏠 Công việc nhà hôm nay" trên dashboard — thêm progress indicator:
```tsx
// Ví dụ: "2/3 việc đã xong" khi có ít nhất 1 completed
const completedCount = choreAssignments.filter(a => a.completion).length
const totalCount = choreAssignments.length
// Hiện: "✅ 2/3 việc" bên cạnh header h2
```

**Không thay đổi:**
- Logic API call (giữ nguyên `POST /api/chores/complete`)
- State management (giữ nguyên `openId`, `levelById`, `descriptionById`)
- Error handling và optimistic UI

**Acceptance criteria:**
- [ ] Mỗi task chưa làm: có circle/ô trống rõ ràng bên trái
- [ ] Click vào circle hoặc tên task → form mở ra
- [ ] Task đã làm: circle đầy/filled + ✓ + level badge + description của bé
- [ ] Progress "X/Y việc" hiện trên header section trong dashboard
- [ ] Mobile-friendly: circle đủ lớn để touch (min 32x32px)
- [ ] `npm run build` không lỗi

---

## Epic 19 — English Pronunciation & Weak Question Practice (Sprint 6)

> **Yêu cầu từ phụ huynh (2026-06-07):**
> 1. Bài tiếng Anh cần có nút phát âm để bé click nghe và học cách đọc
> 2. Cần có phần hiển thị những câu bé hay sai nhất (tất cả bài) để luyện tập lại

---

**P1** `TICKET-050` ✅ **English Pronunciation — Voice Button (🔊)** *(Done — Sprint 6)*

Dùng **Web Speech API** (`window.speechSynthesis`) — built-in trên Chrome/Edge, không cần API key, không cần internet, hoàn toàn offline.

**Files cần tạo/sửa:**

1. `components/SpeakButton.tsx` ← NEW client component
```tsx
"use client";
export function SpeakButton({ text }: { text: string }) {
  function speak() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.8; // hơi chậm cho bé dễ nghe
    window.speechSynthesis.speak(u);
  }
  return (
    <button
      type="button"
      onClick={speak}
      title="Nghe phát âm tiếng Anh"
      style={{ touchAction: "manipulation" }}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl transition-transform hover:scale-110"
      aria-label="Nghe phát âm"
    >
      🔊
    </button>
  );
}
```

2. `app/student/[studentId]/lesson/[lessonId]/page.tsx`
   - Lesson query đã include `subject`. Khi `lesson.subject.id === "english"`:
   - Wrap mỗi paragraph trong `<div className="flex items-start gap-2">` với `<SpeakButton text={paragraph} />` ở cuối dòng
   - **Không hiện SpeakButton trên bài Toán hay Tiếng Việt**

3. `app/student/[studentId]/lesson/[lessonId]/quiz/page.tsx`
   - Thêm `subjectId={lesson.subjectId}` vào `<QuizEngine ...>` props

4. `components/QuizEngine.tsx`
   - Thêm `subjectId?: string` vào `QuizEngineProps`
   - Truyền `isEnglish={subjectId === "english"}` xuống `<QuestionRenderer>`

5. `components/QuestionRenderer.tsx`
   - Thêm `isEnglish?: boolean` prop
   - Khi `isEnglish`:
     - Thêm `<SpeakButton text={question.text} />` bên cạnh text câu hỏi trong header
     - Thêm `<SpeakButton text={option.text} />` nhỏ inline trong mỗi option label (sau text option)

**Acceptance criteria:**
- [ ] Bài Tiếng Anh: mỗi đoạn nội dung có nút 🔊 bên cạnh — click → nghe đọc tiếng Anh
- [ ] Quiz Tiếng Anh: câu hỏi có nút 🔊 — click → nghe câu hỏi; mỗi đáp án có nút 🔊 nhỏ
- [ ] Bài Toán và Tiếng Việt: không có nút 🔊 nào
- [ ] Không crash nếu browser không support speechSynthesis (kiểm tra `if (!window.speechSynthesis)`)
- [ ] `npm run build` không lỗi

---

**P1** `TICKET-051` **Frequently Wrong Questions — Câu Hay Sai Nhất**

Hiển thị danh sách câu bé hay làm sai nhất (sai ≥ 2 lần) để luyện tập có mục tiêu.

**Files cần tạo/sửa:**

1. `lib/progress.ts` — thêm helper function:
```ts
import { prisma } from "@/lib/prisma";

type FrequentMistake = {
  questionId: string;
  questionText: string;
  correctAnswer: string;
  explanation: string;
  lessonId: string;
  lessonTitle: string;
  subjectLabel: string;
  wrongCount: bigint; // SQLite COUNT returns bigint via $queryRaw
};

export async function getFrequentMistakes(
  studentId: string,
  minCount = 2,
  limit = 8
): Promise<FrequentMistake[]> {
  return prisma.$queryRaw<FrequentMistake[]>`
    SELECT
      aa.questionId,
      q.text           AS questionText,
      q.correctAnswer,
      q.explanation,
      l.id             AS lessonId,
      l.title          AS lessonTitle,
      (subj.emoji || ' ' || subj.label) AS subjectLabel,
      COUNT(*)         AS wrongCount
    FROM "AttemptAnswer" aa
    INNER JOIN "Attempt"  a    ON a.id    = aa.attemptId
    INNER JOIN "Question" q    ON q.id    = aa.questionId
    INNER JOIN "Lesson"   l    ON l.id    = q.lessonId
    INNER JOIN "Subject"  subj ON subj.id = l.subjectId
    WHERE a.studentId = ${studentId}
      AND aa.isCorrect = 0
    GROUP BY aa.questionId
    HAVING COUNT(*) >= ${minCount}
    ORDER BY wrongCount DESC
    LIMIT ${limit}
  `;
}
```
⚠️ `$queryRaw` trả về `COUNT(*)` dưới dạng `bigint` trong JavaScript — dùng `Number(row.wrongCount)` khi render.

2. `app/student/[studentId]/review/page.tsx`
   - Thêm query: `const frequentMistakes = await getFrequentMistakes(student.id)`
   - Nếu `frequentMistakes.length > 0`, render một section mới **trước** danh sách "Ôn câu sai" hiện tại:
   ```tsx
   <section className="rounded-[8px] p-6 shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
     <div className="text-sm font-black uppercase" style={{ color: theme.palette.accent }}>
       Chú ý đặc biệt
     </div>
     <h2 className="mt-2 text-2xl font-black" style={{ color: theme.palette.text }}>
       🎯 Câu hay sai nhiều lần
     </h2>
     <p className="mt-1 text-sm font-semibold" style={{ color: theme.palette.muted }}>
       Những câu này {student.displayName} đã làm sai từ 2 lần trở lên. Ôn kỹ nhé!
     </p>
     <div className="mt-4 space-y-3">
       {frequentMistakes.map((m) => (
         <div key={m.questionId} className="rounded-xl p-4" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
           <div className="flex items-start justify-between gap-3">
             <div className="flex-1">
               <div className="text-xs font-black uppercase" style={{ color: "#9a3412" }}>
                 {m.subjectLabel} · {m.lessonTitle}
               </div>
               <p className="mt-1 font-bold" style={{ color: "#1e293b" }}>{m.questionText}</p>
               <p className="mt-2 text-sm font-semibold" style={{ color: "#334155" }}>
                 ✅ Đáp án đúng: <span className="font-black">{m.correctAnswer}</span>
               </p>
               <p className="mt-1 text-sm" style={{ color: "#475569" }}>{m.explanation}</p>
             </div>
             <span
               className="shrink-0 rounded-full px-3 py-1 text-xs font-black text-white"
               style={{ backgroundColor: "#dc2626" }}
             >
               Sai {Number(m.wrongCount)}×
             </span>
           </div>
           <Link
             href={`/student/${student.id}/lesson/${m.lessonId}/quiz`}
             className="mt-3 inline-flex h-9 items-center rounded-lg px-4 text-sm font-black text-white"
             style={{ backgroundColor: theme.palette.accent }}
           >
             Làm lại quiz này →
           </Link>
         </div>
       ))}
     </div>
   </section>
   ```

3. `app/parent/page.tsx`
   - Thêm query cho từng student: `getFrequentMistakes(student.id, 2, 5)`
   - Chạy song song: `const [girl, boy] = await Promise.all([getFrequentMistakes("girl"), getFrequentMistakes("boy")])`
   - Thêm section mới "🎯 Câu hay sai của từng bé" bên dưới "Khu vực cần hỗ trợ":
     - Mỗi student: tên + số câu hay sai + bảng top 5 (câu hỏi, môn, số lần sai)
     - Nếu student chưa có dữ liệu: hiện "Chưa đủ dữ liệu — cần làm bài nhiều hơn"

**Acceptance criteria:**
- [ ] Student review page: section "Câu hay sai nhiều lần" xuất hiện khi có câu sai ≥ 2 lần
- [ ] Mỗi câu hiển thị: text câu hỏi, đáp án đúng, giải thích, đếm số lần sai (đỏ), link quiz lại
- [ ] Nút "Làm lại quiz này" dẫn đúng về `/student/[id]/lesson/[lessonId]/quiz`
- [ ] Parent page: section mới "Câu hay sai của từng bé" hiển thị top 5 câu hay sai/bé
- [ ] Không crash khi student chưa làm bài nào (frequentMistakes = [])
- [ ] `npm run build` không lỗi

---

## Epic 20 — Student Avatar Evolution System (Sprint 6)

> **Yêu cầu từ phụ huynh (2026-06-07):** Mỗi bé cần có icon nhân vật riêng (robot cho Johnny, princess cho Yumi). Khi bé lên level hoặc đạt thành tích tốt, icon sẽ nâng cấp lên dạng hấp dẫn hơn theo 5 cấp.

**P1** `TICKET-052` ✅ **Student Avatar SVG Evolution System** *(Done — Sprint 6)*

**Files created/modified:**
- `lib/avatar.ts` ← NEW — pure helpers: `getAvatarTier()`, `getAvatarTierName()`, tier name arrays (no `"use client"`)
- `components/StudentAvatar.tsx` ← NEW — client component, 10 distinct inline SVG designs (5 robot + 5 princess)
- `components/StudentCard.tsx` — replaced `theme.emoji` (`text-8xl`) with `<StudentAvatar size={96}>` + tier name label
- `components/DashboardHeader.tsx` — added `<StudentAvatar size={56}>` next to player name in header

**Avatar tier thresholds (both characters):**

| Tier | Level | Robot name | Princess name |
|---|---|---|---|
| 1 | 1–5 | Robot Tập Sự | Công Chúa Nhỏ |
| 2 | 6–10 | Kỹ Sư Robo-X | Công Chúa Sáng Tạo |
| 3 | 11–15 | Chiến Binh X | Công Chúa Vương Quốc |
| 4 | 16–20 | Chỉ Huy X | Nữ Hoàng |
| 5 | 21+ | Huyền Thoại X | Nữ Hoàng Huyền Thoại |

**Current student tiers (2026-06-07):**
- Yumi: 1180 XP → Level 12 → Tier 3 "Công Chúa Vương Quốc"
- Johnny: 690 XP → Level 7 → Tier 2 "Kỹ Sư Robo-X"

**Bug introduced + fixed during this sprint:**
`getAvatarTierName` was initially exported from the `"use client"` component file, causing homepage 500.
Fixed by extracting pure helpers to `lib/avatar.ts`. See `docs/INCIDENTS.md` 2026-06-07.

**Also fixed in this sprint:**
- Homepage (`/`) was pre-rendered statically — student stats were stale until server restart.
  Fixed: added `export const dynamic = "force-dynamic"` to `app/page.tsx`.
  See `docs/INCIDENTS.md` 2026-06-07.

**Acceptance criteria:** ✅ All met
- [x] Home page: each student card shows their SVG avatar (96px) with tier name below level badge
- [x] Dashboard header: small avatar (56px) beside student name
- [x] Avatar changes automatically as XP crosses level thresholds
- [x] Robot and Princess designs are visually distinct at each tier
- [x] `lib/avatar.ts` has no `"use client"` — safe to call from Server Components
- [x] `npm run build` zero errors
