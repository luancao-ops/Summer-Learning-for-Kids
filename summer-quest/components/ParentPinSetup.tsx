"use client";

import { useState } from "react";

type Props = {
  hasPin: boolean;
};

export function ParentPinSetup({ hasPin }: Props) {
  const [mode, setMode] = useState<"idle" | "set" | "remove">("idle");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function reset() {
    setPin("");
    setConfirm("");
    setMessage(null);
    setMode("idle");
  }

  async function handleSet(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length < 4) {
      setMessage({ type: "err", text: "Mã phải có ít nhất 4 ký tự." });
      return;
    }
    if (pin !== confirm) {
      setMessage({ type: "err", text: "Hai lần nhập không khớp." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/parent/set-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = (await res.json()) as { ok: boolean };
      if (data.ok) {
        setMessage({ type: "ok", text: "Đã lưu mã phụ huynh." });
        setTimeout(() => window.location.reload(), 800);
      } else {
        setMessage({ type: "err", text: "Lỗi khi lưu mã. Thử lại." });
      }
    } catch {
      setMessage({ type: "err", text: "Lỗi kết nối." });
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/parent/set-pin", { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean };
      if (data.ok) {
        setMessage({ type: "ok", text: "Đã xoá mã phụ huynh." });
        setTimeout(() => window.location.reload(), 800);
      } else {
        setMessage({ type: "err", text: "Lỗi khi xoá mã. Thử lại." });
      }
    } catch {
      setMessage({ type: "err", text: "Lỗi kết nối." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950">🔐 Mã vào bảng phụ huynh</h2>
          <p className="mt-1 font-semibold text-slate-500">
            {hasPin
              ? "Bảng phụ huynh đang được khoá bằng mã PIN."
              : "Chưa cài mã — bảng phụ huynh đang mở."}
          </p>
        </div>
        <span
          className="rounded-full px-4 py-1.5 text-sm font-black"
          style={
            hasPin
              ? { backgroundColor: "#dcfce7", color: "#166534" }
              : { backgroundColor: "#fef9c3", color: "#713f12" }
          }
        >
          {hasPin ? "Đã cài mã" : "Chưa cài"}
        </span>
      </div>

      {mode === "idle" && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setMode("set")}
            style={{ touchAction: "manipulation" }}
            className="rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 px-5 py-2.5 font-black text-white shadow-md shadow-indigo-100"
          >
            {hasPin ? "Đổi mã" : "Cài mã"}
          </button>
          {hasPin && (
            <button
              onClick={() => setMode("remove")}
              style={{ touchAction: "manipulation" }}
              className="rounded-2xl bg-red-50 px-5 py-2.5 font-black text-red-700"
            >
              Xoá mã
            </button>
          )}
        </div>
      )}

      {mode === "set" && (
        <form onSubmit={handleSet} className="mt-5 max-w-sm space-y-3">
          <div>
            <label className="mb-1 block text-sm font-black text-slate-700">Mã mới (4–24 ký tự)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
              maxLength={24}
              placeholder="Nhập mã mới"
              className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-black text-slate-700">Nhập lại mã</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              maxLength={24}
              placeholder="Xác nhận mã"
              className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {message && (
            <p
              className="rounded-2xl px-4 py-2 text-sm font-black"
              style={
                message.type === "ok"
                  ? { backgroundColor: "#dcfce7", color: "#166534" }
                  : { backgroundColor: "#fee2e2", color: "#991b1b" }
              }
            >
              {message.text}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              style={{ touchAction: "manipulation" }}
              className="rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 px-5 py-2.5 font-black text-white disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu mã"}
            </button>
            <button
              type="button"
              onClick={reset}
              style={{ touchAction: "manipulation" }}
              className="rounded-2xl bg-slate-100 px-5 py-2.5 font-black text-slate-700"
            >
              Huỷ
            </button>
          </div>
        </form>
      )}

      {mode === "remove" && (
        <div className="mt-5 max-w-sm space-y-3">
          <p className="font-semibold text-slate-600">
            Xoá mã sẽ cho phép truy cập bảng phụ huynh mà không cần nhập mã. Chắc chắn chưa?
          </p>

          {message && (
            <p
              className="rounded-2xl px-4 py-2 text-sm font-black"
              style={
                message.type === "ok"
                  ? { backgroundColor: "#dcfce7", color: "#166534" }
                  : { backgroundColor: "#fee2e2", color: "#991b1b" }
              }
            >
              {message.text}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleRemove}
              disabled={loading}
              style={{ touchAction: "manipulation" }}
              className="rounded-2xl bg-red-600 px-5 py-2.5 font-black text-white disabled:opacity-50"
            >
              {loading ? "Đang xoá..." : "Xoá mã"}
            </button>
            <button
              onClick={reset}
              style={{ touchAction: "manipulation" }}
              className="rounded-2xl bg-slate-100 px-5 py-2.5 font-black text-slate-700"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
