"use client";

import type { QuizQuestion } from "@/lib/quiz";

type QuestionRendererProps = {
  question: QuizQuestion;
  selectedAnswer: string;
  fillValue: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
  onFillChange: (value: string) => void;
};

export function QuestionRenderer({ question, selectedAnswer, fillValue, disabled, onSelect, onFillChange }: QuestionRendererProps) {
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
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            className="min-h-16 rounded-[8px] border-2 px-4 py-3 text-left text-lg font-black transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-80"
            style={{
              borderColor: isSelected ? "var(--sq-primary)" : "#e5e7eb",
              backgroundColor: isSelected ? "var(--sq-primary-soft)" : "#ffffff",
              color: "var(--sq-text)",
            }}
          >
            <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-white" style={{ backgroundColor: "var(--sq-primary)" }}>
              {option.id === "true" ? "✓" : option.id === "false" ? "?" : option.id}
            </span>
            {option.text}
          </button>
        );
      })}
    </div>
  );
}
