"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AppTheme } from "@/lib/themes";

type ReadingEntryForCard = {
  id: string;
  studentId: string;
  readDate: string;
  bookTitle: string;
  pagesRead: number;
  summary: string;
  feelings: string;
  createdAt?: Date | string;
};

type ReadingLogCardProps = {
  studentId: string;
  existingEntry: ReadingEntryForCard | null;
  theme: AppTheme;
};

export function ReadingLogCard({ studentId, existingEntry, theme }: ReadingLogCardProps) {
  const router = useRouter();
  const [entry, setEntry] = useState(existingEntry);
  const [isEditing, setIsEditing] = useState(!existingEntry);
  const [bookTitle, setBookTitle] = useState(existingEntry?.bookTitle ?? "");
  const [pagesRead, setPagesRead] = useState(existingEntry?.pagesRead ? String(existingEntry.pagesRead) : "");
  const [summary, setSummary] = useState(existingEntry?.summary ?? "");
  const [feelings, setFeelings] = useState(existingEntry?.feelings ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  function startEdit() {
    setBookTitle(entry?.bookTitle ?? "");
    setPagesRead(entry?.pagesRead ? String(entry.pagesRead) : "");
    setSummary(entry?.summary ?? "");
    setFeelings(entry?.feelings ?? "");
    setMessage("");
    setIsEditing(true);
  }

  async function saveEntry() {
    if (!bookTitle.trim() || !summary.trim() || !feelings.trim()) {
      setMessage("Con điền tên sách, tóm tắt và cảm nhận nhé.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const response = await fetch("/api/reading/log", {
      method: entry ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId: entry?.id,
        studentId,
        bookTitle,
        pagesRead,
        summary,
        feelings,
      }),
    });

    const data = (await response.json().catch(() => null)) as { message?: string; entry?: ReadingEntryForCard } | null;

    if (!response.ok || !data?.entry) {
      setMessage(data?.message ?? "Chưa lưu được nhật ký. Mình thử lại sau nhé.");
      setIsSaving(false);
      return;
    }

    setEntry(data.entry);
    setBookTitle(data.entry.bookTitle);
    setPagesRead(data.entry.pagesRead ? String(data.entry.pagesRead) : "");
    setSummary(data.entry.summary);
    setFeelings(data.entry.feelings);
    setIsEditing(false);
    setIsSaving(false);
    router.refresh();
  }

  return (
    <div className="rounded-2xl p-5 shadow-md" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
      {isEditing ? (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_160px]">
            <label className="block">
              <span className="text-sm font-black text-slate-600">Tên sách / tên truyện</span>
              <input
                value={bookTitle}
                onChange={(event) => setBookTitle(event.target.value)}
                placeholder="Tên sách / tên truyện đã đọc hôm nay"
                className="mt-2 h-12 w-full rounded-2xl border-2 border-slate-200 px-4 font-bold text-slate-900 outline-none focus:border-[var(--sq-primary)]"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-600">Số trang</span>
              <input
                type="number"
                min="0"
                value={pagesRead}
                onChange={(event) => setPagesRead(event.target.value)}
                placeholder="0"
                className="mt-2 h-12 w-full rounded-2xl border-2 border-slate-200 px-4 font-bold text-slate-900 outline-none focus:border-[var(--sq-primary)]"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-black text-slate-600">Mình đã đọc</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Hôm nay mình đọc về..."
              className="mt-2 min-h-24 w-full rounded-2xl border-2 border-slate-200 p-3 font-semibold text-slate-900 outline-none focus:border-[var(--sq-primary)]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-600">Cảm nhận của mình</span>
            <textarea
              value={feelings}
              onChange={(event) => setFeelings(event.target.value)}
              placeholder="Mình thấy câu chuyện này... vì..."
              className="mt-2 min-h-24 w-full rounded-2xl border-2 border-slate-200 p-3 font-semibold text-slate-900 outline-none focus:border-[var(--sq-primary)]"
            />
          </label>

          {message ? <p className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">{message}</p> : null}

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void saveEntry()}
            className="h-11 rounded-2xl px-4 font-black text-white disabled:opacity-60"
            style={{ backgroundColor: theme.palette.primary }}
          >
            {isSaving ? "Đang lưu..." : entry ? "Lưu chỉnh sửa" : "📖 Lưu buổi đọc hôm nay"}
          </button>
        </div>
      ) : entry ? (
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-black uppercase" style={{ color: theme.palette.accent }}>
                Đã đọc hôm nay
              </div>
              <h3 className="mt-1 text-2xl font-black">{entry.bookTitle}</h3>
              {entry.pagesRead > 0 ? <p className="mt-1 text-sm font-bold text-slate-500">{entry.pagesRead} trang</p> : null}
            </div>
            <button type="button" onClick={startEdit} className="h-10 rounded-2xl px-4 text-sm font-black text-white" style={{ backgroundColor: theme.palette.accent }}>
              ✏️ Chỉnh sửa
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl p-4" style={{ backgroundColor: theme.palette.primarySoft, color: theme.palette.text }}>
              <div className="text-sm font-black">Mình đã đọc</div>
              <p className="mt-2 text-sm font-semibold leading-6">{entry.summary}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: theme.palette.accentSoft, color: theme.palette.text }}>
              <div className="text-sm font-black">Cảm nhận của mình</div>
              <p className="mt-2 text-sm font-semibold leading-6">{entry.feelings}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
