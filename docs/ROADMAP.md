# Summer Quest — Product Roadmap

**Version:** 1.0  
**Date:** 2026-05-26  
**Kỳ hè:** 2 tháng (8 tuần)  
**Mục tiêu tổng thể:** Có app chạy được và 2 bé dùng được trong tuần đầu tiên của kỳ nghỉ hè.

---

## Tổng quan Timeline

```
Tuần 1–2   │ FOUNDATION    │ Setup + Core Engine
Tuần 3–4   │ CONTENT       │ Nội dung + Quiz cho cả 2 bé
Tuần 5–6   │ GAMIFICATION  │ XP, Badge, Reward, Dashboard
Tuần 7      │ PARENT        │ Parent Dashboard + Content Review
Tuần 8      │ POLISH        │ Kiểm thử, sửa lỗi, hoàn thiện
```

---

## Kế hoạch 8 tuần học hè (Children's Learning Plan)

> Đây là kế hoạch học tập cho 2 bé, không phải kế hoạch kỹ thuật.

### Tuần 1–2: Ôn tập đầu hè (Warm-up Review)

**Bé gái (Lớp 4 review):**
- Toán: Ôn phép nhân, chia có dư; số lớn đến triệu
- Tiếng Việt: Ôn từ ghép, từ láy; câu kể - câu hỏi
- Tiếng Anh: Alphabet, greetings, numbers 1–100

**Bé trai (Lớp 3 review):**
- Toán: Ôn cộng trừ có nhớ; bảng nhân 2–5
- Tiếng Việt: Ôn vần khó; từ chỉ người, đồ vật
- Tiếng Anh: Alphabet, colors, greetings

**Thời gian/ngày:** 20–30 phút  
**Nhiệm vụ/ngày:** 2 bài học nhỏ hoặc 1 bài + 1 quiz

### Tuần 3–4: Ôn tập chuyên sâu (Core Review)

**Bé gái:**
- Toán: Phân số; so sánh phân số; diện tích hình chữ nhật
- Tiếng Việt: Viết đoạn văn; tìm ý chính; chính tả nâng cao
- Tiếng Anh: Family, animals, school objects

**Bé trai:**
- Toán: Bảng nhân 6–9; chia hết; bài toán có lời văn
- Tiếng Việt: Câu đơn; dấu câu; viết câu hoàn chỉnh
- Tiếng Anh: Numbers to 100, body parts, colors

### Tuần 5–6: Chuẩn bị năm mới (Prep Phase)

**Bé gái (chuẩn bị Lớp 5):**
- Toán: Số thập phân cơ bản; phân số thập phân
- Tiếng Việt: Từ đồng nghĩa/trái nghĩa; đoạn văn miêu tả
- Tiếng Anh: Simple present tense; describing people

**Bé trai (chuẩn bị Lớp 4):**
- Toán: Triệu; tỷ; số La Mã cơ bản
- Tiếng Việt: Chủ ngữ - vị ngữ; câu ghép đơn giản
- Tiếng Anh: Greetings & introductions; daily routines

### Tuần 7–8: Thách thức cuối hè (End-of-Summer Challenge)

- Boss Challenge: Quiz tổng hợp tất cả kiến thức
- Review câu sai trong toàn bộ kỳ hè
- Nhận huy hiệu "Hoàn thành kỳ hè" (End-of-Summer Badge)
- Phụ huynh xem báo cáo tổng kết

---

## Milestones kỹ thuật

### 🏁 Milestone 0 — Project Bootstrap (Ngày 1–2)

**Mục tiêu:** Dự án chạy được trên máy, database tồn tại.

Deliverables:
- [ ] Next.js + TypeScript + Tailwind CSS setup
- [ ] Prisma schema + SQLite database
- [ ] Seed data cơ bản (2 học sinh, 3 môn học)
- [ ] App chạy được tại `localhost:3000`
- [ ] Commit đầu tiên lên git

---

### 🏁 Milestone 1 — Core Learning Engine (Tuần 1, Ngày 3–7)

**Mục tiêu:** Học sinh có thể làm quiz và lưu kết quả.

Deliverables:
- [ ] Màn hình chọn học sinh
- [ ] Layout hệ thống theme (Princess / Robot)
- [ ] Quiz Engine hoàn chỉnh (trắc nghiệm 4 lựa chọn)
- [ ] Lưu kết quả quiz vào SQLite
- [ ] Màn hình kết quả sau quiz

**Tiêu chí thành công:** Bé có thể chọn profile → làm quiz → xem điểm.

---

### 🏁 Milestone 2 — Lesson + Dashboard (Tuần 2)

**Mục tiêu:** Trải nghiệm học đầy đủ từ bài học → quiz → kết quả.

Deliverables:
- [ ] Lesson Viewer (hiển thị nội dung bài học)
- [ ] Dashboard cá nhân với XP bar, streak
- [ ] Danh sách bài học theo môn
- [ ] Đánh dấu bài hoàn thành
- [ ] 30 bài học seed data (5 bài × 3 môn × 2 bé)

**Tiêu chí thành công:** Bé có thể học một bài hoàn chỉnh từ đầu đến cuối.

---

### 🏁 Milestone 3 — Gamification (Tuần 3)

**Mục tiêu:** Hệ thống thưởng hoạt động và hấp dẫn.

Deliverables:
- [ ] XP & Level system
- [ ] Coin system
- [ ] Streak tracker
- [ ] Badge system (5 badge/bé)
- [ ] Daily Mission (2–3 nhiệm vụ/ngày)
- [ ] Màn hình ăn mừng badge/level-up
- [ ] Personalized reward items (Princess: trang trí lâu đài; Robot: bộ phận robot)

**Tiêu chí thành công:** Bé nhận được badge sau khi đạt đủ điều kiện.

---

### 🏁 Milestone 4 — Mistake Review + Parent Dashboard (Tuần 4)

**Mục tiêu:** Phụ huynh có thể theo dõi và bé có thể ôn lại câu sai.

Deliverables:
- [ ] Trang Ôn luyện câu sai (Mistake Review)
- [ ] Parent Dashboard: xem tiến độ 2 bé
- [ ] Biểu đồ XP theo ngày/tuần (recharts)
- [ ] Danh sách câu sai của từng bé kèm chi tiết
- [ ] AI Content Review queue (duyệt nội dung chưa approved)

**Tiêu chí thành công:** Phụ huynh vào dashboard và biết bé đã học gì, sai gì.

---

### 🏁 Milestone 5 — Polish + Testing (Tuần 5–6)

**Mục tiêu:** App ổn định, không lỗi, bé dùng được thoải mái.

Deliverables:
- [ ] Kiểm thử end-to-end cả 2 luồng bé
- [ ] Kiểm thử Parent Dashboard
- [ ] Sửa lỗi UI/UX phát sinh
- [ ] Tối ưu animation, loading state
- [ ] Thêm nội dung giai đoạn 2 (prep phase)
- [ ] Viết hướng dẫn sử dụng cho phụ huynh (README)

---

## Thứ tự ưu tiên xây dựng

```
1. Database schema + seed data      ← Nền tảng, mọi thứ phụ thuộc vào đây
2. Quiz Engine                      ← Tính năng cốt lõi nhất
3. Theme system                     ← Ảnh hưởng đến toàn bộ UI
4. Student selection + Dashboard    ← Entry point của bé
5. Lesson Viewer                    ← Bổ sung trải nghiệm trước quiz
6. XP + Streak + Level              ← Gamification cơ bản
7. Badge + Daily Mission            ← Gamification nâng cao
8. Mistake Review                   ← Công cụ học tập quan trọng
9. Parent Dashboard                 ← Cho phụ huynh theo dõi
10. AI Content Review               ← Workflow phụ huynh duyệt nội dung
```

---

### 🏁 Milestone 6 — Habits Module: Công việc nhà + Đọc sách (Sprint 4)

> **Nguồn gốc:** Yêu cầu từ phụ huynh, thêm vào 2026-05-27.

**Mục tiêu:** Mở rộng app từ "chỉ học bài" thành "quản lý thói quen tốt cả ngày" — học bài, làm việc nhà, đọc sách — tất cả trong một chỗ.

Deliverables:
- [ ] Schema + migration: ChoreTemplate, ChoreAssignment, ChoreCompletion, ReadingEntry (TICKET-042)
- [ ] Parent giao việc nhà hàng ngày cho từng bé (TICKET-043)
- [ ] Student thấy checklist việc nhà, tự báo cáo hoàn thành + mô tả (TICKET-044)
- [ ] Student điền nhật ký đọc sách: tên sách, tóm tắt, cảm nhận (TICKET-046)
- [ ] Parent xem báo cáo việc nhà hôm nay (TICKET-045)
- [ ] Parent xem nhật ký đọc sách 7 ngày qua (TICKET-047)

**Tiêu chí thành công:**
- Mẹ giao "Rửa bát" cho bé gái → bé thấy trên dashboard → bé báo cáo xong → mẹ thấy kết quả.
- Bé đọc xong "Harry Potter" → điền summary + cảm nhận → hiển thị đúng trên dashboard và parent view.
- XP/xu được cộng cho cả việc nhà và đọc sách (tích hợp gamification hiện có).

**Thứ tự thực hiện:**
```
TICKET-042 (schema)  →  TICKET-043 + TICKET-046 song song  →  TICKET-044 + TICKET-046  →  TICKET-045 + TICKET-047
```

---

## Có thể để sau (Post-MVP)

| Tính năng | Lý do để sau |
|---|---|
| Mini-games tương tác | Cần Quiz Engine ổn trước |
| Câu hỏi điền vào chỗ trống | Phức tạp hơn trắc nghiệm |
| Âm thanh / nhạc nền | Không ảnh hưởng tính năng cốt lõi |
| Boss Challenge (quiz tổng hợp) | Cần đủ nội dung trước |
| Xuất báo cáo PDF | Tiện ích, không phải cốt lõi |
| App mobile | Scope lớn hơn |

---

## Rủi ro và cách giảm thiểu

| Rủi ro | Xác suất | Cách xử lý |
|---|---|---|
| Nội dung bài học thiếu sót | Trung bình | Tạo seed data đủ từ đầu, phụ huynh review |
| Bé chán vì app không đủ vui | Trung bình | Gamification phải xây sớm (Milestone 3) |
| Bug quiz engine ảnh hưởng kết quả | Thấp | Viết test cho quiz logic ngay |
| Theme không phù hợp sở thích bé | Thấp | Cho phụ huynh preview và điều chỉnh |
