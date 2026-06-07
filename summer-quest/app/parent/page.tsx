import Link from "next/link";

import { MistakeReviewList } from "@/components/MistakeReviewList";
import { ParentResetDataPanel, type ResetDataCounts } from "@/components/ParentResetDataPanel";
import { ParentSummary } from "@/components/ParentSummary";
import { choreLevelRewards, recentDateCutoff, todayKey, type ChoreLevel } from "@/lib/habits";
import { prisma } from "@/lib/prisma";
import { subjectProgress } from "@/lib/progress";

export const dynamic = "force-dynamic";

type TodayChoreRow = {
  id: string;
  createdAt: Date;
  studentDisplayName: string;
  choreName: string;
  choreIcon: string;
  completionLevel: string | null;
  completionDescription: string | null;
};

export default async function ParentPage() {
  const today = todayKey();
  const readingCutoff = recentDateCutoff(7);
  const students = await prisma.student.findMany({ orderBy: { id: "asc" } });
  const pendingReviewCount = await prisma.lesson.count({ where: { approved: false } });
  const resetDataCounts: ResetDataCounts = {
    attempts: await prisma.attempt.count(),
    mistakes: await prisma.mistake.count(),
    choreAssignments: await prisma.choreAssignment.count(),
    readingEntries: await prisma.readingEntry.count(),
    studentBadges: await prisma.studentBadge.count(),
    studentRewards: await prisma.studentReward.count(),
  };

  const subjects = await prisma.subject.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      lessons: {
        include: {
          attempts: {
            orderBy: { completedAt: "desc" },
          },
        },
      },
    },
  });

  const recentAttempts = await prisma.attempt.findMany({
    orderBy: { completedAt: "desc" },
    take: 8,
    include: {
      student: true,
      lesson: {
        include: { subject: true },
      },
    },
  });

  const mistakes = await prisma.mistake.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      student: { select: { displayName: true } },
      question: true,
      lesson: {
        include: { subject: true },
      },
    },
  });

  const [todayChores, readingEntries] = await Promise.all([
    prisma.$queryRaw<TodayChoreRow[]>`
      SELECT
        ca.id,
        ca.createdAt,
        s.displayName AS studentDisplayName,
        ct.name AS choreName,
        ct.icon AS choreIcon,
        cc.level AS completionLevel,
        cc.description AS completionDescription
      FROM "ChoreAssignment" ca
      INNER JOIN "Student" s ON s.id = ca.studentId
      INNER JOIN "ChoreTemplate" ct ON ct.id = ca.choreId
      LEFT JOIN "ChoreCompletion" cc ON cc.assignmentId = ca.id
      WHERE COALESCE(ca.dueDate, ca.assignedDate) = ${today}
      ORDER BY ca.createdAt ASC
    `,
    prisma.readingEntry.findMany({
      where: { readDate: { gte: readingCutoff } },
      orderBy: [{ readDate: "desc" }, { createdAt: "desc" }],
      include: { student: { select: { displayName: true } } },
    }),
  ]);

  const weakAreas = mistakes.reduce<Record<string, number>>((acc, mistake) => {
    const key = `${mistake.lesson.subject.emoji} ${mistake.lesson.subject.label}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen px-6 py-8" style={{ background: "linear-gradient(160deg, #f1f5f9 0%, #e8edf5 100%)" }}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Link href="/" className="font-black text-indigo-700">
                ← Trang chọn học sinh
              </Link>
              <h1 className="mt-3 text-4xl font-black text-slate-950">Bảng theo dõi phụ huynh</h1>
              <p className="mt-2 font-semibold text-slate-600">Tổng quan tiến độ, câu cần ôn, và khu vực yếu gần đây.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/parent/settings" className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 px-5 font-black text-white shadow-lg shadow-slate-200">
                🔐 Cài mã cho bé
              </Link>
              <Link href="/parent/chores" className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-800 to-indigo-700 px-5 font-black text-white shadow-lg shadow-slate-200">
                📋 Giao việc nhà
              </Link>
              <Link href="/parent/review" className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 px-5 font-black text-white shadow-lg shadow-indigo-200">
                Duyệt nội dung
                <span className="rounded-full bg-white px-2 py-0.5 text-sm text-indigo-700">{pendingReviewCount}</span>
              </Link>
            </div>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-2">
          {students.map((student) => {
            const progress = subjects.map((subject) => {
              const lessons = subject.lessons
                .filter((lesson) => lesson.studentTarget === student.id && lesson.approved)
                .map((lesson) => ({
                  ...lesson,
                  attempts: lesson.attempts.filter((attempt) => attempt.studentId === student.id),
                }));
              const data = subjectProgress({ ...subject, lessons });
              return { label: subject.label, completed: data.completed, total: data.total, percent: data.percent };
            });

            return <ParentSummary key={student.id} student={student} progress={progress} />;
          })}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">🏠 Công việc nhà hôm nay</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
            {todayChores.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {todayChores.map((assignment) => {
                  const level = assignment.completionLevel as ChoreLevel | undefined;
                  const reward = level ? choreLevelRewards[level] : null;

                  return (
                    <div key={assignment.id} className="grid gap-3 p-4 md:grid-cols-[140px_1fr_160px_1.4fr]">
                      <div className="font-black text-slate-900">{assignment.studentDisplayName}</div>
                      <div className="font-bold text-slate-700">
                        {assignment.choreIcon} {assignment.choreName}
                      </div>
                      <div>
                        <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: reward?.color ?? "#64748b" }}>
                          {assignment.completionLevel ? reward?.label ?? "Đã xong" : "Chưa làm"}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-600">{assignment.completionDescription ?? "Chưa có báo cáo."}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="p-4 text-sm font-semibold text-slate-500">Chưa có việc nhà nào được giao hôm nay.</p>
            )}
          </div>
        </section>

        {readingEntries.length > 0 ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black">📚 Nhật ký đọc sách (7 ngày gần nhất)</h2>
            <div className="mt-4 space-y-3">
              {readingEntries.map((entry) => (
                <details key={entry.id} className="rounded-2xl bg-slate-50 p-4">
                  <summary className="cursor-pointer font-black text-slate-950">
                    {entry.readDate} · {entry.student.displayName} · {entry.bookTitle}
                    {entry.pagesRead > 0 ? ` (${entry.pagesRead} trang)` : ""}
                  </summary>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white p-3 text-sm leading-6 text-slate-700">
                      <div className="font-black text-slate-900">Tóm tắt</div>
                      {entry.summary}
                    </div>
                    <div className="rounded-2xl bg-white p-3 text-sm leading-6 text-slate-700">
                      <div className="font-black text-slate-900">Cảm nhận</div>
                      {entry.feelings}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black">Lần làm bài gần đây</h2>
            <div className="mt-4 space-y-3">
              {recentAttempts.length > 0 ? (
                recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="rounded-2xl bg-slate-50 p-3">
                    <div className="font-black">
                      {attempt.student.displayName} · {attempt.lesson.subject.emoji} {attempt.lesson.title}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-600">
                      {attempt.score}/{attempt.totalQuestions} câu · {attempt.percentage}% · +{attempt.xpEarned} XP · +{attempt.coinsEarned} xu
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate-500">Chưa có lần làm bài nào.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black">Khu vực cần hỗ trợ</h2>
            <div className="mt-4 space-y-3">
              {Object.entries(weakAreas).length > 0 ? (
                Object.entries(weakAreas).map(([label, count]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-orange-50 p-3 font-black text-orange-950">
                    <span>{label}</span>
                    <span>{count} câu</span>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate-500">Chưa có dữ liệu câu cần ôn.</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-black">Câu cần ôn gần đây</h2>
          <MistakeReviewList mistakes={mistakes} showStudentName={true} />
        </section>

        <ParentResetDataPanel counts={resetDataCounts} />
      </div>
    </main>
  );
}
