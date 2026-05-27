"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export function ContentReviewCard({ lesson }: ContentReviewCardProps) {
  const router = useRouter();
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(action: "approve" | "reject") {
    setIsWorking(true);
    setMessage("");

    const response = await fetch("/api/parent/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, action }),
    });

    if (!response.ok) {
      setMessage("Chưa lưu được thao tác. Thử lại sau một chút nhé.");
      setIsWorking(false);
      return;
    }

    setIsWorking(false);
    router.refresh();
  }

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
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

      <details className="mt-4 rounded-2xl bg-slate-50 p-4">
        <summary className="cursor-pointer font-black text-slate-900">↗ Xem đầy đủ</summary>
        <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{lesson.content}</div>
      </details>

      {message ? <p className="mt-4 rounded-2xl bg-sky-50 p-3 text-sm font-bold text-sky-950">{message}</p> : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={isWorking} onClick={() => void submit("approve")} className="h-11 rounded-2xl bg-emerald-600 px-4 font-black text-white disabled:opacity-50">
          ✅ Duyệt
        </button>
        <button type="button" disabled={isWorking} onClick={() => void submit("reject")} className="h-11 rounded-2xl bg-slate-800 px-4 font-black text-white disabled:opacity-50">
          ❌ Ẩn
        </button>
      </div>
    </article>
  );
}
