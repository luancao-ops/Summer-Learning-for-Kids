import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonCard } from "@/components/LessonCard";
import { latestAttempt } from "@/lib/progress";
import { getLessonStatus } from "@/lib/quiz";
import { requireStudentAccessOrRedirect } from "@/lib/student-access";
import { getTheme, themeStyle } from "@/lib/themes";
import { prisma } from "@/lib/prisma";

type SubjectPageProps = {
  params: Promise<{ studentId: string; subject: string }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { studentId, subject: subjectId } = await params;
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) notFound();
  await requireStudentAccessOrRedirect(student.id, student.accessCodeHash);

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
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
  });

  if (!subject) notFound();

  const theme = getTheme(student.themeId);

  return (
    <main className="page-shell px-6 py-8" style={themeStyle(theme)}>
      <div className="deco-layer" aria-hidden="true">
        {theme.decorations.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="page-content mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={`/student/${student.id}`} className="font-black" style={{ color: theme.palette.primary }}>
              ← Dashboard
            </Link>
            <h1 className="mt-3 text-4xl font-black">
              {subject.emoji} {subject.label}
            </h1>
            <p className="mt-2 font-semibold text-slate-600">Chọn bài học, làm quiz, rồi quay lại khi cần ôn thêm.</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {subject.lessons.map((lesson) => {
            const attempt = latestAttempt(lesson);
            return (
              <LessonCard
                key={lesson.id}
                studentId={student.id}
                lesson={lesson}
                status={getLessonStatus(attempt?.percentage)}
                latestPercentage={attempt?.percentage}
                theme={theme}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
