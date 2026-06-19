# Summer Quest

Ứng dụng học hè **local-first** cho 2 bé người Việt — Yumi (Lớp 4→5) và Johnny (Lớp 3→4).  
Chạy trên máy gia đình, không cần internet, không cần tài khoản.

---

## Khởi động nhanh

Double-click `Start Summer Quest.cmd` ở thư mục gốc. Lần đầu chạy sẽ build (~1 phút).  
Mở **http://localhost:3000** hoặc từ điện thoại/máy tính bảng trong cùng mạng: **http://192.168.0.7:3000**

---

## Tech Stack

| Layer | Công nghệ | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.6 |
| UI | React | 19.2.4 |
| Language | TypeScript strict | ~5 |
| Styling | Tailwind CSS v4 | ^4 |
| Database | Prisma + SQLite | 6.19.3 |

---

## Tài liệu

| File | Nội dung |
|---|---|
| [`docs/PROJECT.md`](docs/PROJECT.md) | Vision, hồ sơ 2 bé, game design, curriculum plan |
| [`docs/TECHNICAL.md`](docs/TECHNICAL.md) | Tech stack, cấu trúc file, schema DB, coding rules, setup |
| [`docs/AGENTS.md`](docs/AGENTS.md) | Workflow AI, PM briefs, content generation prompts |
| [`docs/BACKLOG.md`](docs/BACKLOG.md) | Tickets hiện tại |
| [`docs/INCIDENTS.md`](docs/INCIDENTS.md) | Lịch sử bugs + root cause — đọc trước khi sửa quiz/buttons |
| [`docs/UX_FLOW.md`](docs/UX_FLOW.md) | User flows |
| [`AGENTS.md`](AGENTS.md) | Coding rules cho tất cả AI agents (Codex đọc file này) |
| [`CLAUDE.md`](CLAUDE.md) | PM rules cho Claude Code |

---

## Scripts (từ thư mục `summer-quest/`)

```powershell
npm.cmd run dev:local        # Dev mode, localhost only (Claude/Codex — không dùng cho gia đình)
npm.cmd run build            # Production build
npm.cmd run start:lan        # Production server, LAN accessible (gia đình dùng)
npm.cmd run lint
npm.cmd run test
npm.cmd run prisma:migrate
npm.cmd run prisma:seed      # CẢNH BÁO: xóa và tạo lại dữ liệu
npm.cmd run prisma:studio    # Prisma Studio tại localhost:5555
npm.cmd run content:import   # Import bài học từ manifests/
```

---

## MVP Flow

1. Chọn học sinh tại `/`
2. Dashboard cá nhân: nhiệm vụ hôm nay, việc nhà, đọc sách, môn học
3. Vào môn → chọn bài → đọc bài học → làm quiz
4. Kết quả: XP + xu + badge tự động trao
5. Ôn câu sai tại `/student/[id]/review`
6. Phụ huynh xem tổng quan tại `/parent`

---

## Quy tắc không thay đổi

- `distDir: ".next-build8"` trong `next.config.ts` — **không đổi lại `.next` đến `.next-build7`**
- Tất cả query bài học học sinh **phải có** `where: { approved: true }`
- Launcher (`Start Summer Quest.cmd`) dùng `next start` — **không dùng `next dev`**
- White card: `style={{ backgroundColor: "#ffffff" }}` — không dùng `bg-white`
- Ngày tháng: `"YYYY-MM-DD"` string — không dùng `DateTime`
- Xóa Lesson: dùng `$transaction` xóa Mistake + Attempt trước

Chi tiết đầy đủ: [`docs/TECHNICAL.md`](docs/TECHNICAL.md) và [`docs/INCIDENTS.md`](docs/INCIDENTS.md).
