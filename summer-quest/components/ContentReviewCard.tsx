"use client";

import { useActionState } from "react";
import { approveLessonAction, rejectLessonAction, type ReviewActionState } from "@/app/parent/review/actions";

type ContentReviewCardProps = {
  lesson: {
    id: string;
    title: string;
    grade: number;
    phase: string;
    content: string;
    subject: {
      label: string;
      emoji: string;
    };
    questions: {
      id: string;
    }[];
  };
};

const initialState: ReviewActionState | null = null;

export function ContentReviewCard({ lesson }: ContentReviewCardProps) {
  const [approveState, approveAction, approveIsPending] = useActionState(approveLessonAction, initialState);
  const [rejectState, rejectAction, rejectIsPending] = useActionState(rejectLessonAction, initialState);

  const isWorking = approveIsPending || rejectIsPending;
  const errorMessage = (!approveState?.ok && approveState?.error) || (!rejectState?.ok && rejectState?.error) || "";

  if (approveState?.ok || rejectState?.ok) {
    const wasApproved = approveState?.ok;
    return (
      <article
        className="rounded-2xl p-5 shadow-sm"
        style={{ backgroundColor: wasApproved ? "#ecfdf5" : "#f1f5f9", color: "#1e1b4b" }}
      >
        <p className="text-lg font-black" style={{ color: wasApproved ? "#065f46" : "#475569" }}>
          {wasApproved ? "✅ Đã duyệt — bài học sẽ xuất hiện cho bé!" : "🗑️ Đã ẩn — bài học sẽ không hiện nữa."}
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{lesson.title}</p>
      </article>
    );
  }

  return (
    <article className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-black uppercase text-indigo-700">
            {lesson.subject.emoji} {lesson.subject.label} · Lớp {lesson.grade} · {lesson.phase === "prep" ? "Chuẩn bị" : "Ôn tập"}
          </div>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{lesson.title}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{lesson.content.slice(0, 200)}...</p>
          <p className="mt-2 text-sm font-black text-slate-500">{lesson.questions.length} câu quiz</p>
        </div>
      </div>

      <details className="mt-4 rounded-2xl p-4" style={{ backgroundColor: "#f8fafc" }}>
        <summary className="cursor-pointer font-black text-slate-900">↗ Xem đầy đủ</summary>
        <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{lesson.content}</div>
      </details>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl p-3 text-sm font-bold" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
          ⚠️ {errorMessage}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <form action={approveAction}>
          <input type="hidden" name="lessonId" value={lesson.id} />
          <button
            type="submit"
            disabled={isWorking}
            className="h-11 rounded-2xl bg-emerald-600 px-4 font-black text-white disabled:opacity-50"
          >
            {approveIsPending ? "Đang lưu..." : "✅ Duyệt"}
          </button>
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="lessonId" value={lesson.id} />
          <button
            type="submit"
            disabled={isWorking}
            className="h-11 rounded-2xl bg-slate-800 px-4 font-black text-white disabled:opacity-50"
          >
            {rejectIsPending ? "Đang ẩn..." : "❌ Ẩn"}
          </button>
        </form>
      </div>
    </article>
  );
}
