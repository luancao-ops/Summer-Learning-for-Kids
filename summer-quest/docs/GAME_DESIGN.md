# Summer Quest — Game Design Document

**Version:** 1.0  
**Date:** 2026-05-26

---

## 1. Hệ thống XP (Experience Points)

### 1.1 Nguồn XP

| Hành động | XP nhận được |
|---|---|
| Trả lời đúng lần 1 | +10 XP |
| Trả lời đúng lần 2 (sau 1 lần sai) | +7 XP |
| Hoàn thành quiz (bất kể điểm) | +20 XP |
| Hoàn thành quiz với 100% | +30 XP (bonus) |
| Hoàn thành Daily Mission | +50 XP |
| Học liên tiếp 7 ngày (milestone) | +100 XP |
| Ôn lại câu sai và làm đúng | +5 XP |
| Đọc xong 1 bài học | +5 XP |

### 1.2 Công thức Level

```
Level = floor(XP / 100) + 1
XP cần cho level tiếp theo = (level * 100) - XP hiện tại
```

Ví dụ:
- 0–99 XP = Level 1
- 100–199 XP = Level 2
- 200–299 XP = Level 3
- ...và cứ thế

### 1.3 Tên Level theo Theme

**Princess Craft Kingdom:**

| Level | Tên | Mô tả |
|---|---|---|
| 1 | 🌱 Tiểu Học Viên | Mới bắt đầu hành trình |
| 2 | 🌸 Cô Bé Thông Minh | Đã biết những điều cơ bản |
| 3 | ✨ Công Chúa Sáng Suốt | Đang tiến bộ vượt bậc |
| 4 | 👑 Công Chúa Hiểu Biết | Kiến thức ngày càng vững |
| 5 | 🔮 Nàng Tiên Học Giỏi | Thành thạo nhiều môn |
| 6 | 🌟 Công Chúa Xuất Sắc | Gần đỉnh vương quốc |
| 7 | 💫 Nữ Hoàng Tri Thức | Đỉnh cao vương quốc! |

**Robot Sport Lab:**

| Level | Tên | Mô tả |
|---|---|---|
| 1 | 🔩 Robot Tập Sự | Khởi động hệ thống |
| 2 | ⚙️ Kỹ Sư Cơ Bản | Đã nắm các module đầu tiên |
| 3 | 🤖 Kỹ Sư Lành Nghề | Hệ thống hoạt động ổn định |
| 4 | 🔧 Chuyên Gia Lập Trình | Xử lý bài toán phức tạp |
| 5 | 🏆 Kỹ Sư Hạng Nhất | Robo-X đã được nâng cấp nhiều |
| 6 | 🚀 Nhà Khoa Học Trẻ | Gần đến cấp độ tối thượng |
| 7 | 💎 Siêu Kỹ Sư Robot | Đỉnh cao của Lab! |

---

## 2. Hệ thống Coins (Xu)

### 2.1 Nguồn Coin

| Hành động | Coin nhận được |
|---|---|
| Hoàn thành quiz | +20 xu |
| Đúng 100% quiz | +10 xu bonus |
| Hoàn thành Daily Mission | +30 xu |
| Streak mỗi 5 ngày | +50 xu |
| Đọc xong bài học | +5 xu |

### 2.2 Chi Coin

| Hành động | Coin tiêu |
|---|---|
| Dùng gợi ý (hint) | -5 xu |
| Mua vật phẩm trang trí (Phase 2) | -20~50 xu |

*MVP: Coin chủ yếu để dùng hint. Tính năng shop Phase 2.*

---

## 3. Hệ thống Streak (Chuỗi học liên tiếp)

### 3.1 Luật Streak

- Streak +1 khi bé hoàn thành ít nhất 1 quiz trong 1 ngày (tính theo ngày dương lịch VN UTC+7).
- Streak reset về 0 nếu bé không hoàn thành quiz trong 1 ngày.
- Ngày đầu tiên dùng app: Streak = 1.

### 3.2 Milestones Streak

| Streak | Phần thưởng |
|---|---|
| 3 ngày | Badge "Học 3 ngày liên tiếp" + 30 XP |
| 7 ngày | Badge "Tuần học chăm chỉ" + 100 XP + 50 xu |
| 14 ngày | Badge "2 tuần bất bại" + 200 XP + 100 xu |
| 30 ngày | Badge "Nhà vô địch" + 500 XP + 200 xu |

### 3.3 Hiển thị Streak

- Icon 🔥 với số ngày
- Màu và độ sáng tăng theo streak (streak < 3: 🔥 nhỏ; streak 7+: 🔥🔥 to hơn)
- Nếu streak vừa bị reset: thông báo nhẹ nhàng "Hôm nay là ngày mới, bắt đầu lại nào!"

---

## 4. Hệ thống Badges (Huy hiệu)

### 4.1 Badge chung (Cả 2 bé)

| Badge | Điều kiện | XP | Icon |
|---|---|---|---|
| 🌱 Bước Đầu Tiên | Hoàn thành bài quiz đầu tiên | 20 | 🌱 |
| 🔥 Học 3 Ngày | Streak đạt 3 | 30 | 🔥 |
| 📚 Ham Học | Hoàn thành 5 bài học | 50 | 📚 |
| 🎯 Chính Xác | Đạt 100% trong 1 quiz | 40 | 🎯 |
| 🔥🔥 Tuần Chăm Chỉ | Streak đạt 7 | 100 | 🔥🔥 |
| 🌟 Toán Học Giỏi | Hoàn thành 5 bài Toán | 60 | 🔢 |
| 📖 Ngôn Ngữ Hay | Hoàn thành 5 bài Tiếng Việt | 60 | 📖 |
| 🌍 Tiếng Anh Tốt | Hoàn thành 5 bài Tiếng Anh | 60 | 🌍 |
| 💪 Chiến Binh | Ôn lại 10 câu sai thành công | 50 | 💪 |
| 🏆 Hoàn Thành Hè | Hoàn thành 15 bài học | 200 | 🏆 |

### 4.2 Badge riêng — Princess Craft Kingdom

| Badge | Điều kiện | XP | Icon |
|---|---|---|---|
| 👑 Công Chúa Đầu Tiên | Chọn profile lần đầu | 10 | 👑 |
| 🌸 Công Chúa Toán Học | 80%+ quiz Toán 3 lần liên tiếp | 80 | 🌸 |
| ✨ Nàng Tiên Chữ Nghĩa | Hoàn thành tất cả bài Tiếng Việt Lớp 4 | 100 | ✨ |
| 🎀 Hoàng Gia Tiếng Anh | Đạt 90%+ quiz Tiếng Anh | 70 | 🎀 |
| 🔮 Phù Thủy Trí Tuệ | Tổng XP đạt 500 | 120 | 🔮 |

### 4.3 Badge riêng — Robot Sport Lab

| Badge | Điều kiện | XP | Icon |
|---|---|---|---|
| ⚙️ Khởi Động Robo-X | Chọn profile lần đầu | 10 | ⚙️ |
| 🤖 Toán Học Siêu Cấp | 80%+ quiz Toán 3 lần liên tiếp | 80 | 🤖 |
| 📡 Ngôn Ngữ Module | Hoàn thành tất cả bài Tiếng Việt Lớp 3 | 100 | 📡 |
| 🌐 Giao Tiếp Quốc Tế | Đạt 90%+ quiz Tiếng Anh | 70 | 🌐 |
| 🚀 Kỹ Sư Xuất Sắc | Tổng XP đạt 500 | 120 | 🚀 |

---

## 5. Personalized Reward System

### 5.1 Princess Craft Kingdom — Hệ thống Phần Thưởng

**Concept:** Mỗi lần đạt thành tích → mở khoá một phần của Lâu Đài Công Chúa.

**Bộ sưu tập Lâu Đài (Castle Collection):**

| Vật phẩm | Mở khoá khi | Hiển thị |
|---|---|---|
| 🏰 Tường lâu đài cơ bản | Level 1 (có từ đầu) | Outline lâu đài |
| 🌸 Vườn hoa | Level 2 | Hoa nở xung quanh lâu đài |
| 🪟 Cửa sổ có đèn | Hoàn thành 5 bài | Cửa sổ sáng lên |
| 🚩 Cờ vương quốc | Streak 7 ngày | Cờ bay trên đỉnh tháp |
| ⭐ Ngôi sao trên đỉnh | Level 5 | Ngôi sao lấp lánh |
| 🌈 Cầu vồng | Tổng XP 300 | Cầu vồng phía sau lâu đài |
| 👸 Công chúa ở ban công | Hoàn thành 15 bài | Avatar công chúa xuất hiện |

**Màn hình Vương Quốc (Kingdom View):**
- Bé xem được lâu đài của mình đang được xây dựng dần dần.
- Các phần chưa mở khoá hiển thị mờ nhạt với gợi ý "Còn X XP nữa nhé!".

**Trang phục Công Chúa:**
- Mỗi level → công chúa trong avatar có thêm phụ kiện mới (vương miện, váy, phép thuật).

### 5.2 Robot Sport Lab — Hệ thống Phần Thưởng

**Concept:** Mỗi lần đạt thành tích → nâng cấp Robo-X với bộ phận mới.

**Bộ phận Robo-X:**

| Bộ phận | Mở khoá khi | Hiển thị |
|---|---|---|
| 🤖 Khung robot cơ bản | Level 1 (có từ đầu) | Robot đơn giản |
| 💪 Cánh tay nâng cấp | Level 2 | Tay robot mạnh hơn |
| 👀 Mắt radar | Hoàn thành 5 bài | Mắt có màu LED |
| 🦿 Chân turbo | Streak 7 ngày | Rocket ở chân |
| 🔵 Lõi năng lượng | Level 5 | Ngực phát sáng |
| 🚀 Cánh bay | Tổng XP 300 | Cánh phía sau |
| 🏆 Huy chương vô địch | Hoàn thành 15 bài | Huy chương trên ngực |

**Đấu Trường (Arena):**
- Robo-X có thể "thi đấu" với các thử thách logic (puzzle mini).
- Mỗi chiến thắng → điểm xếp hạng cá nhân (không so sánh với người khác).

---

## 6. Boss Challenge Design (Thử Thách Chính)

*Đây là tính năng Phase 2, thiết kế để chuẩn bị sẵn.*

### 6.1 Concept

Mỗi cuối giai đoạn (Ôn tập / Chuẩn bị), bé đối mặt với 1 "Boss Challenge" — bài quiz tổng hợp 15 câu từ tất cả các môn đã học.

**Princess version:**
- Bé phải giúp Công Chúa giải mã phép thuật bằng cách trả lời đúng câu hỏi.
- Mỗi câu đúng → một mảnh của "phép thuật" được phục hồi.
- Hoàn thành: Lâu đài được cứu! 🏰✨

**Robot version:**
- Bé điều khiển Robo-X trong một nhiệm vụ đặc biệt.
- Mỗi câu đúng → Robo-X tiến thêm 1 bước về phía đích.
- Hoàn thành: Robo-X chiến thắng đấu trường! ⚙️🏆

### 6.2 Luật Boss Challenge

- Không có retry trong Boss Challenge (chỉ được làm 1 lần/ngày).
- Câu sai → vẫn tiếp tục (không bị "chặn").
- Hoàn thành ≥ 10/15 câu = Thắng Boss → Badge đặc biệt.
- Hoàn thành < 10/15 = "Lần sau sẽ tốt hơn!" → gợi ý ôn lại.

---

## 7. Mini-Game Ideas by Subject

*Đây là thiết kế cho Phase 2. MVP chỉ cần Quiz Engine.*

### 7.1 Toán học

**🍕 Pizza Phân Số (Princess)**
- Một chiếc bánh pizza xuất hiện.
- Bé kéo để chia bánh thành các phần bằng nhau.
- Mục tiêu: chia đúng theo phân số cho trước.

**⚙️ Máy Tính Robot (Robot)**
- Bàn phím số xuất hiện.
- Bé nhập kết quả tính nhẩm trực tiếp.
- Bonus nếu nhập nhanh trong 15 giây (không bắt buộc).

**🔢 Xếp Số (Cả 2)**
- Các ô số xuất hiện rải rác.
- Bé kéo thả để sắp xếp từ nhỏ đến lớn.

### 7.2 Tiếng Việt

**🎴 Ghép Từ (Princess)**
- Các thẻ chữ xuất hiện.
- Bé nối 2 thẻ thành từ ghép đúng.
- Hiệu ứng: thẻ đúng biến thành hoa.

**🔧 Sửa Robot (Robot)**
- Một câu có lỗi sai hiển thị.
- Bé bấm vào từ sai và chọn từ đúng.
- Robo-X "sửa chữa" mỗi khi đúng.

**🧩 Ô Chữ Đơn Giản (Cả 2)**
- Ô chữ 5×5.
- Định nghĩa gợi ý → bé tìm từ trong ô.

### 7.3 Tiếng Anh

**🎯 Bắn Bóng (Robot)**
- Bóng bay lên có từ tiếng Anh.
- Bé bấm vào bóng có nghĩa đúng với hình.

**🌸 Vườn Hoa (Princess)**
- Mỗi bông hoa = 1 từ.
- Bé nối từ với nghĩa tiếng Việt.

**🎧 Nghe và Chọn (Cả 2)**
- Phase 2: Text-to-speech đọc từ.
- Bé chọn từ nghe được.

---

## 8. Feedback Tone Guide

### 8.1 Princess Craft Kingdom — Phản hồi mẫu

**Đúng lần 1:**
- "✨ Xuất sắc! Nàng công chúa thật thông minh!"
- "🌸 Tuyệt vời! Viên đá quý đã sáng lên rồi!"
- "👑 Chính xác! Vương quốc tự hào về nàng!"

**Đúng lần 2 (sau 1 lần sai):**
- "🌸 Giỏi lắm! Nàng đã không bỏ cuộc!"
- "✨ Cố gắng thật đáng khen!"

**Sai (nhắc nhở lần 1):**
- "💭 Ồ, gần đúng rồi đó! Thử lại nhé~"
- "🌸 Đừng lo, nàng công chúa thử lại một lần nữa nhé!"
- "✨ Hmm... có vẻ phép thuật cần xem xét lại một chút!"

**Xem đáp án (sau 2 lần sai):**
- "💪 Không sao cả! Lần sau nàng sẽ nhớ thôi."
- "🌸 Đây là đáp án đúng để nàng ghi nhớ nhé!"

### 8.2 Robot Sport Lab — Phản hồi mẫu

**Đúng lần 1:**
- "⚙️ Phân tích chính xác! Module được nâng cấp!"
- "🤖 Robo-X ghi nhận: Câu trả lời ĐÚNG. Xuất sắc!"
- "🔵 Hệ thống xác nhận: Kỹ sư đã giải được bài toán!"

**Đúng lần 2:**
- "💪 Kiên trì đúng hướng! Kỹ sư không bỏ cuộc."
- "⚙️ Lần này đúng rồi. Hệ thống ghi nhận nỗ lực."

**Sai (nhắc nhở lần 1):**
- "🔍 Hệ thống phát hiện lỗi nhỏ. Kỹ sư thử kiểm tra lại?"
- "⚙️ Dữ liệu chưa khớp. Robo-X gợi ý: xem lại bước giải."
- "🤖 Gần đúng rồi! Thử phân tích lại nhé."

**Xem đáp án:**
- "📋 Robo-X công bố đáp án đúng để kỹ sư tham khảo."
- "💡 Ghi nhớ lần này nhé! Câu sai sẽ được luyện tập lại."
