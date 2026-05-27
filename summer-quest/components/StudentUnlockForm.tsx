"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type StudentUnlockFormProps = {
  studentId: string;
  displayName: string;
  accentColor: string;
  primaryColor: string;
};

export function StudentUnlockForm({
  studentId,
  displayName,
  accentColor,
  primaryColor,
}: StudentUnlockFormProps) {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/student/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, accessCode }),
    });

    if (!response.ok) {
      setError("Mã chưa đúng rồi. Con thử hỏi ba mẹ hoặc nhập lại nhẹ nhàng nha.");
      setIsSubmitting(false);
      return;
    }

    router.push(`/student/${studentId}`);
    router.refresh();
  }

  return (
    <form onSubmit={submitUnlock} className="mt-5 space-y-4">
      <div>
        <label htmlFor="student-access-code" className="text-sm font-black" style={{ color: primaryColor }}>
          Mã vào hồ sơ của {displayName}
        </label>
        <input
          id="student-access-code"
          type="password"
          value={accessCode}
          onChange={(event) => setAccessCode(event.target.value)}
          minLength={4}
          maxLength={24}
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-2xl border-2 border-slate-200 px-4 text-lg font-black outline-none transition focus:border-indigo-400"
          style={{ color: "#1e1b4b", backgroundColor: "#ffffff" }}
          placeholder="Nhập mã của con"
        />
      </div>

      {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-900">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting || accessCode.trim().length < 4}
        className="h-12 w-full rounded-2xl px-5 font-black text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          boxShadow: `0 4px 16px ${primaryColor}55`,
        }}
      >
        {isSubmitting ? "Đang mở..." : "Mở hồ sơ"}
      </button>
    </form>
  );
}
