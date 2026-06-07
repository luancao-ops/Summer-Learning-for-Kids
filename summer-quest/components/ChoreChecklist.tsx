"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { choreLevelRewards, sessionLabel, type ChoreLevel } from "@/lib/habits";
import type { AppTheme } from "@/lib/themes";

type Completion = {
  id: string;
  assignmentId: string;
  level: string;
  description: string;
  completedAt: Date | string;
};

type ChoreAssignmentForChecklist = {
  id: string;
  studentId: string;
  assignedDate: string;
  dueDate: string;
  dueSession: string;
  createdAt: Date | string;
  chore: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  completion: Completion | null;
};

type ChoreChecklistProps = {
  studentId: string;
  assignments: ChoreAssignmentForChecklist[];
  theme: AppTheme;
};

const levels: { id: ChoreLevel; label: string }[] = [
  { id: "great", label: "🌟 Làm tốt lắm" },
  { id: "okay", label: "👍 Được rồi" },
  { id: "partial", label: "🔄 Chưa xong hẳn" },
];

export function ChoreChecklist({ studentId, assignments, theme }: ChoreChecklistProps) {
  const router = useRouter();
  const [items, setItems] = useState(() => assignments);
  const [openId, setOpenId] = useState<string | null>(null);
  const [levelById, setLevelById] = useState<Record<string, ChoreLevel>>({});
  const [descriptionById, setDescriptionById] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function completeAssignment(assignmentId: string) {
    const level = levelById[assignmentId] ?? "great";
    const description = descriptionById[assignmentId]?.trim() ?? "";

    if (!description) {
      setError("Con kể thêm một chút về việc mình đã làm nhé.");
      return;
    }

    const previousItems = items;
    const optimisticCompletion: Completion = {
      id: `optimistic-${assignmentId}`,
      assignmentId,
      level,
      description,
      completedAt: new Date().toISOString(),
    };

    setError("");
    setSavingId(assignmentId);
    setOpenId(null);
    setItems((current) => current.map((item) => (item.id === assignmentId ? { ...item, completion: optimisticCompletion } : item)));

    const response = await fetch("/api/chores/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, studentId, level, description }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setItems(previousItems);
      setOpenId(assignmentId);
      setError(data?.message ?? "Chưa lưu được báo cáo. Mình thử lại sau nhé.");
      setSavingId(null);
      return;
    }

    const data = (await response.json()) as { completion: Completion };
    setItems((current) => current.map((item) => (item.id === assignmentId ? { ...item, completion: data.completion } : item)));
    setSavingId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-900">{error}</p> : null}

      {items.map((assignment) => {
        const currentLevel = (levelById[assignment.id] ?? "great") as ChoreLevel;
        const completionLevel = assignment.completion?.level as ChoreLevel | undefined;
        const reward = completionLevel ? choreLevelRewards[completionLevel] : null;

        return (
          <article key={assignment.id} className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
            <div className="flex items-start gap-3">
              {assignment.completion ? (
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: theme.palette.primary }}>
                  <span className="text-sm font-black text-white">✓</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenId(openId === assignment.id ? null : assignment.id)}
                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 active:scale-95"
                  style={{ borderColor: theme.palette.primary, backgroundColor: openId === assignment.id ? theme.palette.primarySoft : "transparent" }}
                  aria-label={`Đánh dấu hoàn thành: ${assignment.chore.name}`}
                />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  {assignment.completion ? (
                    <div className="text-lg font-black leading-snug" style={{ textDecoration: "line-through", opacity: 0.55 }}>
                      {assignment.chore.icon} {assignment.chore.name}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === assignment.id ? null : assignment.id)}
                      className="text-left text-lg font-black leading-snug"
                      style={{ color: "#1e1b4b" }}
                    >
                      {assignment.chore.icon} {assignment.chore.name}
                    </button>
                  )}

                  {assignment.completion ? (
                    <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: reward?.color ?? theme.palette.primary }}>
                      {reward?.label ?? "Đã xong"}
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-500">{assignment.chore.description}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">Cần hoàn thành: {assignment.dueDate} · {sessionLabel(assignment.dueSession)}</p>

                {assignment.completion ? (
                  <p className="mt-2 rounded-xl p-3 text-sm font-semibold leading-6" style={{ backgroundColor: theme.palette.primarySoft, color: theme.palette.text }}>
                    {assignment.completion.description}
                  </p>
                ) : null}

                {openId === assignment.id && !assignment.completion ? (
                  <div className="mt-3 rounded-2xl p-4" style={{ backgroundColor: theme.palette.accentSoft }}>
                    <p className="mb-2 text-sm font-black">Mình làm thế nào?</p>
                    <div className="flex flex-wrap gap-2">
                      {levels.map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setLevelById((current) => ({ ...current, [assignment.id]: level.id }))}
                          className="rounded-2xl px-3 py-2 text-sm font-black"
                          style={{
                            backgroundColor: currentLevel === level.id ? theme.palette.primary : "#ffffff",
                            color: currentLevel === level.id ? "#ffffff" : "#1e1b4b",
                          }}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={descriptionById[assignment.id] ?? ""}
                      onChange={(event) => setDescriptionById((current) => ({ ...current, [assignment.id]: event.target.value }))}
                      placeholder="Kể cho mẹ nghe mình đã làm thế nào..."
                      className="mt-3 min-h-24 w-full rounded-2xl border-2 border-slate-200 p-3 font-semibold text-slate-900 outline-none focus:border-[var(--sq-primary)]"
                    />
                    <button
                      type="button"
                      disabled={savingId === assignment.id}
                      onClick={() => void completeAssignment(assignment.id)}
                      className="mt-3 h-10 rounded-2xl px-4 text-sm font-black text-white disabled:opacity-60"
                      style={{ backgroundColor: theme.palette.accent }}
                    >
                      {savingId === assignment.id ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
