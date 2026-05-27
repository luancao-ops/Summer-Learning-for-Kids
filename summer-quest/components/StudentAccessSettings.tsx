"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type StudentAccessSettingsProps = {
  students: {
    id: string;
    displayName: string;
    hasAccessCode: boolean;
  }[];
};

type PendingAction = {
  studentId: string;
  action: "set" | "clear";
} | null;

export function StudentAccessSettings({ students }: StudentAccessSettingsProps) {
  const router = useRouter();
  const [accessCodes, setAccessCodes] = useState<Record<string, string>>({});
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitSetCode(event: FormEvent<HTMLFormElement>, studentId: string, displayName: string) {
    event.preventDefault();
    const accessCode = accessCodes[studentId]?.trim() ?? "";

    setMessage("");
    setError("");
    setPendingAction({ studentId, action: "set" });

    const response = await fetch("/api/parent/student-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, action: "set", accessCode }),
    });

    setPendingAction(null);

    if (!response.ok) {
      setError("Mã cần có ít nhất 4 ký tự. Mình đặt lại giúp bé nhé.");
      return;
    }

    setAccessCodes((current) => ({ ...current, [studentId]: "" }));
    setMessage(`Đã bật mã vào hồ sơ cho ${displayName}.`);
    router.refresh();
  }

  async function clearCode(studentId: string, displayName: string) {
    setMessage("");
    setError("");
    setPendingAction({ studentId, action: "clear" });

    const response = await fetch("/api/parent/student-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, action: "clear" }),
    });

    setPendingAction(null);

    if (!response.ok) {
      setError("Chưa tắt được mã. Thử lại sau một chút nhé.");
      return;
    }

    setMessage(`Đã tắt mã vào hồ sơ cho ${displayName}.`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {message ? <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-900">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-900">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {students.map((student) => {
          const isSetting = pendingAction?.studentId === student.id && pendingAction.action === "set";
          const isClearing = pendingAction?.studentId === student.id && pendingAction.action === "clear";
          const accessCode = accessCodes[student.id] ?? "";

          return (
            <article key={student.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">{student.displayName}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {student.hasAccessCode ? "Đang bật mã riêng cho hồ sơ này." : "Chưa bật mã, bé có thể vào trực tiếp."}
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-black"
                  style={{
                    backgroundColor: student.hasAccessCode ? "#dcfce7" : "#f1f5f9",
                    color: student.hasAccessCode ? "#166534" : "#475569",
                  }}
                >
                  {student.hasAccessCode ? "Đã khóa" : "Mở"}
                </span>
              </div>

              <form onSubmit={(event) => void submitSetCode(event, student.id, student.displayName)} className="mt-4 space-y-3">
                <input
                  type="password"
                  value={accessCode}
                  onChange={(event) => setAccessCodes((current) => ({ ...current, [student.id]: event.target.value }))}
                  minLength={4}
                  maxLength={24}
                  className="h-11 w-full rounded-2xl border border-slate-200 px-4 font-bold text-slate-950 outline-none transition focus:border-indigo-400"
                  placeholder="Mã mới, ví dụ 1234"
                  autoComplete="new-password"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={isSetting || accessCode.trim().length < 4}
                    className="h-11 rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 px-4 text-sm font-black text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSetting ? "Đang lưu..." : student.hasAccessCode ? "Đổi mã" : "Bật mã"}
                  </button>
                  {student.hasAccessCode ? (
                    <button
                      type="button"
                      onClick={() => void clearCode(student.id, student.displayName)}
                      disabled={isClearing}
                      className="h-11 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isClearing ? "Đang tắt..." : "Tắt mã"}
                    </button>
                  ) : null}
                </div>
              </form>
            </article>
          );
        })}
      </div>
    </div>
  );
}
