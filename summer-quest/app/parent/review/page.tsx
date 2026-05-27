import Link from "next/link";
import { ContentReviewCard } from "@/components/ContentReviewCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ParentReviewPage() {
  const lessons = await prisma.lesson.findMany({
    where: { approved: false },
    orderBy: [{ createdAt: "desc" }, { orderIndex: "asc" }],
    include: {
      subject: true,
      questions: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  return (
    <main className="min-h-screen px-6 py-8" style={{ background: "linear-gradient(160deg, #f1f5f9 0%, #e8edf5 100%)" }}>
      <div className="mx-auto max-w-5xl">
        <Link href="/parent" className="font-black text-indigo-700">
          ← Bảng phụ huynh
        </Link>
        <div className="mt-5 rounded-2xl bg-white p-6 shadow-md">
          <div className="text-sm font-black uppercase text-indigo-700">AI Content Review</div>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Duyệt nội dung học tập</h1>
          <p className="mt-2 font-semibold text-slate-600">
            {lessons.length} bài đang chờ duyệt. Bài chưa duyệt sẽ không hiển thị cho bé.
          </p>
        </div>

        <section className="mt-6 space-y-4">
          {lessons.length > 0 ? (
            lessons.map((lesson) => <ContentReviewCard key={lesson.id} lesson={lesson} />)
          ) : (
            <p className="rounded-2xl bg-emerald-50 p-5 font-bold text-emerald-900">Không có bài nào chờ duyệt.</p>
          )}
        </section>
      </div>
    </main>
  );
}
