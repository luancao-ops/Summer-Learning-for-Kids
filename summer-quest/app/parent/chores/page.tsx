import Link from "next/link";

import { ParentChorePlanner } from "@/components/ParentChorePlanner";
import { todayKey } from "@/lib/habits";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ParentChoresPageProps = {
  searchParams: Promise<{ date?: string }>;
};

function normalizeDate(date?: string): string {
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayKey();
}

export default async function ParentChoresPage({ searchParams }: ParentChoresPageProps) {
  const { date } = await searchParams;
  const selectedDate = normalizeDate(date);

  const [students, templates, assignments] = await Promise.all([
    prisma.student.findMany({
      orderBy: { id: "asc" },
      select: { id: true, displayName: true },
    }),
    prisma.choreTemplate.findMany({ orderBy: { name: "asc" } }),
    prisma.choreAssignment.findMany({
      where: { assignedDate: selectedDate },
      orderBy: { createdAt: "asc" },
      include: { chore: true, completion: true },
    }),
  ]);

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
              <p className="mt-2 font-semibold text-slate-600">Chọn ngày, giao việc cho Yumi và Johnny, rồi theo dõi báo cáo sau khi các con hoàn thành.</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-900">{assignments.length} việc trong ngày</div>
          </div>
        </div>

        <ParentChorePlanner students={students} templates={templates} assignments={assignments} selectedDate={selectedDate} />
      </div>
    </main>
  );
}
