"use client";

import type { QuizQuestion } from "@/lib/quiz";

type QuestionRendererProps = {
  question: QuizQuestion;
  selectedAnswer: string;
  fillValue: string;
  disabled?: boolean;
  isEnglish?: boolean;
  onSelect: (value: string) => void;
  onFillChange: (value: string) => void;
};

function speakEnglish(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export function QuestionRenderer({ question, selectedAnswer, fillValue, disabled, isEnglish, onSelect, onFillChange }: QuestionRendererProps) {
  if (question.type === "fill_blank") {
    return (
      <label className="block">
        <span className="text-sm font-black text-slate-600">Câu trả lời của con</span>
        <input
          value={fillValue}
          disabled={disabled}
          onChange={(event) => onFillChange(event.target.value)}
          className="mt-2 h-14 w-full rounded-[8px] border-2 border-slate-200 px-4 text-xl font-bold outline-none focus:border-[var(--sq-primary)]"
          placeholder="Nhập đáp án..."
        />
      </label>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {question.options.map((option) => {
        const isSelected = selectedAnswer === option.id;
        return (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-3 rounded-[8px] border-4 px-4 py-3 text-lg font-black transition-colors"
            style={{
              borderColor: isSelected ? "var(--sq-primary)" : "#e2e8f0",
              backgroundColor: isSelected ? "var(--sq-primary)" : "#ffffff",
              color: isSelected ? "#ffffff" : "var(--sq-text)",
              opacity: disabled ? 0.7 : 1,
              cursor: disabled ? "default" : "pointer",
              touchAction: "manipulation",
            }}
          >
            <input
              type="radio"
              name={`q-${question.id}`}
              value={option.id}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onSelect(option.id)}
              className="sr-only"
            />
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black"
              style={{
                backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : "var(--sq-primary)",
                color: "#ffffff",
              }}
            >
              {isSelected ? "✓" : option.id === "true" ? "✓" : option.id === "false" ? "✗" : option.id}
            </span>
            <span className="flex-1">{option.text}</span>
            {isEnglish && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  speakEnglish(option.text);
                }}
                title={`Nghe: ${option.text}`}
                style={{ touchAction: "manipulation", color: isSelected ? "rgba(255,255,255,0.8)" : "var(--sq-primary)" }}
                className="shrink-0 text-lg transition-transform active:scale-90 hover:scale-110"
                aria-label={`Nghe phát âm: ${option.text}`}
              >
                🔊
              </button>
            )}
          </label>
        );
      })}
    </div>
  );
}
