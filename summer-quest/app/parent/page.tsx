import Link from "next/link";

import { MistakeReviewList } from "@/components/MistakeReviewList";
import { ParentResetDataPanel, type ResetDataCounts } from "@/components/ParentResetDataPanel";
import { ParentSummary } from "@/components/ParentSummary";
import { choreLevelRewards, recentDateCutoff, todayKey, type ChoreLevel } from "@/lib/habits";
import { requireParentAccess } from "@/lib/parent-access";
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
  await requireParentAccess();
  const today = todayKey();
  const readingCutoff = recentDateCutoff(7);
  const students = await prisma.student.findMany({ orderBy: { id: "asc" } });
  const pendingReviewCount = await prisma.lesson.count({ where: { approved: false } });

  type FlaggedReport = {
    id: string;
    reason: string;
    note: string;
    createdAt: string;
    questionText: string;
    correctAnswer: string;
    orderIndex: number;
    lessonId: string;
    lessonTitle: string;
    subjectEmoji: string;
    subjectLabel: string;
    studentName: string | null;
  };

  const flaggedReports = await prisma.$queryRaw<FlaggedReport[]>`
    SELECT
      qr.id, qr.reason, qr.note,
      strftime('%d/%m %H:%M', qr.createdAt)  AS createdAt,
      q.text                                  AS questionText,
      q.correctAnswer,
      q.orderIndex,
      l.id                                    AS lessonId,
      l.title                                 AS lessonTitle,
      subj.emoji                              AS subjectEmoji,
      subj.label                              AS subjectLabel,
      st.displayName                          AS studentName
    FROM "QuestionReport" qr
    INNER JOIN "Question" q    ON q.id    = qr.questionId
    INNER JOIN "Lesson"   l    ON l.id    = qr.lessonId
    INNER JOIN "Subject"  subj ON subj.id = l.subjectId
    LEFT  JOIN "Student"  st   ON st.id   = qr.studentId
    WHERE qr.resolved = false
    ORDER BY qr.createdAt DESC
    LIMIT 100
  `;
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
                {pendingReviewCount > 0 && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-sm text-indigo-700">{pendingReviewCount}</span>
                )}
                {flaggedReports.length > 0 && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-sm text-white">🚩 {flaggedReports.length}</span>
                )}
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

        {flaggedReports.length > 0 && (
          <section className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "#fff1f2", border: "2px solid #fecdd3" }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black" style={{ color: "#9f1239" }}>
                🚩 Câu hỏi bị báo cáo ({flaggedReports.length})
              </h2>
              <Link href="/parent/review" className="text-sm font-black" style={{ color: "#e11d48" }}>
                Xem &amp; xử lý tất cả →
              </Link>
            </div>
            <p className="mt-1 text-sm font-semibold" style={{ color: "#be123c" }}>
              Học sinh đánh dấu những câu này có vấn đề. Kiểm tra và nhấn "Đã xem & xử lý" để xóa khỏi danh sách.
            </p>
            <div className="mt-4 space-y-3">
              {flaggedReports.map((r) => {
                const reasonLabel: Record<string, string> = {
                  wrong_answer: "❌ Đáp án sai",
                  wrong_explanation: "📝 Giải thích sai",
                  other: "❓ Vấn đề khác",
                };
                return (
                  <div key={r.id} className="rounded-xl p-4" style={{ backgroundColor: "#ffffff" }}>
                    <div className="flex flex-wrap items-start gap-3">
                      <span className="shrink-0 rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: "#e11d48" }}>
                        {reasonLabel[r.reason] ?? r.reason}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "#64748b" }}>
                        {r.subjectEmoji} {r.subjectLabel} · {r.lessonTitle} · Câu {r.orderIndex}
                      </span>
                      <span className="text-xs" style={{ color: "#94a3b8" }}>
                        {r.studentName ?? "Phụ huynh"} · {r.createdAt}
                      </span>
                    </div>
                    <p className="mt-2 font-bold" style={{ color: "#1e293b" }}>{r.questionText}</p>
                    <p className="mt-1 text-sm font-semibold" style={{ color: "#64748b" }}>
                      Đáp án đang lưu: <span className="font-black text-slate-800">{r.correctAnswer}</span>
                    </p>
                    {r.note && (
                      <p className="mt-2 rounded-lg p-2 text-sm font-semibold" style={{ backgroundColor: "#fef9c3", color: "#713f12" }}>
                        "{r.note}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
