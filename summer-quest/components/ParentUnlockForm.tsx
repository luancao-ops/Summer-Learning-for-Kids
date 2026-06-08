"use client";

import { useRef, useState } from "react";

export function ParentUnlockForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/parent/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      if (data.ok) {
        window.location.href = "/parent";
      } else {
        setError("Mã không đúng. Thử lại.");
        setPin("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Lỗi kết nối. Thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        ref={inputRef}
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Nhập mã phụ huynh"
        autoFocus
        autoComplete="current-password"
        maxLength={24}
        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-center text-2xl font-black tracking-widest text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
        style={{ touchAction: "manipulation" }}
      />

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-center font-black text-red-700">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !pin.trim()}
        style={{ touchAction: "manipulation" }}
        className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 py-4 font-black text-white shadow-lg shadow-indigo-200 disabled:opacity-50"
      >
        {loading ? "Đang kiểm tra..." : "Vào bảng phụ huynh"}
      </button>
    </form>
  );
}
