"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { choreLevelRewards, daySessions, sessionFromDateTime, sessionLabel, type ChoreLevel, type DaySession } from "@/lib/habits";

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
  dueDate: string;
  dueSession: string;
  createdAt: Date | string;
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

type ComposerState = {
  mode: "create" | "edit";
  studentId: string;
  assignmentId?: string;
};

export function ParentChorePlanner({ students, templates, assignments, selectedDate }: ParentChorePlannerProps) {
  const router = useRouter();
  const firstTemplateId = templates[0]?.id ?? "";
  const [selectedByStudent, setSelectedByStudent] = useState<Record<string, string>>({});
  const [selectedDateByStudent, setSelectedDateByStudent] = useState<Record<string, string>>({});
  const [selectedSessionByStudent, setSelectedSessionByStudent] = useState<Record<string, DaySession>>({});
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const assignmentsByStudent = useMemo(() => {
    return students.reduce<Record<string, ChoreAssignmentForPlanner[]>>((acc, student) => {
      acc[student.id] = assignments.filter((assignment) => assignment.studentId === student.id);
      return acc;
    }, {});
  }, [assignments, students]);

  const composingStudent = students.find((student) => student.id === composer?.studentId) ?? null;

  function selectedTemplate(studentId: string): string {
    return selectedByStudent[studentId] ?? firstTemplateId;
  }

  function selectedDueDate(studentId: string): string {
    return selectedDateByStudent[studentId] ?? selectedDate;
  }

  function selectedDueSession(studentId: string): DaySession {
    return selectedSessionByStudent[studentId] ?? "evening";
  }

  function openCreateComposer(studentId: string) {
    setSelectedDateByStudent((current) => ({ ...current, [studentId]: current[studentId] ?? selectedDate }));
    setSelectedByStudent((current) => ({ ...current, [studentId]: current[studentId] ?? firstTemplateId }));
    setSelectedSessionByStudent((current) => ({ ...current, [studentId]: current[studentId] ?? "evening" }));
    setMessage("");
    setComposer({ mode: "create", studentId });
  }

  function openEditComposer(assignment: ChoreAssignmentForPlanner) {
    setSelectedByStudent((current) => ({ ...current, [assignment.studentId]: assignment.chore.id }));
    setSelectedDateByStudent((current) => ({ ...current, [assignment.studentId]: assignment.dueDate }));
    setSelectedSessionByStudent((current) => ({ ...current, [assignment.studentId]: assignment.dueSession as DaySession }));
    setMessage("");
    setComposer({ mode: "edit", studentId: assignment.studentId, assignmentId: assignment.id });
  }

  function closeComposer() {
    if (!workingId) {
      setComposer(null);
    }
  }

  async function submitComposer() {
    if (!composer) return;

    const studentId = composer.studentId;
    const choreId = selectedTemplate(studentId);
    const dueDate = selectedDueDate(studentId);
    const dueSession = selectedDueSession(studentId);
    if (!choreId || !dueDate) return;

    const requestKey = composer.mode === "edit" ? `edit-${composer.assignmentId}` : `assign-${studentId}`;
    setWorkingId(requestKey);
    setMessage("");

    const response = await fetch("/api/parent/chores/assign", {
      method: composer.mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignmentId: composer.assignmentId,
        choreId,
        studentId,
        dueDate,
        dueSession,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(
        data?.message ??
          (composer.mode === "edit"
            ? "Chưa cập nhật được việc. Mình thử lại sau nhé."
            : "Chưa giao được việc. Mình thử lại sau nhé."),
      );
      setWorkingId(null);
      return;
    }

    setWorkingId(null);
    setComposer(null);
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
          Ngày đang xem
        </label>
        <input
          id="chore-date"
          type="date"
          value={selectedDate}
          onChange={(event) => router.push(`/parent/chores?date=${event.target.value}`)}
          className="mt-2 h-12 rounded-2xl border-2 border-slate-200 px-4 font-bold text-slate-900"
        />
        <p className="mt-2 text-sm font-semibold text-slate-500">Khi bấm thêm hoặc sửa việc, ba mẹ sẽ điền ngày cần hoàn thành và buổi sáng, trưa hoặc tối trước khi lưu.</p>
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

              <div className="mt-4">
                <button
                  type="button"
                  disabled={!firstTemplateId}
                  onClick={() => openCreateComposer(student.id)}
                  className="h-12 rounded-2xl bg-indigo-700 px-5 font-black text-white shadow-md shadow-indigo-200 disabled:opacity-50"
                >
                  + Thêm việc mới
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
                            <div className="mt-2 space-y-1 text-xs font-bold text-slate-500">
                              <p>Giao việc: {new Date(assignment.createdAt).toLocaleString("vi-VN")} · {sessionLabel(sessionFromDateTime(assignment.createdAt))}</p>
                              <p>Cần xong: {assignment.dueDate} · {sessionLabel(assignment.dueSession)}</p>
                            </div>
                          </div>
                          {assignment.completion ? (
                            <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: reward?.color ?? "#64748b" }}>
                              ✅ {reward?.label ?? "Đã xong"}
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={workingId === `edit-${assignment.id}`}
                                onClick={() => openEditComposer(assignment)}
                                className="h-9 rounded-2xl bg-indigo-700 px-3 text-sm font-black text-white disabled:opacity-50"
                              >
                                Sửa
                              </button>
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

      {composingStudent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-black uppercase text-indigo-700">{composer?.mode === "edit" ? "Sửa việc đã giao" : "Giao việc mới"}</div>
                <h3 className="mt-1 text-2xl font-black text-slate-950">{composingStudent.displayName}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">Điền thời gian cần hoàn thành trước khi xác nhận lưu thay đổi.</p>
              </div>
              <button
                type="button"
                onClick={closeComposer}
                disabled={Boolean(workingId)}
                className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 disabled:opacity-50"
              >
                Đóng
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-black text-slate-700">Việc cần giao</span>
                <select
                  value={selectedTemplate(composingStudent.id)}
                  onChange={(event) => setSelectedByStudent((current) => ({ ...current, [composingStudent.id]: event.target.value }))}
                  className="mt-2 h-12 w-full rounded-2xl border-2 border-slate-200 px-4 font-bold text-slate-900"
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.icon} {template.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-slate-700">Ngày cần hoàn thành</span>
                <input
                  type="date"
                  value={selectedDueDate(composingStudent.id)}
                  onChange={(event) => setSelectedDateByStudent((current) => ({ ...current, [composingStudent.id]: event.target.value }))}
                  className="mt-2 h-12 w-full rounded-2xl border-2 border-slate-200 px-4 font-bold text-slate-900"
                />
              </label>

              <label className="block">
                <span className="text-sm font-black text-slate-700">Buổi cần xong</span>
                <select
                  value={selectedDueSession(composingStudent.id)}
                  onChange={(event) => setSelectedSessionByStudent((current) => ({ ...current, [composingStudent.id]: event.target.value as DaySession }))}
                  className="mt-2 h-12 w-full rounded-2xl border-2 border-slate-200 px-4 font-bold text-slate-900"
                >
                  {daySessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeComposer}
                disabled={Boolean(workingId)}
                className="h-11 rounded-2xl border-2 border-slate-200 px-4 font-black text-slate-700 disabled:opacity-50"
              >
                Huỷ
              </button>
              <button
                type="button"
                disabled={!firstTemplateId || workingId === (composer?.mode === "edit" ? `edit-${composer.assignmentId}` : `assign-${composingStudent.id}`)}
                onClick={() => void submitComposer()}
                className="h-11 rounded-2xl bg-indigo-700 px-5 font-black text-white shadow-md shadow-indigo-200 disabled:opacity-50"
              >
                {workingId === (composer?.mode === "edit" ? `edit-${composer.assignmentId}` : `assign-${composingStudent.id}`)
                  ? "Đang lưu..."
                  : composer?.mode === "edit"
                    ? "Lưu thay đổi"
                    : "Xác nhận giao việc"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
