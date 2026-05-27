"use client";

import { useState } from "react";

type MistakeForReview = {
  id: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  createdAt?: Date | string;
  student?: {
    displayName: string;
  } | null;
  question: {
    text: string;
  };
  lesson: {
    title: string;
    subject: {
      label: string;
      emoji: string;
    };
  };
};

type MistakeReviewListProps = {
  mistakes: MistakeForReview[];
  emptyMessage?: string;
  showStudentName?: boolean;
  studentId?: string;
};

export function MistakeReviewList({
  mistakes,
  emptyMessage = "Chưa có câu cần ôn. Hai bé đang khởi đầu rất nhẹ nhàng.",
  showStudentName = false,
  studentId,
}: MistakeReviewListProps) {
  const [visibleMistakes, setVisibleMistakes] = useState(() => mistakes);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function resolveMistake(mistakeId: string) {
    if (!studentId) return;

    setResolvingId(mistakeId);
    setError("");

    const response = await fetch("/api/mistakes/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mistakeId, studentId }),
    });

    if (!response.ok) {
      setError("Chưa lưu được câu ôn này. Mình thử lại sau một chút nhé.");
      setResolvingId(null);
      return;
    }

    setVisibleMistakes((current) => current.filter((mistake) => mistake.id !== mistakeId));
    setResolvingId(null);
  }

  if (visibleMistakes.length === 0) {
    return <p className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-900">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-900">{error}</p> : null}

      {visibleMistakes.map((mistake) => (
        <article key={mistake.id} className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
          {showStudentName && mistake.student ? <span className="text-xs font-black text-slate-400">{mistake.student.displayName}</span> : null}

          <div className="text-sm font-black text-slate-500">
            {mistake.lesson.subject.emoji} {mistake.lesson.subject.label} · {mistake.lesson.title}
          </div>
          <h3 className="mt-2 font-black text-slate-900">{mistake.question.text}</h3>
          <p className="mt-2 text-sm text-slate-600">
            Bé đã chọn: <span className="font-bold">{mistake.selectedAnswer}</span> · Đáp án tham khảo: <span className="font-bold">{mistake.correctAnswer}</span>
          </p>
          <p className="mt-2 rounded-2xl bg-sky-50 p-3 text-sm text-sky-950">{mistake.explanation}</p>

          {studentId ? (
            <button
              type="button"
              disabled={resolvingId === mistake.id}
              onClick={() => void resolveMistake(mistake.id)}
              className="mt-3 h-10 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resolvingId === mistake.id ? "Đang lưu..." : "✅ Đã nhớ rồi"}
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}
