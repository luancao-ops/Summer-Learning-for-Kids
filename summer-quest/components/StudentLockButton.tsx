"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StudentLockButtonProps = {
  studentId: string;
};

export function StudentLockButton({ studentId }: StudentLockButtonProps) {
  const router = useRouter();
  const [isLocking, setIsLocking] = useState(false);

  async function lockProfile() {
    setIsLocking(true);
    await fetch("/api/student/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void lockProfile()}
      disabled={isLocking}
      className="flex h-10 items-center rounded-2xl px-4 text-sm font-black text-white/90 backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
    >
      {isLocking ? "Đang khóa..." : "Khóa hồ sơ"}
    </button>
  );
}
