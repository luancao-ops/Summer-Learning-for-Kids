"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { choreLevelRewards, type ChoreLevel } from "@/lib/habits";

type StudentOption = {
  id: string;
  displayName: string;
};

type ChoreTemplateOption = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type ChoreAssignmentForPlanner = {
  id: string;
  studentId: string;
  assignedDate: string;
  chore: ChoreTemplateOption;
  completion: {
    id: string;
    level: string;
    description: string;
  } | null;
};

type ParentChorePlannerProps = {
  students: StudentOption[];
  templates: ChoreTemplateOption[];
  assignments: ChoreAssignmentForPlanner[];
  selectedDate: string;
};

export function ParentChorePlanner({ students, templates, assignments, selectedDate }: ParentChorePlannerProps) {
  const router = useRouter();
  const firstTemplateId = templates[0]?.id ?? "";
  const [selectedByStudent, setSelectedByStudent] = useState<Record<string, string>>({});
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const assignmentsByStudent = useMemo(() => {
    return students.reduce<Record<string, ChoreAssignmentForPlanner[]>>((acc, student) => {
      acc[student.id] = assignments.filter((assignment) => assignment.studentId === student.id);
      return acc;
    }, {});
  }, [assignments, students]);

  function selectedTemplate(studentId: string): string {
    return selectedByStudent[studentId] ?? firstTemplateId;
  }

  async function assignChore(studentId: string) {
    const choreId = selectedTemplate(studentId);
    if (!choreId) return;

    setWorkingId(`assign-${studentId}`);
    setMessage("");

    const response = await fetch("/api/parent/chores/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choreId, studentId, date: selectedDate }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(data?.message ?? "Chưa giao được việc. Mình thử lại sau nhé.");
      setWorkingId(null);
      return;
    }

    setWorkingId(null);
    router.refresh();
  }

  async function removeAssignment(assignmentId: string) {
    setWorkingId(assignmentId);
    setMessage("");

    const response = await fetch("/api/parent/chores/assign", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(data?.message ?? "Chưa xoá được việc này.");
      setWorkingId(null);
      return;
    }

    setWorkingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <label className="text-sm font-black uppercase text-indigo-700" htmlFor="chore-date">
          Ngày giao việc
        </label>
        <input
          id="chore-date"
          type="date"
          value={selectedDate}
          onChange={(event) => router.push(`/parent/chores?date=${event.target.value}`)}
          className="mt-2 h-12 rounded-2xl border-2 border-slate-200 px-4 font-bold text-slate-900"
        />
        {message ? <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900">{message}</p> : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {students.map((student) => {
          const studentAssignments = assignmentsByStudent[student.id] ?? [];
          const doneCount = studentAssignments.filter((assignment) => assignment.completion).length;

          return (
          <section key={student.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-slate-950">{student.displayName}</h2>
              <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: studentAssignments.length > 0 && doneCount === studentAssignments.length ? "#047857" : "#64748b" }}>
                {doneCount}/{studentAssignments.length} đã xong
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <select
                value={selectedTemplate(student.id)}
                onChange={(event) => setSelectedByStudent((current) => ({ ...current, [student.id]: event.target.value }))}
                className="h-12 min-w-56 rounded-2xl border-2 border-slate-200 px-4 font-bold text-slate-900"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.icon} {template.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!firstTemplateId || workingId === `assign-${student.id}`}
                onClick={() => void assignChore(student.id)}
                className="h-12 rounded-2xl bg-indigo-700 px-5 font-black text-white shadow-md shadow-indigo-200 disabled:opacity-50"
              >
                ➕ Thêm
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {studentAssignments.length > 0 ? (
                studentAssignments.map((assignment) => {
                  const level = assignment.completion?.level as ChoreLevel | undefined;
                  const reward = level ? choreLevelRewards[level] : null;

                  return (
                    <article key={assignment.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-black text-slate-950">
                            {assignment.chore.icon} {assignment.chore.name}
                          </div>
                          <p className="mt-1 text-sm font-semibold text-slate-600">{assignment.chore.description}</p>
                        </div>
                        {assignment.completion ? (
                          <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: reward?.color ?? "#64748b" }}>
                            ✅ {reward?.label ?? "Đã xong"}
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-500 px-3 py-1 text-xs font-black text-white">Chưa làm</span>
                            <button
                              type="button"
                              disabled={workingId === assignment.id}
                              onClick={() => void removeAssignment(assignment.id)}
                              className="h-9 rounded-2xl bg-slate-800 px-3 text-sm font-black text-white disabled:opacity-50"
                            >
                              ❌ Xoá
                            </button>
                          </div>
                        )}
                      </div>
                      {assignment.completion ? <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700">{assignment.completion.description}</p> : null}
                    </article>
                  );
                })
              ) : (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Chưa giao việc nào cho ngày này.</p>
              )}
            </div>
          </section>
          );
        })}
      </div>
    </div>
  );
}
