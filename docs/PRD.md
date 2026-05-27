# Summer Quest — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 2026-05-26  
**Status:** Approved for MVP Development  
**Language:** Bilingual UI — Vietnamese primary, English labels for technical terms (XP, Dashboard, Quiz)

---

## 1. Product Vision

> *"Biến mùa hè thành một cuộc phiêu lưu học tập — nơi mỗi đứa trẻ là nhân vật chính trong câu chuyện của riêng mình."*

Summer Quest là nền tảng học tập cá nhân hoá dành cho trẻ em tiểu học trong kỳ nghỉ hè. Thay vì dạy học kiểu trường lớp truyền thống, mỗi bé được sống trong một **thế giới học tập riêng** phù hợp với sở thích, tính cách và phong cách học của mình.

Mục tiêu sản phẩm:
- Giúp trẻ ôn tập kiến thức đã học và chuẩn bị cho năm học mới.
- Duy trì thói quen học 20–40 phút/ngày trong suốt kỳ nghỉ hè.
- Tạo cảm giác thành tựu, không áp lực.
- Cho phép phụ huynh kiểm soát và theo dõi nội dung, tiến độ.

---

## 2. Target Users

### 2.1 Người học chính (Primary Users)

| | Bé gái | Bé trai |
|---|---|---|
| **Lớp hoàn thành** | Lớp 4 | Lớp 3 |
| **Giai đoạn học** | Ôn Lớp 4 → Chuẩn bị Lớp 5 | Ôn Lớp 3 → Chuẩn bị Lớp 4 |
| **Độ tuổi** | ~10 tuổi | ~9 tuổi |

### 2.2 Phụ huynh (Secondary Users)

- Người quản lý nội dung và theo dõi tiến độ.
- Không cần am hiểu kỹ thuật.
- Có quyền duyệt nội dung trước khi bé xem.
- Xem báo cáo sai/đúng để hỗ trợ ôn tập thêm ở nhà.

---

## 3. Learner Personas

### 🌸 Persona A — Bé Công Chúa (Princess Crafter)

**Tên gọi trong app:** Công chúa [tên bé]  
**Thế giới:** Princess Craft Kingdom  
**Màu sắc:** Tím, hồng phấn, vàng nhạt  
**Mascot:** Công chúa thỏ trắng (White Bunny Princess)

**Động lực học:**
- Muốn hoàn thiện lâu đài, mở khoá trang phục công chúa mới.
- Thích được khen ngợi nhẹ nhàng, sáng tạo.
- Bị thu hút bởi câu chuyện và nhiệm vụ có yếu tố tưởng tượng.

**Điểm yếu cần chú ý:**
- Dễ nản lòng khi sai nhiều lần liên tiếp.
- Không thích cảm giác bị "thua" hay bị phán xét.
- Cần hệ thống gợi ý (hints) và cho phép thử lại.

**Tone phản hồi mẫu:**
- Đúng: *"Tuyệt vời! Viên đá quý thứ ba đã về tay công chúa rồi! ✨"*
- Sai: *"Ồ, gần đúng rồi đó! Công chúa thử nghĩ lại một chút nhé 🌸"*
- Gợi ý: *"Muốn xem gợi ý không? Dùng 5 xu thôi nha~"*

---

### 🤖 Persona B — Bé Kỹ Sư Robot (Robot Builder)

**Tên gọi trong app:** Kỹ sư [tên bé]  
**Thế giới:** Robot Sport Lab  
**Màu sắc:** Xanh dương, xanh lá, cam, xám kim loại  
**Mascot:** Robot Robo-X

**Động lực học:**
- Muốn "nâng cấp" robot, mở khoá bộ phận mới, xây đấu trường.
- Thích thách thức logic, bài toán có hướng giải rõ ràng.
- Được thúc đẩy bởi số liệu, điểm số, và cảm giác "hoàn thành nhiệm vụ".

**Điểm yếu cần chú ý:**
- Nhạy cảm với phản hồi tiêu cực.
- Không nên tạo áp lực cạnh tranh quá mức.
- Cần giải thích "tại sao đúng/sai" một cách logic.

**Tone phản hồi mẫu:**
- Đúng: *"Phân tích chính xác! Module toán học của Robo-X đã được nâng cấp! ⚙️"*
- Sai: *"Hệ thống phát hiện lỗi tính toán. Kỹ sư thử kiểm tra lại bước nào?"*
- Gợi ý: *"Robo-X gợi ý: hãy thử chia đôi vấn đề ra xem sao."*

---

## 4. Core User Journeys

### Journey 1 — Bé chọn hồ sơ và bắt đầu ngày học

```
Mở app
  → Màn hình chọn hồ sơ (2 avatar)
    → Bé chọn hồ sơ của mình
      → Vào Dashboard cá nhân
        → Xem Nhiệm vụ hôm nay (Daily Mission)
          → Chọn môn học
            → Xem bài học
              → Làm quiz
                → Nhận thưởng XP + Coin
                  → Xem hoạt hình thưởng
                    → Quay về Dashboard
```

### Journey 2 — Bé làm quiz và gặp câu sai

```
Vào Quiz
  → Đọc câu hỏi
    → Chọn đáp án sai
      → Hiện thông báo khuyến khích (không harsh)
        → Cho phép thử lại (tối đa 2 lần)
          → Vẫn sai → Hiện đáp án đúng + giải thích
            → Tiếp tục câu tiếp theo
              → Kết thúc quiz → Xem kết quả
                → Câu sai được lưu vào "Ôn luyện"
```

### Journey 3 — Phụ huynh kiểm tra tiến độ

```
Vào Parent Dashboard
  → Xem tổng quan tiến độ 2 bé
    → Chọn xem chi tiết từng bé
      → Xem biểu đồ XP theo ngày
        → Xem danh sách câu sai gần đây
          → Xem nội dung bài học / quiz
            → Duyệt nội dung AI (nếu có)
```

### Journey 4 — Bé nhận huy hiệu và phần thưởng

```
Hoàn thành nhiệm vụ ngày
  → Hệ thống kiểm tra điều kiện badge
    → Đủ điều kiện → Màn hình ăn mừng badge
      → Badge hiện ra với hiệu ứng đặc biệt
        → Badge lưu vào bộ sưu tập
          → Công chúa: nhận vật trang trí lâu đài mới
          → Kỹ sư Robot: nhận bộ phận robot mới
```

---

## 5. Functional Requirements

### 5.1 Màn hình chọn học sinh (Student Selection)

- [FR-01] Hiển thị 2 avatar/profile với tên và theme riêng biệt.
- [FR-02] Bấm vào avatar → vào Dashboard của học sinh đó.
- [FR-03] Không cần mật khẩu để truy cập hồ sơ bé.
- [FR-04] Hiển thị streak hiện tại của mỗi bé ngay ở màn hình chọn.

### 5.2 Dashboard cá nhân (Personalized Dashboard)

- [FR-05] Hiển thị tên bé, level, XP bar, coin counter.
- [FR-06] Hiển thị nhiệm vụ ngày hôm nay (Daily Mission) — 2–3 nhiệm vụ nhỏ.
- [FR-07] Hiển thị tiến độ từng môn học (Toán, Tiếng Việt, Tiếng Anh).
- [FR-08] Nút tắt nhanh vào từng môn.
- [FR-09] Hiển thị huy hiệu (badge) gần nhất đạt được.
- [FR-10] Áp dụng theme màu sắc, hình nền, mascot theo hồ sơ bé.

### 5.3 Bài học (Lesson Viewer)

- [FR-11] Bài học hiển thị theo dạng trang trình chiếu đơn giản (slide-style).
- [FR-12] Hỗ trợ nội dung: văn bản, hình ảnh minh hoạ (emoji/SVG), ví dụ mẫu.
- [FR-13] Có nút "Tiếp theo" và "Quay lại" giữa các trang bài học.
- [FR-14] Kết thúc bài học → tự động mở quiz tương ứng.
- [FR-15] Đánh dấu bài học đã hoàn thành sau khi làm xong quiz.

### 5.4 Quiz Engine

- [FR-16] Hỗ trợ 3 loại câu hỏi: trắc nghiệm 4 lựa chọn, đúng/sai, điền vào chỗ trống.
- [FR-17] Hiển thị câu hỏi từng cái một.
- [FR-18] Cho phép thử lại tối đa 2 lần trước khi hiện đáp án.
- [FR-19] Phản hồi tức thì sau mỗi câu (đúng/sai + giải thích).
- [FR-20] Cuối quiz: hiển thị điểm, XP nhận được, câu sai.
- [FR-21] Câu sai tự động lưu vào danh sách "Ôn luyện".
- [FR-22] Không có đồng hồ đếm ngược (no time pressure).

### 5.5 Hệ thống XP, Coins, Badges

- [FR-23] Mỗi câu đúng = +10 XP; bonus +5 XP nếu đúng lần đầu.
- [FR-24] Hoàn thành quiz = +20 coins.
- [FR-25] Level tăng mỗi 100 XP. Có thông báo level-up.
- [FR-26] Streak tăng khi học liên tục mỗi ngày; mất khi bỏ 1 ngày.
- [FR-27] Badge được trao tự động khi đạt điều kiện (xem GAME_DESIGN.md).
- [FR-28] Mỗi theme có bộ phần thưởng riêng (Princess: vật trang trí; Robot: bộ phận).

### 5.6 Ôn luyện câu sai (Mistake Review)

- [FR-29] Trang "Ôn luyện" liệt kê các câu đã sai.
- [FR-30] Bé có thể làm lại từng câu sai.
- [FR-31] Làm đúng câu sai → tự động xoá khỏi danh sách.

### 5.7 Parent Dashboard

- [FR-32] Không cần login; có thể bảo vệ bằng PIN đơn giản (tuỳ chọn trong cài đặt).
- [FR-33] Xem XP, streak, số bài đã hoàn thành của từng bé.
- [FR-34] Biểu đồ tiến độ theo ngày/tuần.
- [FR-35] Danh sách câu sai gần nhất của từng bé kèm nội dung câu hỏi.
- [FR-36] Màn hình duyệt nội dung AI (AI Content Review Queue).
- [FR-37] Phụ huynh có thể Duyệt / Từ chối / Chỉnh sửa nội dung AI trước khi bé xem.

---

## 6. Non-Functional Requirements

| Yêu cầu | Mục tiêu |
|---|---|
| **Hiệu năng** | Trang load < 2 giây trên máy tính gia đình thông thường |
| **Offline** | Hoạt động hoàn toàn offline sau khi cài đặt (local-first) |
| **Dữ liệu** | Tất cả dữ liệu lưu trên SQLite cục bộ, không gửi ra ngoài |
| **Bảo mật** | Không thu thập thông tin cá nhân, không có tracking |
| **Khả năng mở rộng** | Dễ thêm bài học mới qua JSON seed hoặc form phụ huynh |
| **Dễ dùng** | Bé ~9–10 tuổi tự dùng được mà không cần hướng dẫn |
| **Hỗ trợ nền tảng** | Chrome/Edge trên Windows, tối thiểu 1280×720 |

---

## 7. MVP Scope

### ✅ Trong MVP

- Màn hình chọn học sinh (2 profiles)
- Dashboard cá nhân với theme riêng
- 5 bài học mẫu × 3 môn × 2 bé = 30 bài học có quiz
- Quiz engine (trắc nghiệm 4 lựa chọn + đúng/sai)
- XP, Coins, Level, Streak cơ bản
- 5 badge đầu tiên cho mỗi bé
- Lưu tiến độ vào SQLite
- Parent Dashboard: xem tiến độ + danh sách câu sai
- Duyệt nội dung AI cơ bản
- Giao diện tiếng Việt là chính

### ❌ Ngoài MVP (để sau)

- Mini-games tương tác
- Câu hỏi điền vào chỗ trống (fill-in-blank)
- Âm thanh và nhạc nền
- Xuất báo cáo PDF
- Nhiều học sinh (>2)
- Sync dữ liệu lên cloud
- App di động (mobile)
- AI chatbot trực tiếp cho bé

---

## 8. Out-of-Scope Items

| Hạng mục | Lý do loại khỏi MVP |
|---|---|
| Đăng nhập tài khoản cloud | Yêu cầu cơ sở hạ tầng phức tạp, không cần thiết cho gia đình |
| Chat AI trực tiếp với bé | Cần review nội dung — rủi ro nội dung không phù hợp |
| Multiplayer / thi đấu online | Phức tạp, trái nguyên tắc không áp lực cạnh tranh |
| App mobile (iOS/Android) | MVP là web app chạy local, đủ dùng trên tablet/PC |
| Thanh toán / subscription | App miễn phí hoàn toàn cho gia đình |
| Tích hợp sách giáo khoa số | Vấn đề bản quyền, nội dung tự tạo là an toàn hơn |

---

## 9. Safety & Child-Friendly UX Principles

### 9.1 Nguyên tắc không áp lực

- **Không đồng hồ đếm ngược**: Bé làm bài trong trạng thái thoải mái.
- **Không "Game Over"**: Không bao giờ hiển thị thông báo thất bại hoàn toàn.
- **Luôn có gợi ý**: Câu khó có thể dùng hint (trả xu hoặc miễn phí).
- **Cho phép thử lại**: Sai → được thử lại, không bị phạt điểm nặng.

### 9.2 Nguyên tắc phản hồi tích cực

- Câu đúng: Luôn có phản hồi vui vẻ, cụ thể, không chung chung.
- Câu sai: Phản hồi nhẹ nhàng, không dùng từ "sai", "thất bại", "thua".
- Dùng từ như: *"Gần đúng rồi!"*, *"Thử lại nhé!"*, *"Hệ thống phát hiện lỗi nhỏ..."*

### 9.3 Nguyên tắc nội dung an toàn

- Không hiển thị nội dung AI chưa được phụ huynh duyệt.
- Không có quảng cáo, không có link ngoài app.
- Không thu thập bất kỳ dữ liệu nào ra khỏi máy.

### 9.4 Nguyên tắc thiết kế thị giác

- Font chữ lớn, dễ đọc (tối thiểu 16px cho nội dung chính).
- Màu sắc tươi sáng nhưng không gây mỏi mắt.
- Icon và emoji thay thế từ ngữ phức tạp.
- Nút bấm đủ lớn (tối thiểu 44×44px).

---

## 10. Definition of Done

Một tính năng được coi là **Done** khi:

- [x] Chức năng hoạt động đúng theo mô tả trong Backlog.
- [x] Giao diện hiển thị đúng trên Chrome/Edge 1280×720.
- [x] Không có lỗi console error.
- [x] Dữ liệu được lưu đúng vào SQLite và tồn tại sau khi refresh.
- [x] Ngôn ngữ hiển thị tiếng Việt, không có văn bản placeholder tiếng Anh.
- [x] Phụ huynh đã review và không có nội dung không phù hợp với trẻ.
- [x] Không có thông báo harsh/negative với bé.
