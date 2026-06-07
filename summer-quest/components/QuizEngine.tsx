"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculateRewards, isAnswerCorrect, scoreQuiz, type AnswerInput, type QuizQuestion } from "@/lib/quiz";
import type { AppTheme } from "@/lib/themes";
import { FeedbackMessage } from "@/components/FeedbackMessage";
import { QuestionRenderer } from "@/components/QuestionRenderer";
import { RewardBanner } from "@/components/RewardBanner";

type QuizResult = {
  score: number;
  totalQuestions: number;
  percentage: number;
  xpEarned: number;
  coinsEarned: number;
  mistakesSaved: number;
};

type QuizEngineProps = {
  studentId: string;
  lessonId: string;
  lessonTitle: string;
  questions: QuizQuestion[];
  theme: AppTheme;
  subjectId?: string;
};

function speakEnglish(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

// Renders English question text. Quoted phrases ('like this') become inline speak buttons.
// The full question also gets a standalone 🔊 button beside it.
function EnglishQuestionText({ text, theme }: { text: string; theme: AppTheme }) {
  const hasQuotes = /['"][^'"]+['"]/.test(text);
  const parts = hasQuotes ? text.split(/('(?:[^']+)'|"(?:[^"]+)")/) : [text];

  return (
    <span className="flex flex-wrap items-start gap-3">
      <span className="flex-1">
        {parts.map((part, i) => {
          const m = hasQuotes ? part.match(/^['"]([^'"]+)['"]$/) : null;
          if (m) {
            const phrase = m[1];
            return (
              <button
                key={i}
                type="button"
                onClick={() => speakEnglish(phrase)}
                title={`Nghe phát âm: ${phrase}`}
                style={{ color: theme.palette.primary, touchAction: "manipulation" }}
                className="inline-flex items-center gap-1 rounded-lg px-1 font-black underline decoration-dotted underline-offset-4 transition-transform active:scale-95"
              >
                {part}<span className="text-sm">🔊</span>
              </button>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
      {/* Always show a button to hear the full question */}
      <button
        type="button"
        onClick={() => speakEnglish(text)}
        title="Nghe toàn bộ câu hỏi"
        style={{ touchAction: "manipulation" }}
        className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl transition-transform active:scale-90 hover:scale-110"
        aria-label="Nghe câu hỏi"
      >
        🔊
      </button>
    </span>
  );
}

export function QuizEngine({ studentId, lessonId, lessonTitle, questions, theme, subjectId }: QuizEngineProps) {
  const isEnglish = subjectId === "english";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [fillValue, setFillValue] = useState("");
  const [answers, setAnswers] = useState<AnswerInput[]>([]);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<{ tone: "correct" | "retry" | "reveal"; message: string; explanation?: string } | null>(null);
  const [readyForNext, setReadyForNext] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  const localScore = useMemo(() => scoreQuiz(questions, answers), [answers, questions]);
  const previewRewards = calculateRewards(localScore);

  if (result) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl p-6 shadow-md" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
        <RewardBanner
          theme={theme}
          title="Hoàn thành bài kiểm tra!"
          subtitle={`${result.score}/${result.totalQuestions} câu đúng · ${result.percentage}%`}
        />
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "#ecfdf5", color: "#064e3b" }}>
            <div className="text-3xl font-black">{result.xpEarned}</div>
            <div className="text-sm font-bold">XP nhận được</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "#fffbeb", color: "#78350f" }}>
            <div className="text-3xl font-black">{result.coinsEarned}</div>
            <div className="text-sm font-bold">xu nhận được</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "#f0f9ff", color: "#0c4a6e" }}>
            <div className="text-3xl font-black">{result.mistakesSaved}</div>
            <div className="text-sm font-bold">câu để ôn</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/student/${studentId}`}
            className="inline-flex h-12 items-center rounded-xl px-5 font-black text-white"
            style={{ backgroundColor: theme.palette.primary }}
          >
            Về dashboard
          </Link>
          <Link
            href={`/student/${studentId}/lesson/${lessonId}`}
            className="inline-flex h-12 items-center rounded-xl px-5 font-black"
            style={{ border: "2px solid #e2e8f0", color: "#334155", backgroundColor: "#ffffff" }}
          >
            Xem lại bài học
          </Link>
        </div>
      </div>
    );
  }

  function selectedValue() {
    return currentQuestion.type === "fill_blank" ? fillValue : selectedAnswer;
  }

  function saveAnswer(value: string) {
    setAnswers((previous) => {
      const withoutCurrent = previous.filter((answer) => answer.questionId !== currentQuestion.id);
      return [...withoutCurrent, { questionId: currentQuestion.id, selectedAnswer: value }];
    });
  }

  function handleCheck() {
    const value = selectedValue().trim();
    if (!value) return;

    const nextAttemptCount = (attempts[currentQuestion.id] ?? 0) + 1;
    setAttempts((previous) => ({ ...previous, [currentQuestion.id]: nextAttemptCount }));

    const isCorrect = isAnswerCorrect(currentQuestion, value);
    if (isCorrect) {
      saveAnswer(value);
      setFeedback({
        tone: "correct",
        message: theme.feedback.correct[currentIndex % theme.feedback.correct.length],
        explanation: currentQuestion.explanation,
      });
      setReadyForNext(true);
      return;
    }

    if (nextAttemptCount < 2) {
      setFeedback({
        tone: "retry",
        message: theme.feedback.retry[currentIndex % theme.feedback.retry.length],
        explanation: currentQuestion.hint ? `${theme.feedback.hint} ${currentQuestion.hint}` : undefined,
      });
      setSelectedAnswer("");
      setFillValue("");
      return;
    }

    saveAnswer(value);
    setFeedback({
      tone: "reveal",
      message: theme.feedback.reveal[currentIndex % theme.feedback.reveal.length],
      explanation: currentQuestion.explanation,
    });
    setReadyForNext(true);
  }

  async function submitQuiz(finalAnswers: AnswerInput[]) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    let response: Response;
    try {
      response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, lessonId, answers: finalAnswers }),
      });
    } catch {
      setFeedback({
        tone: "reveal",
        message: "Mất kết nối. Thử bấm 'Lưu kết quả' lại một lần nữa nhé.",
        explanation: "Bài làm vẫn còn trên màn hình, chưa mất đâu.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!response.ok) {
      setFeedback({
        tone: "reveal",
        message: "Bài làm chưa lưu được. Mình thử lại sau một chút nhé.",
        explanation: "Dữ liệu vẫn ở trên màn hình, con chưa mất bài làm.",
      });
      setIsSubmitting(false);
      return;
    }

    const data = (await response.json()) as QuizResult;
    setResult(data);
    setIsSubmitting(false);
  }

  function handleNext() {
    const nextIndex = currentIndex + 1;
    setFeedback(null);
    setReadyForNext(false);
    setSelectedAnswer("");
    setFillValue("");

    if (nextIndex >= questions.length) {
      void submitQuiz(answers);
      return;
    }

    setCurrentIndex(nextIndex);
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl p-6 shadow-md" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black uppercase" style={{ color: theme.palette.accent }}>
            {lessonTitle}
          </div>
          <h1 className="text-3xl font-black" style={{ color: theme.palette.text }}>
            Câu {currentIndex + 1}/{questions.length}
          </h1>
        </div>
        <div className="rounded-[8px] px-3 py-2 text-sm font-black" style={{ backgroundColor: theme.palette.primarySoft, color: theme.palette.primary }}>
          Dự kiến +{previewRewards.xpEarned} XP · +{previewRewards.coinsEarned} xu
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full" style={{ backgroundColor: theme.palette.primarySoft }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: theme.palette.primary }} />
      </div>

      <div className="mt-8">
        <p className="text-2xl font-black leading-9" style={{ color: theme.palette.text }}>
          {isEnglish ? (
            <EnglishQuestionText text={currentQuestion.text} theme={theme} />
          ) : (
            currentQuestion.text
          )}
        </p>
        {currentQuestion.hint ? (
          <div className="mt-3 rounded-[8px] p-3 text-sm font-bold" style={{ backgroundColor: theme.palette.accentSoft, color: theme.palette.text }}>
            {theme.feedback.hint} {currentQuestion.hint}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <QuestionRenderer
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          fillValue={fillValue}
          disabled={readyForNext || isSubmitting}
          onSelect={setSelectedAnswer}
          onFillChange={setFillValue}
          isEnglish={isEnglish}
        />
      </div>

      {feedback ? (
        <div className="mt-5">
          <FeedbackMessage tone={feedback.tone} message={feedback.message} explanation={feedback.explanation} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        {!readyForNext ? (
          <>
            {!selectedValue().trim() && (
              <span className="text-sm font-bold text-slate-400">← Chọn đáp án trước nhé</span>
            )}
            <button
              type="button"
              onClick={handleCheck}
              disabled={!selectedValue().trim() || isSubmitting}
              className="h-12 rounded-[8px] px-5 font-black text-white"
              style={{
                backgroundColor: selectedValue().trim() ? theme.palette.primary : "#94a3b8",
                cursor: selectedValue().trim() ? "pointer" : "default",
              }}
            >
              Kiểm tra
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="h-12 rounded-[8px] px-5 font-black text-white disabled:opacity-50"
            style={{ backgroundColor: theme.palette.accent }}
          >
            {currentIndex + 1 >= questions.length ? (isSubmitting ? "Đang lưu..." : "Lưu kết quả") : "Câu tiếp theo"}
          </button>
        )}
      </div>
    </div>
  );
}
