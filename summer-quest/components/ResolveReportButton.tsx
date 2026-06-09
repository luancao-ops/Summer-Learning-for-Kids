"use client";

import { useActionState } from "react";
import { resolveReportAction } from "@/app/parent/review/actions";

export function ResolveReportButton({ reportId }: { reportId: string }) {
  const [state, action, isPending] = useActionState(resolveReportAction, null);

  if (state?.ok) {
    return <span className="text-sm font-bold" style={{ color: "#059669" }}>✓ Đã xử lý</span>;
  }

  return (
    <form action={action}>
      <input type="hidden" name="reportId" value={reportId} />
      <button
        type="submit"
        disabled={isPending}
        className="h-9 rounded-lg px-4 text-sm font-black text-white disabled:opacity-50"
        style={{ backgroundColor: "#64748b" }}
      >
        {isPending ? "Đang lưu..." : "Đã xem & xử lý"}
      </button>
    </form>
  );
}
