import Link from "next/link";
import { ContentReviewCard } from "@/components/ContentReviewCard";
import { ResolveReportButton } from "@/components/ResolveReportButton";
import { requireParentAccess } from "@/lib/parent-access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RawReport = {
  id: string;
  questionId: string;
  lessonId: string;
  studentId: string | null;
  reportedBy: string;
  reason: string;
  note: string;
  createdAt: string;
  questionText: string;
  correctAnswer: string;
  lessonTitle: string;
  subjectLabel: string;
  subjectEmoji: string;
  studentName: string | null;
};

const REASON_LABEL: Record<string, string> = {
  wrong_answer: "❌ Đáp án sai",
  wrong_explanation: "📝 Giải thích sai",
  other: "❓ Vấn đề khác",
};

export default async function ParentReviewPage() {
  await requireParentAccess();

  const [lessons, reports] = await Promise.all([
    prisma.lesson.findMany({
      where: { approved: false },
      orderBy: [{ createdAt: "desc" }, { orderIndex: "asc" }],
      include: {
        subject: true,
        questions: { orderBy: { orderIndex: "asc" } },
      },
    }),
    prisma.$queryRaw<RawReport[]>`
      SELECT
        qr.id, qr.questionId, qr.lessonId, qr.studentId,
        qr.reportedBy, qr.reason, qr.note,
        strftime('%d/%m/%Y %H:%M', qr.createdAt)  AS createdAt,
        q.text                                     AS questionText,
        q.correctAnswer,
        l.title                                    AS lessonTitle,
        subj.label                                 AS subjectLabel,
        subj.emoji                                 AS subjectEmoji,
        st.displayName                             AS studentName
      FROM "QuestionReport" qr
      INNER JOIN "Question" q    ON q.id    = qr.questionId
      INNER JOIN "Lesson"   l    ON l.id    = qr.lessonId
      INNER JOIN "Subject"  subj ON subj.id = l.subjectId
      LEFT  JOIN "Student"  st   ON st.id   = qr.studentId
      WHERE qr.resolved = false
      ORDER BY qr.createdAt DESC
      LIMIT 100
    `,
  ]);

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
            {lessons.length} bài đang chờ duyệt · {reports.length} câu hỏi bị báo cáo
          </p>
        </div>

        {/* ── Question reports ── */}
        {reports.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-2xl font-black text-rose-700">
              🚩 Câu hỏi bị báo cáo ({reports.length})
            </h2>
            <div className="space-y-3">
              {reports.map((r) => (
                <article key={r.id} className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-black text-white"
                          style={{ backgroundColor: "#e11d48" }}
                        >
                          {REASON_LABEL[r.reason] ?? r.reason}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {r.subjectEmoji} {r.subjectLabel} · {r.lessonTitle}
                        </span>
                        <span className="text-xs text-slate-400">
                          {r.studentName ? `${r.studentName}` : "Phụ huynh"} · {r.createdAt}
                        </span>
                      </div>
                      <p className="mt-2 font-bold text-slate-900">{r.questionText}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        Đáp án đúng đang lưu: <span className="font-black text-slate-700">{r.correctAnswer}</span>
                      </p>
                      {r.note && (
                        <p className="mt-2 rounded-[8px] p-3 text-sm font-semibold" style={{ backgroundColor: "#fef3c7", color: "#78350f" }}>
                          "{r.note}"
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      <ResolveReportButton reportId={r.id} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link
                      href={`/student/girl/lesson/${r.lessonId}/quiz`}
                      className="mr-2 text-xs font-black text-indigo-600 underline"
                    >
                      Xem quiz →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Unapproved lessons ── */}
        <section className="mt-6 space-y-4">
          <h2 className="mb-3 text-2xl font-black text-slate-800">
            📋 Bài chờ duyệt ({lessons.length})
          </h2>
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
