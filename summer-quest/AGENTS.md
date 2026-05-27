# Summer Quest — Agent Rules

Đây là file quy tắc cho **tất cả AI agents** làm việc trong project này.  
Claude Code đọc file này qua `CLAUDE.md`. Codex đọc trực tiếp.

---

## 1. Project Context

**Summer Quest** là ứng dụng học hè local-first cho 2 bé người Việt:
- **Bé gái** — hoàn thành Lớp 4, chuẩn bị Lớp 5 — Theme: Princess Craft Kingdom 👑
- **Bé trai** — hoàn thành Lớp 3, chuẩn bị Lớp 4 — Theme: Robot Sport Lab 🤖

App chạy trên máy gia đình, SQLite local, không cần internet hay tài khoản.  
Tài liệu đầy đủ: [`docs/`](docs/) — đặc biệt [`docs/BACKLOG.md`](docs/BACKLOG.md) và [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md).

---

## 2. Team Roles

### Claude Code — Product Manager (PM)
- Nhận yêu cầu từ phụ huynh (Product Owner)
- Phân tích yêu cầu, thiết kế giải pháp
- Viết tickets vào `docs/BACKLOG.md` (đầy đủ: mô tả, code mẫu, acceptance criteria)
- Cập nhật `docs/DATA_MODEL.md`, `docs/ROADMAP.md` khi có thay đổi schema/roadmap
- Giao việc cho Codex dưới dạng **PM Brief** (xem Section 5)
- Verify deliverable sau khi Codex hoàn thành: đọc file, smoke-test routes, check DB
- Phát hiện bug, đề xuất sprint tiếp theo

### Codex — Developer (Dev)
- Đọc tickets trong `docs/BACKLOG.md` trước khi bắt đầu
- Implement đúng theo acceptance criteria
- Chạy `npm run build` sau mỗi task — không giao việc khi build lỗi
- Báo cáo kết quả theo format **PM Brief** (xem Section 6)
- Hỏi PM nếu ticket không rõ ràng thay vì tự đoán

### Phụ huynh — Product Owner
- Đặt yêu cầu tính năng mới
- Dùng app thực tế và phản hồi
- Duyệt/từ chối nội dung AI tại `/parent/review`

---

## 3. Quy tắc kỹ thuật bắt buộc

### 3.1 Framework — Đọc docs trước khi code
> Next.js version này có breaking changes so với training data.  
> Đọc `node_modules/next/dist/docs/` trước khi viết bất kỳ code nào liên quan đến routing, params, hay API.

- `params` trong App Router là **Promise** — phải `await params`
- API routes dùng `export async function GET/POST(request: Request)`
- Server Components mặc định — thêm `"use client"` chỉ khi cần state/effect

### 3.2 Tailwind CSS v4
- Import: `@import "tailwindcss"` — **không** dùng `@tailwind base/components/utilities`
- Màu sắc themed dùng CSS custom properties (`--sq-primary`, v.v.) — không hardcode

### 3.3 Database — Prisma
- **Tất cả query bài học phía học sinh PHẢI có:** `where: { approved: true }` — đây là safety gate, không bao giờ bỏ
- Mọi thao tác ghi nhiều bảng cùng lúc: dùng `prisma.$transaction`
- Ngày tháng lưu dạng `"YYYY-MM-DD"` string — không dùng `DateTime` cho date-only fields
- Tạo date string: `new Date().toLocaleDateString("sv")` (Swedish locale → YYYY-MM-DD, không lỗi timezone)

### 3.4 TypeScript
- Strict mode — không dùng `any`
- Mọi props phải có type rõ ràng
- Dùng `as const` cho union type literals

### 3.5 CSS và Contrast
- White card trên themed background: **bắt buộc** dùng `style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}` — **không** dùng `bg-white` (bị Chrome forced dark mode invert)
- Tương tự: `bg-slate-50` → `style={{ backgroundColor: "#f8fafc" }}`
- `color-scheme: light` đã có trong `:root` của `globals.css` — không xoá
- Text body trong card: `#1e293b` hoặc `#334155` — không dùng theme purple cho body text

### 3.6 Theme System
- Theme ID: `"princess_craft_kingdom"` | `"robot_sport_lab"` — lưu trong `Student.themeId`
- Resolve theme: `getTheme(student.themeId)` từ `lib/themes.ts`
- Set CSS vars: `style={themeStyle(theme)}` trên `.page-shell`
- Decoration layer: `<div className="deco-layer">` với `theme.decorations.map()`
- Content wrapper: `<div className="page-content">` — luôn đặt trên deco-layer (z-index)

### 3.7 API Routes
- Validate input trước khi query DB
- Trả về `NextResponse.json({ ok: false, message: "..." }, { status: 4xx })` khi lỗi
- Không bao giờ expose stack trace hoặc Prisma error raw ra client
- Dùng `export const dynamic = "force-dynamic"` cho parent pages (không cache)

---

## 4. Cấu trúc file quan trọng

```
docs/BACKLOG.md          ← PM viết ticket vào đây, Dev đọc từ đây
docs/DATA_MODEL.md       ← Source of truth cho schema + data flow
prisma/schema.prisma     ← Source of truth cho database
lib/themes.ts            ← Theme system — không hardcode màu ngoài file này
app/globals.css          ← CSS utilities — card-hero, deco-layer, page-shell, page-content
```

---

## 5. PM Brief (Claude Code gửi cho Codex)

Khi giao việc cho Codex, Claude Code phải viết đầy đủ:

```markdown
## Codex Sprint [N] — [Tên sprint]

### Task [N] — [Tên task] ([ước lượng thời gian])
**File cần sửa/tạo:** `path/to/file.tsx`

[Mô tả cụ thể: cần làm gì, tại sao, pattern nào dùng]

[Code mẫu nếu cần — đặc biệt cho schema, API body, component props]

**Acceptance criteria:**
- [ ] Mô tả hành vi cụ thể có thể test được
- [ ] `npm run build` không lỗi
```

**Nguyên tắc viết ticket:**
- Mỗi task có file path cụ thể — không nói chung chung "tạo component mới"
- Code mẫu cho schema changes, API contracts, và component props
- Acceptance criteria là hành vi observable, không phải "code trông có vẻ đúng"
- Thứ tự thực hiện rõ ràng khi có dependencies (ticket A trước ticket B)

---

## 6. PM Brief (Codex báo cáo lại cho Claude Code)

Sau mỗi sprint, Codex gửi báo cáo theo format:

```markdown
## PM Brief — Sprint [N]
**Status:** Complete | Partial | Blocked

**Delivered:**
- TICKET-XXX: [tên] — [ghi chú ngắn nếu có deviation]

**Verification:** [cách đã verify: build pass, route check, DB count, v.v.]

**Risks/Notes:**
- [Bug phát hiện, deviation từ spec, quyết định kỹ thuật quan trọng]

**Suggested next step:** [ticket nào nên làm tiếp]
```

---

## 7. Workflow phối hợp

```
Phụ huynh đặt yêu cầu
       ↓
Claude Code (PM) phân tích
  → Cập nhật docs/BACKLOG.md (tickets mới)
  → Cập nhật docs/DATA_MODEL.md (nếu có schema mới)
  → Cập nhật docs/ROADMAP.md (nếu có milestone mới)
  → Viết PM Brief giao Codex
       ↓
Codex (Dev) implement
  → Đọc BACKLOG.md + DATA_MODEL.md
  → Code → test → npm run build
  → Báo cáo PM Brief
       ↓
Claude Code (PM) verify
  → Đọc file đã thay đổi
  → Smoke-test routes (http://localhost:3000)
  → Kiểm tra DB counts
  → Viết PM Brief sprint tiếp theo
```

---

## 8. Quy tắc nội dung (Content Rules)

- Nội dung bài học: tiếng Việt, ngôn ngữ thân thiện với trẻ 8–10 tuổi
- **Không** sao chép từ sách giáo khoa — dùng ví dụ gốc, ngữ cảnh đời thực
- Câu hỏi quiz: không có đáp án "brutal" — luôn có explanation
- Feedback đúng/sai phải theo theme (Princess vs Robot language) — dùng `theme.feedback`
- Bài học mới từ AI: `approved: false` mặc định — phụ huynh phải duyệt trước khi bé thấy

---

## 9. Checklist trước khi merge/giao việc

**Codex phải check trước khi báo cáo done:**
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — no new warnings
- [ ] Tất cả student queries có `approved: true`
- [ ] Multi-write DB operations dùng `$transaction`
- [ ] Không có `any` type mới
- [ ] White cards dùng inline style, không dùng `bg-white`

**Claude Code phải check sau khi nhận PM Brief:**
- [ ] Đọc file thay đổi — không chỉ tin báo cáo
- [ ] Smoke-test ít nhất 5 routes: `/`, `/student/girl`, `/student/boy`, `/parent`, route mới
- [ ] Kiểm tra DB counts nếu có migration/seed
- [ ] Phát hiện bug → thêm vào BACKLOG.md trước khi giao sprint mới
