import Link from "next/link";
import { notFound } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { requireStudentAccessOrRedirect } from "@/lib/student-access";
import { getTheme, themeStyle } from "@/lib/themes";
import { prisma } from "@/lib/prisma";

type LessonPageProps = {
  params: Promise<{ studentId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
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
      subject: true,
      questions: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!lesson) notFound();
  const theme = getTheme(student.themeId);
  const paragraphs = lesson.content.split("\n\n");

  return (
    <main className="page-shell px-6 py-8" style={themeStyle(theme)}>
      <div className="deco-layer" aria-hidden="true">
        {theme.decorations.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="page-content mx-auto max-w-4xl">
        <Link
          href={`/student/${student.id}/subject/${lesson.subject.id}`}
          className="font-black"
          style={{ color: theme.palette.primary }}
        >
          ← {lesson.subject.label}
        </Link>

        {/*
          Article card: explicit white background + explicit dark text.
          Do NOT rely on inherited --sq-text (dark purple) for body copy —
          use neutral slate tones so every line is readable regardless of
          which theme is active. Theme colours are used only for accents.
        */}
        <article
          className="mt-5 rounded-2xl p-6 shadow-md"
          style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}
        >
          {/* Subject / grade / phase tag */}
          <div className="text-sm font-black uppercase tracking-wide" style={{ color: theme.palette.accent }}>
            {lesson.subject.emoji} {lesson.subject.label} · Lớp {lesson.grade} ·{" "}
            {lesson.phase === "prep" ? "Chuẩn bị" : "Ôn tập"}
          </div>

          {/* Lesson title — theme text colour, always dark enough on white */}
          <h1 className="mt-3 text-4xl font-black leading-tight" style={{ color: theme.palette.text }}>
            {lesson.title}
          </h1>

          {/* Learning objective — use slate-700 (#334155) for comfortable reading */}
          <p className="mt-3 text-lg font-bold leading-8" style={{ color: "#334155" }}>
            {lesson.learningObjective}
          </p>

          {/* Story context box */}
          <div
            className="mt-6 rounded-xl p-4"
            style={{ backgroundColor: theme.palette.primarySoft }}
          >
            {/* Label: use theme primary which is dark enough on its soft bg */}
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: theme.palette.primary }}>
              Câu chuyện nhỏ
            </div>
            {/* Story text: explicit dark slate for maximum readability */}
            <p className="mt-1 text-lg font-bold" style={{ color: "#1e293b" }}>
              {lesson.storyContext}
            </p>
          </div>

          {/* Content paragraphs — white cards with a subtle border, dark text */}
          <div className="mt-6 space-y-3">
            {paragraphs.map((paragraph) => (
              <div
                key={paragraph}
                className="flex items-start gap-2 rounded-xl p-4"
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p className="flex-1 text-lg leading-8" style={{ color: "#1e293b" }}>
                  {paragraph}
                </p>
                {lesson.subject.id === "english" && (
                  <SpeakButton text={paragraph} />
                )}
              </div>
            ))}
          </div>

          {/* Quiz CTA banner */}
          <div
            className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
            style={{ backgroundColor: theme.palette.accentSoft }}
          >
            <div>
              <div className="font-black" style={{ color: "#1e293b" }}>
                Sẵn sàng làm quiz?
              </div>
              <p className="text-sm font-semibold" style={{ color: "#475569" }}>
                {lesson.questions.length} câu, không có đồng hồ đếm ngược.
              </p>
            </div>
            <Link
              href={`/student/${student.id}/lesson/${lesson.id}/quiz`}
              className="flex h-12 items-center rounded-xl px-5 font-black text-white shadow-md"
              style={{
                backgroundColor: theme.palette.accent,
                boxShadow: `0 4px 14px ${theme.palette.accent}55`,
              }}
            >
              Bắt đầu quiz
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
