import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { StudentUnlockForm } from "@/components/StudentUnlockForm";
import { hasStudentAccess } from "@/lib/student-access";
import { getTheme, themeStyle } from "@/lib/themes";
import { prisma } from "@/lib/prisma";

type StudentUnlockPageProps = {
  params: Promise<{ studentId: string }>;
};

export default async function StudentUnlockPage({ params }: StudentUnlockPageProps) {
  const { studentId } = await params;
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      displayName: true,
      themeId: true,
      accessCodeHash: true,
    },
  });

  if (!student) notFound();

  if (!student.accessCodeHash || (await hasStudentAccess(student.id, student.accessCodeHash))) {
    redirect(`/student/${student.id}`);
  }

  const theme = getTheme(student.themeId);

  return (
    <main className="page-shell px-6 py-8" style={themeStyle(theme)}>
      <div className="deco-layer" aria-hidden="true">
        {theme.decorations.map((decoration, index) => (
          <span key={index}>{decoration}</span>
        ))}
      </div>

      <div className="page-content mx-auto flex min-h-[80vh] max-w-xl items-center">
        <section className="w-full rounded-2xl p-6 shadow-xl" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
          <Link href="/" className="font-black" style={{ color: theme.palette.primary }}>
            ← Chọn lại nhân vật
          </Link>
          <div className="mt-5 text-sm font-black uppercase tracking-wide" style={{ color: theme.palette.accent }}>
            Hồ sơ riêng
          </div>
          <h1 className="mt-2 text-4xl font-black" style={{ color: theme.palette.text }}>
            {theme.emoji} Xin chào {student.displayName}
          </h1>
          <p className="mt-3 font-semibold leading-7" style={{ color: "#475569" }}>
            Nhập mã ba mẹ đã đặt để vào đúng thế giới học tập của con.
          </p>
          <StudentUnlockForm
            studentId={student.id}
            displayName={student.displayName}
            primaryColor={theme.palette.primary}
            accentColor={theme.palette.accent}
          />
        </section>
      </div>
    </main>
  );
}
