import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeList } from "@/components/BadgeList";
import { ChoreChecklist } from "@/components/ChoreChecklist";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ReadingLogCard } from "@/components/ReadingLogCard";
import { SubjectCard } from "@/components/SubjectCard";
import { todayKey } from "@/lib/habits";
import { latestAttempt, subjectProgress } from "@/lib/progress";
import { getLessonStatus } from "@/lib/quiz";
import { requireStudentAccessOrRedirect } from "@/lib/student-access";
import { getTheme, themeStyle } from "@/lib/themes";
import { prisma } from "@/lib/prisma";

type StudentPageProps = {
  params: Promise<{ studentId: string }>;
};

type StudentChoreRow = {
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
  completionCompletedAt: Date | null;
};

export default async function StudentPage({ params }: StudentPageProps) {
  const { studentId } = await params;
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      studentBadges: {
        orderBy: { earnedAt: "desc" },
        take: 6,
        include: { badge: true },
      },
      studentRewards: {
        orderBy: { unlockedAt: "desc" },
        include: { reward: true },
      },
    },
  });

  if (!student) notFound();
  await requireStudentAccessOrRedirect(student.id, student.accessCodeHash);

  const unresolvedMistakes = await prisma.mistake.count({
    where: { studentId: student.id, resolved: false },
  });

  const today = todayKey();
  const theme = getTheme(student.themeId);
  const [subjects, choreAssignments, todayReadingEntry] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        lessons: {
          where: {
            studentTarget: student.id,
            approved: true,
          },
          orderBy: [{ phase: "desc" }, { orderIndex: "asc" }],
          include: {
            attempts: {
              where: { studentId: student.id },
              orderBy: { completedAt: "desc" },
            },
          },
        },
      },
    }),
    prisma.$queryRaw<StudentChoreRow[]>`
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
        cc.description AS completionDescription,
        cc.completedAt AS completionCompletedAt
      FROM "ChoreAssignment" ca
      INNER JOIN "ChoreTemplate" ct ON ct.id = ca.choreId
      LEFT JOIN "ChoreCompletion" cc ON cc.assignmentId = ca.id
      WHERE ca.studentId = ${student.id}
        AND COALESCE(ca.dueDate, ca.assignedDate) = ${today}
      ORDER BY ca.createdAt ASC
    `,
    prisma.readingEntry.findFirst({
      where: { studentId: student.id, readDate: today },
    }),
  ]);

  const mappedChoreAssignments = choreAssignments.map((assignment) => ({
    id: assignment.id,
    studentId: assignment.studentId,
    assignedDate: assignment.assignedDate,
    dueDate: assignment.dueDate ?? assignment.assignedDate,
    dueSession: assignment.dueSession ?? "evening",
    createdAt: assignment.createdAt,
    chore: {
      id: assignment.choreId,
      name: assignment.choreName,
      icon: assignment.choreIcon,
      description: assignment.choreDescription,
    },
    completion: assignment.completionId
      ? {
          id: assignment.completionId,
          assignmentId: assignment.id,
          level: assignment.completionLevel ?? "okay",
          description: assignment.completionDescription ?? "",
          completedAt: assignment.completionCompletedAt ?? assignment.createdAt,
        }
      : null,
  }));

  const nextLesson = subjects
    .flatMap((subject) => subject.lessons.map((lesson) => ({ lesson, subject })))
    .sort((a, b) => a.subject.orderIndex - b.subject.orderIndex || b.lesson.phase.localeCompare(a.lesson.phase) || a.lesson.orderIndex - b.lesson.orderIndex)
    .find(({ lesson }) => getLessonStatus(latestAttempt(lesson)?.percentage) !== "completed");

  const missions = [
    nextLesson ? `Hoàn thành 1 bài ${nextLesson.subject.label}: ${nextLesson.lesson.title}` : "Ôn lại một bài con thích",
    "Đạt 80% trở lên trong một quiz bất kỳ",
    student.streak > 0 ? `Giữ streak ${student.streak + 1} ngày` : "Bắt đầu streak ngày đầu tiên",
  ];

  return (
    <main className="page-shell px-6 py-8" style={themeStyle(theme)}>
      {/* Floating themed decorations */}
      <div className="deco-layer" aria-hidden="true">
        {theme.decorations.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="page-content mx-auto max-w-6xl space-y-6">
        <DashboardHeader student={{ ...student, hasAccessCode: Boolean(student.accessCodeHash) }} theme={theme} />

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl p-5 shadow-md" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
            <h2 className="text-2xl font-black">Nhiệm vụ hôm nay</h2>
            <div className="mt-4 space-y-3">
              {missions.map((mission, index) => (
                <div key={mission} className="flex min-h-12 items-center gap-3 rounded-[8px] p-3" style={{ backgroundColor: index === 0 ? theme.palette.primarySoft : "#f8fafc" }}>
                  <span className="text-xl">{index === 0 ? "🎯" : "⬜"}</span>
                  <span className="font-bold">{mission}</span>
                </div>
              ))}
            </div>
            {nextLesson ? (
              <Link href={`/student/${student.id}/lesson/${nextLesson.lesson.id}`} className="mt-5 inline-flex h-12 items-center rounded-[8px] px-5 font-black text-white" style={{ backgroundColor: theme.palette.primary }}>
                Tiếp tục học
              </Link>
            ) : null}
            <Link href={`/student/${student.id}/review`} className="ml-3 mt-5 inline-flex h-12 items-center rounded-[8px] px-5 font-black text-white" style={{ backgroundColor: theme.palette.accent }}>
              📝 Ôn câu sai
              {unresolvedMistakes > 0 ? (
                <span className="ml-2 rounded-full bg-white/30 px-2 py-0.5 text-xs font-black">
                  {unresolvedMistakes}
                </span>
              ) : null}
            </Link>
          </div>

          <div className="rounded-2xl p-5 shadow-md" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
            <h2 className="text-2xl font-black">Phần thưởng mở khóa</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {student.studentRewards.length > 0 ? (
                student.studentRewards.map((item) => (
                  <div key={item.id} className="rounded-[8px] p-3 text-center" style={{ backgroundColor: theme.palette.accentSoft }}>
                    <div className="text-3xl">{item.reward.icon}</div>
                    <div className="mt-1 text-sm font-black">{item.reward.name}</div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-sm font-bold text-slate-500">Hoàn thành bài đầu tiên để mở phần thưởng đầu tiên.</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-2xl font-black">🏠 Công việc nhà hôm nay</h2>
            {(() => {
              const done = mappedChoreAssignments.filter((assignment) => assignment.completion).length;
              const total = mappedChoreAssignments.length;

              return (
                <span className="rounded-full px-3 py-1 text-sm font-black text-white" style={{ backgroundColor: total > 0 && done === total ? "#047857" : "#64748b" }}>
                  {done}/{total} việc
                </span>
              );
            })()}
          </div>
          {mappedChoreAssignments.length > 0 ? (
            <ChoreChecklist studentId={student.id} assignments={mappedChoreAssignments} theme={theme} />
          ) : (
            <p className="rounded-2xl p-4 text-sm font-bold shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
              Hôm nay chưa có việc nhà được giao. Con có thể hỏi ba mẹ xem mình giúp gì nhé.
            </p>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-black">📚 Đọc sách hôm nay</h2>
          <ReadingLogCard studentId={student.id} existingEntry={todayReadingEntry} theme={theme} />
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-black">Môn học</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {subjects.map((subject) => {
              const progress = subjectProgress(subject);
              return <SubjectCard key={subject.id} studentId={student.id} subject={subject} theme={theme} {...progress} />;
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-black">Huy hiệu</h2>
          <BadgeList badges={student.studentBadges.map((entry) => entry.badge)} />
        </section>
      </div>
    </main>
  );
}
