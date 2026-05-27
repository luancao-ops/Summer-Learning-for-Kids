import Link from "next/link";
import { notFound } from "next/navigation";
import { MistakeReviewList } from "@/components/MistakeReviewList";
import { requireStudentAccessOrRedirect } from "@/lib/student-access";
import { getTheme, themeStyle } from "@/lib/themes";
import { prisma } from "@/lib/prisma";

type StudentReviewPageProps = {
  params: Promise<{ studentId: string }>;
};

export default async function StudentReviewPage({ params }: StudentReviewPageProps) {
  const { studentId } = await params;
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) notFound();
  await requireStudentAccessOrRedirect(student.id, student.accessCodeHash);

  const theme = getTheme(student.themeId);
  const mistakes = await prisma.mistake.findMany({
    where: {
      studentId: student.id,
      resolved: false,
    },
    orderBy: { createdAt: "desc" },
    include: {
      question: true,
      lesson: {
        include: { subject: true },
      },
    },
  });

  return (
    <main className="page-shell px-6 py-8" style={themeStyle(theme)}>
      <div className="deco-layer" aria-hidden="true">
        {theme.decorations.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="page-content mx-auto max-w-5xl">
        <Link href={`/student/${student.id}`} className="font-black" style={{ color: theme.palette.primary }}>
          ← Quay lại Dashboard
        </Link>
        <div className="mt-5 rounded-[8px] p-6 shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
          <div className="text-sm font-black uppercase" style={{ color: theme.palette.accent }}>
            Ôn luyện nhẹ nhàng
          </div>
          <h1 className="mt-2 text-4xl font-black" style={{ color: theme.palette.text }}>
            📝 Câu cần ôn của {student.displayName}
          </h1>
          <p className="mt-2 font-semibold" style={{ color: theme.palette.muted }}>
            Những câu này được lưu lại để con thử lại khi sẵn sàng, không có áp lực thời gian.
          </p>
        </div>

        <section className="mt-6">
          <MistakeReviewList mistakes={mistakes} studentId={student.id} emptyMessage="Chưa có câu cần ôn! Bé đang làm rất tốt 🌟" />
        </section>
      </div>
    </main>
  );
}
