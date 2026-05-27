import Link from "next/link";
import type { LessonStatus } from "@/lib/quiz";
import type { AppTheme } from "@/lib/themes";

const statusCopy: Record<LessonStatus, { label: string; icon: string }> = {
  not_started: { label: "Chưa bắt đầu", icon: "📖" },
  in_progress: { label: "Đang học", icon: "✨" },
  completed: { label: "Hoàn thành", icon: "✅" },
  needs_review: { label: "Cần ôn lại", icon: "💡" },
};

type LessonCardProps = {
  studentId: string;
  lesson: {
    id: string;
    title: string;
    grade: number;
    phase: string;
    learningObjective: string;
    shortExplanation: string;
  };
  status: LessonStatus;
  latestPercentage?: number;
  theme: AppTheme;
};

export function LessonCard({ studentId, lesson, status, latestPercentage, theme }: LessonCardProps) {
  const statusInfo = statusCopy[status];

  return (
    <Link
      href={`/student/${studentId}/lesson/${lesson.id}`}
      className="block rounded-[8px] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <div className="text-sm font-black uppercase" style={{ color: theme.palette.accent }}>
            Lớp {lesson.grade} · {lesson.phase === "prep" ? "Chuẩn bị" : "Ôn tập"}
          </div>
          <h3 className="mt-2 text-2xl font-black" style={{ color: theme.palette.text }}>
            {lesson.title}
          </h3>
          <p className="mt-2 text-sm leading-6" style={{ color: theme.palette.muted }}>
            {lesson.learningObjective}
          </p>
        </div>
        <div className="rounded-[8px] px-3 py-2 text-sm font-black" style={{ backgroundColor: theme.palette.primarySoft, color: theme.palette.primary }}>
          {statusInfo.icon} {statusInfo.label}
          {latestPercentage !== undefined ? ` · ${latestPercentage}%` : ""}
        </div>
      </div>
      <p className="mt-4 rounded-[8px] p-3 text-sm font-semibold" style={{ backgroundColor: theme.palette.accentSoft, color: theme.palette.text }}>
        {lesson.shortExplanation}
      </p>
    </Link>
  );
}
