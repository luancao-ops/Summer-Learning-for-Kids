# Summer Quest 🌟

Ứng dụng học hè **local-first** cho 2 bé người Việt — bé gái (Lớp 4 → 5) và bé trai (Lớp 3 → 4).  
Chạy trên máy gia đình, không cần internet, không cần tài khoản.

---

## Mục tiêu sản phẩm

| | |
|---|---|
| **Đối tượng** | 2 bé tiểu học, 8–10 tuổi |
| **Thời gian** | 2 tháng hè (8 tuần) |
| **Học tập** | Ôn tập lớp cũ + chuẩn bị lớp mới (Toán, Tiếng Việt, Tiếng Anh) |
| **Thói quen** | Việc nhà + đọc sách + học bài — gamified, trong một app |
| **Triết lý** | Không áp lực thời gian, không xếp hạng, khuyến khích bằng XP + badge |

---

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js App Router, Server Components |
| Language | TypeScript strict mode — không dùng `any` |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, không dùng `@tailwind`) |
| Database | Prisma + SQLite (local-first, file `prisma/dev.db`) |
| Testing | Vitest |

---

## Chạy project

```bash
npm install
copy .env.example .env        # Windows
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

If your terminal is at `D:\Project Learning For Kids`, run the same commands there.
The root `package.json` delegates scripts into `summer-quest`.
You can also double-click `D:\Project Learning For Kids\start-dev.ps1` to start the app.
Dev mode uses Next.js Webpack mode because Turbopack was hanging on dynamic routes on this Windows setup.

Mở **http://localhost:3000** hoặc **http://127.0.0.1:3000**

## Scripts

```bash
npm run dev              # dev server (hot reload)
npm run build            # production build — luôn chạy trước khi merge
npm run lint             # ESLint
npm run test             # Vitest
npm run prisma:migrate   # chạy migration
npm run prisma:seed      # seed dữ liệu mẫu
npm run prisma:studio    # Prisma Studio UI
```

---

## Cấu trúc thư mục

```
summer-quest/
├── app/
│   ├── page.tsx                      # Trang chọn học sinh (home)
│   ├── api/
│   │   ├── quiz/submit/              # POST — nộp bài quiz
│   │   ├── chores/complete/          # POST — báo cáo việc nhà
│   │   ├── reading/log/              # POST / PUT — nhật ký đọc sách
│   │   ├── mistakes/resolve/         # POST — đánh dấu đã ôn xong
│   │   └── parent/
│   │       ├── approve/              # POST — duyệt/từ chối bài học
│   │       └── chores/assign/        # POST / DELETE — giao việc nhà
│   ├── parent/
│   │   ├── page.tsx                  # Dashboard phụ huynh
│   │   ├── review/page.tsx           # Duyệt nội dung AI
│   │   └── chores/page.tsx           # Giao việc nhà hàng ngày
│   └── student/[studentId]/
│       ├── page.tsx                  # Dashboard học sinh
│       ├── subject/[subject]/        # Danh sách bài theo môn
│       ├── lesson/[lessonId]/        # Xem bài học
│       │   └── quiz/                 # Làm quiz
│       └── review/                   # Ôn câu sai
├── components/                       # React components
├── lib/                              # Shared logic (quiz, themes, progress...)
├── prisma/
│   ├── schema.prisma                 # ← Source of truth cho database
│   └── seed.ts
├── docs/                             # Tài liệu sản phẩm
│   ├── PRD.md                        # Product Requirements Document
│   ├── ROADMAP.md                    # Lộ trình + milestones
│   ├── BACKLOG.md                    # ← Tickets, priority, acceptance criteria
│   ├── DATA_MODEL.md                 # Schema design + data flows
│   ├── CONTENT_MODEL.md              # Cấu trúc nội dung bài học
│   ├── UX_FLOW.md                    # User flows
│   ├── GAME_DESIGN.md                # Thiết kế gamification
│   └── AI_WORKFLOW.md                # Quy trình sinh nội dung AI
├── AGENTS.md                         # Quy tắc cho tất cả AI agents (Codex đọc file này)
└── CLAUDE.md                         # Import AGENTS.md + quy tắc PM cho Claude Code
```

---

## Team & Workflow

| Role | Tool | Làm gì |
|---|---|---|
| **Product Manager** | Claude Code | Nhận yêu cầu từ phụ huynh → phân tích → viết ticket vào `docs/BACKLOG.md` → giao Codex → verify → PM Brief |
| **Developer** | Codex | Đọc ticket trong `BACKLOG.md` → implement → `npm run build` → báo cáo PM Brief |
| **Product Owner** | Phụ huynh | Đặt yêu cầu, dùng app, review + approve nội dung AI tại `/parent/review` |

**Quy tắc phối hợp đầy đủ:** xem [`AGENTS.md`](AGENTS.md)

---

## MVP Flow (hiện tại)

1. Chọn học sinh tại `/`
2. Dashboard cá nhân: nhiệm vụ hôm nay, việc nhà, đọc sách, môn học
3. Vào môn → chọn bài → đọc bài học → làm quiz
4. Kết quả: XP + xu + badge tự động trao
5. Ôn câu sai tại `/student/[id]/review`
6. Phụ huynh xem tổng quan tại `/parent`

## Quy tắc không thay đổi

- Tất cả query bài học của học sinh **phải có** `where: { approved: true }`
- White card trên themed background **phải dùng** `style={{ backgroundColor: "#ffffff" }}` — không dùng `bg-white` (bị forced dark mode invert)
- Ngày tháng lưu dưới dạng `"YYYY-MM-DD"` string — không dùng `DateTime` cho date-only fields
- `prisma.$transaction` cho mọi thao tác ghi nhiều bảng cùng lúc
