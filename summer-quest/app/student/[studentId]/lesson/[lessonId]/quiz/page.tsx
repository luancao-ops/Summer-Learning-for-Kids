import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizEngine } from "@/components/QuizEngine";
import type { QuestionType, QuizOption, QuizQuestion } from "@/lib/quiz";
import { requireStudentAccessOrRedirect } from "@/lib/student-access";
import { getTheme, themeStyle } from "@/lib/themes";
import { prisma } from "@/lib/prisma";

type QuizPageProps = {
  params: Promise<{ studentId: string; lessonId: string }>;
};

function parseOptions(options: string): QuizOption[] {
  try {
    return JSON.parse(options) as QuizOption[];
  } catch {
    return [];
  }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { studentId, lessonId } = await params;
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) notFound();
  await requireStudentAccessOrRedirect(student.id, student.accessCodeHash);

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      studentTarget: student.id,
      approved: true,
    },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!lesson) notFound();

  const theme = getTheme(student.themeId);
  const questions: QuizQuestion[] = lesson.questions.map((question) => ({
    id: question.id,
    type: question.type as QuestionType,
    text: question.text,
    options: parseOptions(question.options),
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    hint: question.hint,
  }));

  return (
    <main className="page-shell px-6 py-8" style={themeStyle(theme)}>
      <div className="deco-layer" aria-hidden="true">
        {theme.decorations.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="page-content mx-auto max-w-5xl">
        <Link href={`/student/${student.id}/lesson/${lesson.id}`} className="font-black" style={{ color: theme.palette.primary }}>
          ← Xem lại bài học
        </Link>
        <div className="mt-5">
          <QuizEngine studentId={student.id} lessonId={lesson.id} lessonTitle={lesson.title} questions={questions} theme={theme} />
        </div>
      </div>
    </main>
  );
}
