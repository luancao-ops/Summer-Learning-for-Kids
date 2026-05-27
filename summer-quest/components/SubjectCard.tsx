import Link from "next/link";
import type { AppTheme } from "@/lib/themes";

type SubjectCardProps = {
  studentId: string;
  subject: {
    id: string;
    label: string;
    emoji: string;
  };
  completed: number;
  needsReview: number;
  total: number;
  percent: number;
  theme: AppTheme;
};

export function SubjectCard({ studentId, subject, completed, needsReview, total, percent, theme }: SubjectCardProps) {
  return (
    <Link
      href={`/student/${studentId}/subject/${subject.id}`}
      className="block rounded-[8px] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-4xl">{subject.emoji}</div>
          <h3 className="mt-3 text-2xl font-black" style={{ color: theme.palette.text }}>
            {subject.label}
          </h3>
          <p className="mt-1 text-sm font-bold" style={{ color: theme.palette.muted }}>
            {completed}/{total} bài hoàn thành
          </p>
        </div>
        {needsReview > 0 ? (
          <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: theme.palette.warning }}>
            {needsReview} cần ôn
          </span>
        ) : null}
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full" style={{ backgroundColor: theme.palette.primarySoft }}>
        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: theme.palette.primary }} />
      </div>
    </Link>
  );
}
