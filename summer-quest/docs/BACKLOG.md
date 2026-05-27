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

## Tổng hợp Tickets theo Priority (cập nhật)

### P0 — Must Have (MVP Blockers)
TICKET-001, 002, 003, 004, 005, 006, 007, 008, 009, 011, 012, 013, 014, 015, 016, 017, 018, 019, 021, 022, 028, 029

### P1 — Should Have (Sprint 2)
TICKET-010, 020, 023, 024, 025, 026, 027

### P2 — Nice to Have (Post-MVP, Phase 2)
TICKET-030, 031, 032, 033, 034, 035, 036, 037, 038, 039, 040, 041
