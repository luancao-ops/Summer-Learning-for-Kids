"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ResetDataCounts = {
  attempts: number;
  mistakes: number;
  choreAssignments: number;
  readingEntries: number;
  studentBadges: number;
  studentRewards: number;
};

type ResetResult = {
  ok: true;
  deleted: ResetDataCounts;
  resetAccessCodes: boolean;
};

type ParentResetDataPanelProps = {
  counts: ResetDataCounts;
};

export function ParentResetDataPanel({ counts }: ParentResetDataPanelProps) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [resetAccessCodes, setResetAccessCodes] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState<ResetResult | null>(null);
  const [error, setError] = useState("");

  const canReset = confirmation.trim().toUpperCase() === "RESET";
  const totalRecords =
    counts.attempts +
    counts.mistakes +
    counts.choreAssignments +
    counts.readingEntries +
    counts.studentBadges +
    counts.studentRewards;

  async function resetData() {
    if (!canReset) return;

    setIsResetting(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/parent/reset-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: "RESET", resetAccessCodes }),
    });

    const data = (await response.json().catch(() => null)) as ResetResult | { ok: false; message?: string } | null;

    setIsResetting(false);

    if (!response.ok || !data?.ok) {
      setError(data && "message" in data && data.message ? data.message : "Chưa reset được dữ liệu. Thử lại sau một chút nhé.");
      return;
    }

    setResult(data);
    setConfirmation("");
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-black uppercase text-rose-700">Release cleanup</div>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Reset dữ liệu test</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            Dọn dữ liệu học thử trước khi giao app chính thức cho bé. App sẽ giữ lại học sinh, bài học, câu hỏi,
            theme, huy hiệu/phần thưởng gốc và mẫu việc nhà.
          </p>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-black text-rose-700">
          {totalRecords} bản ghi test
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <StatPill label="Lần làm bài" value={counts.attempts} />
        <StatPill label="Câu sai" value={counts.mistakes} />
        <StatPill label="Việc nhà đã giao" value={counts.choreAssignments} />
        <StatPill label="Nhật ký đọc sách" value={counts.readingEntries} />
        <StatPill label="Huy hiệu đã nhận" value={counts.studentBadges} />
        <StatPill label="Phần thưởng đã mở" value={counts.studentRewards} />
      </div>

      <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
        Sau khi reset: XP, xu, streak và reading streak của cả hai bé về 0. Bước này không thể hoàn tác bằng UI.
      </div>

      {result ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-900">
          Đã reset dữ liệu test. Dashboard đã sẵn sàng cho bản chính thức.
        </p>
      ) : null}
      {error ? <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-900">{error}</p> : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <label htmlFor="reset-confirmation" className="block text-sm font-black text-slate-700">
            Gõ RESET để xác nhận
          </label>
          <input
            id="reset-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 font-black text-slate-950 outline-none transition focus:border-rose-300"
            placeholder="RESET"
          />
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              checked={resetAccessCodes}
              onChange={(event) => setResetAccessCodes(event.target.checked)}
              className="h-4 w-4 accent-rose-600"
            />
            Tắt luôn mã vào hồ sơ của bé
          </label>
        </div>
        <button
          type="button"
          onClick={() => void resetData()}
          disabled={!canReset || isResetting}
          className="h-12 self-end rounded-2xl bg-gradient-to-r from-rose-700 to-orange-600 px-5 font-black text-white shadow-lg shadow-rose-100 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResetting ? "Đang reset..." : "Reset dữ liệu test"}
        </button>
      </div>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-xl font-black text-slate-950">{value}</div>
      <div className="text-xs font-bold text-slate-500">{label}</div>
    </div>
  );
}
