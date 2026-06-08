import Link from "next/link";

import { ParentChorePlanner } from "@/components/ParentChorePlanner";
import { requireParentAccess } from "@/lib/parent-access";
import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/habits";

export const dynamic = "force-dynamic";

type ParentChoresPageProps = {
  searchParams: Promise<{ date?: string }>;
};

type PlannerTemplateRow = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type PlannerAssignmentRow = {
  id: string;
  studentId: string;
  assignedDate: string;
  dueDate: string | null;
  dueSession: string | null;
  createdAt: Date;
  choreId: string;
  choreName: string;
  choreIcon: string;
  choreDescription: string;
  completionId: string | null;
  completionLevel: string | null;
  completionDescription: string | null;
};

function normalizeDate(date?: string): string {
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayKey();
}

export default async function ParentChoresPage({ searchParams }: ParentChoresPageProps) {
  await requireParentAccess();
  const { date } = await searchParams;
  const selectedDate = normalizeDate(date);

  const [students, templates, assignmentRows] = await Promise.all([
    prisma.student.findMany({
      orderBy: { id: "asc" },
      select: { id: true, displayName: true },
    }),
    prisma.$queryRaw<PlannerTemplateRow[]>`
      SELECT id, name, icon, description
      FROM "ChoreTemplate"
      WHERE COALESCE(active, 1) = 1
      ORDER BY name ASC
    `,
    prisma.$queryRaw<PlannerAssignmentRow[]>`
      SELECT
        ca.id,
        ca.studentId,
        ca.assignedDate,
        ca.dueDate,
        ca.dueSession,
        ca.createdAt,
        ct.id AS choreId,
        ct.name AS choreName,
        ct.icon AS choreIcon,
        ct.description AS choreDescription,
        cc.id AS completionId,
        cc.level AS completionLevel,
        cc.description AS completionDescription
      FROM "ChoreAssignment" ca
      INNER JOIN "ChoreTemplate" ct ON ct.id = ca.choreId
      LEFT JOIN "ChoreCompletion" cc ON cc.assignmentId = ca.id
      WHERE COALESCE(ca.dueDate, ca.assignedDate) = ${selectedDate}
      ORDER BY ca.createdAt ASC
    `,
  ]);

  const assignments = assignmentRows.map((row) => ({
    id: row.id,
    studentId: row.studentId,
    assignedDate: row.assignedDate,
    dueDate: row.dueDate ?? row.assignedDate,
    dueSession: row.dueSession ?? "evening",
    createdAt: row.createdAt,
    chore: {
      id: row.choreId,
      name: row.choreName,
      icon: row.choreIcon,
      description: row.choreDescription,
    },
    completion: row.completionId
      ? {
          id: row.completionId,
          level: row.completionLevel ?? "okay",
          description: row.completionDescription ?? "",
        }
      : null,
  }));

  return (
    <main className="min-h-screen px-6 py-8" style={{ background: "linear-gradient(160deg, #f1f5f9 0%, #e8edf5 100%)" }}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <Link href="/parent" className="font-black text-indigo-700">
            ← Bảng phụ huynh
          </Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-black uppercase text-indigo-700">Habits Module</div>
              <h1 className="mt-2 text-4xl font-black text-slate-950">📋 Giao việc nhà</h1>
              <p className="mt-2 font-semibold text-slate-600">Chọn ngày cần hoàn thành, giao việc cho Yumi và Johnny, rồi theo dõi báo cáo sau khi các con hoàn thành.</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-900">{assignments.length} việc trong ngày</div>
          </div>
        </div>

        <ParentChorePlanner students={students} templates={templates} assignments={assignments} selectedDate={selectedDate} />
      </div>
    </main>
  );
}
