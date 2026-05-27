import { ProgressMap } from "@/components/ProgressMap";

type ParentSummaryProps = {
  student: {
    displayName: string;
    xp: number;
    coins: number;
    streak: number;
  };
  progress: {
    label: string;
    completed: number;
    total: number;
    percent: number;
  }[];
};

export function ParentSummary({ student, progress }: ParentSummaryProps) {
  return (
    <section className="rounded-[8px] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">{student.displayName}</h2>
          <p className="text-sm font-bold text-slate-500">
            {student.xp} XP · {student.coins} xu · streak {student.streak}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <ProgressMap items={progress} />
      </div>
    </section>
  );
}
