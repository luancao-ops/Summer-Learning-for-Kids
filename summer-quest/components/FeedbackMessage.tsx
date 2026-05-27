type FeedbackMessageProps = {
  tone: "correct" | "retry" | "reveal" | "info";
  message: string;
  explanation?: string;
};

const toneClass = {
  correct: "border-emerald-200 bg-emerald-50 text-emerald-900",
  retry: "border-orange-200 bg-orange-50 text-orange-950",
  reveal: "border-sky-200 bg-sky-50 text-sky-950",
  info: "border-slate-200 bg-slate-50 text-slate-900",
};

export function FeedbackMessage({ tone, message, explanation }: FeedbackMessageProps) {
  return (
    <div className={`rounded-[8px] border p-4 ${toneClass[tone]}`}>
      <p className="font-black">{message}</p>
      {explanation ? <p className="mt-2 leading-7">{explanation}</p> : null}
    </div>
  );
}
