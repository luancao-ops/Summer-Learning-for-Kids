# Codex Sprint 5 — Chore Checklist UX Fix

**Date:** 2026-05-27  
**PM:** Claude Code  
**Đọc trước:** `docs/BACKLOG.md` TICKET-049 · `components/ChoreChecklist.tsx` · `app/student/[studentId]/page.tsx`

---

## Background

Sprint 4 đã build Habits Module hoạt động đúng về mặt kỹ thuật. Tuy nhiên ba mẹ (Product Owner) phản hồi rằng **phần công việc nhà chưa đúng với yêu cầu gốc**.

Yêu cầu gốc: *"2 bé sẽ tự kiểm tra list việc… **có check list cho từng công việc**"*

Implementation hiện tại dùng nút "📝 Báo cáo" — UX kiểu form báo cáo.  
Ba mẹ muốn UX kiểu **checklist thật sự**: bé thấy ô trống ⬜ bên cạnh mỗi việc, tích vào khi làm xong.

Spec gốc trong TICKET-044 cũng ghi: *"Trạng thái: ⬜ chưa làm / ✅ đã xong"* — phần ⬜ chưa được implement.

**Không thay đổi bất kỳ API hoặc DB schema nào.** Chỉ redesign visual layer của component.

---

## Task 1 — Redesign ChoreChecklist sang checkbox UX (30–45 phút)

**File cần sửa:** `components/ChoreChecklist.tsx`

### Thay đổi layout

Layout cũ:
```
[Icon + Tên việc]              [nút 📝 Báo cáo]
Mô tả gợi ý cách làm
```

Layout mới:
```
[⬜ circle]  [Icon + Tên việc]
             Mô tả gợi ý cách làm
```

Khi click circle (hoặc tên việc) → form mở ra bên dưới:
```
[● circle đang mở]  [Icon + Tên việc]
                    Mô tả gợi ý cách làm

                    ┌─ Mình làm thế nào? ──────────────┐
                    │ [🌟 Làm tốt lắm] [👍 Được rồi]   │
                    │ [🔄 Chưa xong hẳn]                │
                    │                                    │
                    │ Kể cho mẹ nghe mình đã làm...      │
                    │                                    │
                    │ [Lưu]                              │
                    └────────────────────────────────────┘
```

Sau khi lưu xong:
```
[✓ filled]  [Icon + Tên việc] ~~gạch ngang~~    [badge 🌟 Làm tốt lắm]
             "Mình rửa hết bát rồi, xếp vào kệ gọn lắm ạ"
```

### Code cho checkbox custom

```tsx
{/* === CHECKBOX COLUMN === */}
{assignment.completion ? (
  // DONE: filled circle
  <div
    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
    style={{ backgroundColor: theme.palette.primary }}
  >
    <span className="text-sm font-black text-white">✓</span>
  </div>
) : (
  // TODO: empty circle, clickable
  <button
    type="button"
    onClick={() => setOpenId(openId === assignment.id ? null : assignment.id)}
    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 active:scale-95"
    style={{ borderColor: theme.palette.primary, backgroundColor: openId === assignment.id ? theme.palette.primarySoft : "transparent" }}
    aria-label={`Đánh dấu hoàn thành: ${assignment.chore.name}`}
  />
)}
```

### Cấu trúc article mới

```tsx
<article key={assignment.id} className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
  <div className="flex items-start gap-3">

    {/* --- CHECKBOX --- */}
    {/* code bên trên */}

    {/* --- CONTENT --- */}
    <div className="min-w-0 flex-1">
      {/* Header: tên + badge khi done */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div
          className="text-lg font-black leading-snug"
          style={{
            textDecoration: assignment.completion ? "line-through" : "none",
            opacity: assignment.completion ? 0.55 : 1,
          }}
        >
          {assignment.chore.icon} {assignment.chore.name}
        </div>
        {assignment.completion && (
          <span
            className="rounded-full px-3 py-1 text-xs font-black text-white"
            style={{ backgroundColor: reward?.color ?? theme.palette.primary }}
          >
            {reward?.label ?? "Đã xong"}
          </span>
        )}
      </div>

      {/* Chore hint description */}
      <p className="mt-1 text-sm font-semibold text-slate-500">{assignment.chore.description}</p>

      {/* Done: kid's description */}
      {assignment.completion && (
        <p
          className="mt-2 rounded-xl p-3 text-sm font-semibold leading-6"
          style={{ backgroundColor: theme.palette.primarySoft, color: theme.palette.text }}
        >
          {assignment.completion.description}
        </p>
      )}

      {/* Inline form — chỉ hiện khi openId === id VÀ chưa hoàn thành */}
      {openId === assignment.id && !assignment.completion ? (
        <div className="mt-3 rounded-2xl p-4" style={{ backgroundColor: theme.palette.accentSoft }}>
          {/* Level buttons — giữ nguyên code cũ */}
          <p className="mb-2 text-sm font-black">Mình làm thế nào?</p>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setLevelById((current) => ({ ...current, [assignment.id]: level.id }))}
                className="rounded-2xl px-3 py-2 text-sm font-black"
                style={{
                  backgroundColor: currentLevel === level.id ? theme.palette.primary : "#ffffff",
                  color: currentLevel === level.id ? "#ffffff" : "#1e1b4b",
                }}
              >
                {level.label}
              </button>
            ))}
          </div>
          {/* Textarea — giữ nguyên */}
          <textarea
            value={descriptionById[assignment.id] ?? ""}
            onChange={(event) => setDescriptionById((current) => ({ ...current, [assignment.id]: event.target.value }))}
            placeholder="Kể cho mẹ nghe mình đã làm thế nào..."
            className="mt-3 min-h-24 w-full rounded-2xl border-2 border-slate-200 p-3 font-semibold text-slate-900 outline-none focus:border-[var(--sq-primary)]"
          />
          {/* Lưu button — giữ nguyên */}
          <button
            type="button"
            disabled={savingId === assignment.id}
            onClick={() => void completeAssignment(assignment.id)}
            className="mt-3 h-10 rounded-2xl px-4 text-sm font-black text-white disabled:opacity-60"
            style={{ backgroundColor: theme.palette.accent }}
          >
            {savingId === assignment.id ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      ) : null}
    </div>
  </div>
</article>
```

### Xoá

Xoá hoàn toàn nút này (không còn dùng nữa):
```tsx
// XOÁ ĐOẠN NÀY:
<button
  type="button"
  onClick={() => setOpenId(openId === assignment.id ? null : assignment.id)}
  className="h-10 rounded-2xl px-4 text-sm font-black text-white shadow-sm"
  style={{ backgroundColor: theme.palette.primary }}
>
  📝 Báo cáo
</button>
```

### Giữ nguyên hoàn toàn

- Tất cả `useState` hooks
- `completeAssignment()` function và fetch logic
- Error message `<p className="rounded-2xl bg-rose-50 ...">` ở đầu list
- `router.refresh()` sau save
- `levels` array constant

**Acceptance criteria:**
- [ ] Task chưa làm: thấy circle trống (border màu theme) bên trái, KHÔNG còn nút "Báo cáo"
- [ ] Click circle hoặc tên task → form mở inline bên dưới
- [ ] Task đã làm: circle filled ✓ + tên gạch ngang nhẹ + level badge + description của bé
- [ ] Mobile-safe: circle là `h-8 w-8` = 32px (đủ touch target)
- [ ] `npm run build` không lỗi

---

## Task 2 — Progress counter trên dashboard (10 phút)

**File cần sửa:** `app/student/[studentId]/page.tsx`

Thêm progress pill "X/Y việc" vào section header công việc nhà:

```tsx
// TÌM ĐOẠN NÀY (khoảng line 138–143):
{choreAssignments.length > 0 ? (
  <section>
    <h2 className="mb-4 text-2xl font-black">🏠 Công việc nhà hôm nay</h2>
    <ChoreChecklist studentId={student.id} assignments={choreAssignments} theme={theme} />
  </section>
) : null}

// SỬA THÀNH:
{choreAssignments.length > 0 ? (
  <section>
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-2xl font-black">🏠 Công việc nhà hôm nay</h2>
      {(() => {
        const done = choreAssignments.filter((a) => a.completion).length;
        const total = choreAssignments.length;
        return (
          <span
            className="rounded-full px-3 py-1 text-sm font-black text-white"
            style={{ backgroundColor: done === total ? "#047857" : "#64748b" }}
          >
            {done}/{total} việc
          </span>
        );
      })()}
    </div>
    <ChoreChecklist studentId={student.id} assignments={choreAssignments} theme={theme} />
  </section>
) : null}
```

**Acceptance criteria:**
- [ ] Dashboard hiện "0/3 việc" (xám) khi chưa làm gì
- [ ] Hiện "3/3 việc" (xanh lá `#047857`) khi làm hết
- [ ] Counter cập nhật sau `router.refresh()` (khi bé save task)

---

## Checklist trước khi báo cáo done

- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — no new warnings  
- [ ] Không thay đổi API routes hoặc DB schema
- [ ] Không có `any` type mới
- [ ] White cards dùng inline style (đã có sẵn, không được đổi sang `bg-white`)
