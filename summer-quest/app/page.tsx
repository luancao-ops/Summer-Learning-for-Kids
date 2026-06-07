import Link from "next/link";
import { StudentCard } from "@/components/StudentCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ── Home-screen background: blends princess-purple (left) + robot-blue (right)
// Top layer: sparkle dot star-field (two offset grids)
// Mid layers: atmospheric glow blobs for each theme
// Base: warm purple-to-blue gradient
const HOME_BG = [
  "radial-gradient(circle, rgba(255,255,255,0.80) 1px, transparent 1px) 0 0 / 44px 44px",
  "radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px) 0 0 / 22px 22px",
  "radial-gradient(ellipse 70% 65% at 15% 25%,  rgba(167,139,250,0.55) 0%, transparent 60%)",
  "radial-gradient(ellipse 65% 55% at 85% 60%,  rgba(59,130,246,0.50)  0%, transparent 60%)",
  "radial-gradient(ellipse 50% 40% at 55% 10%,  rgba(249,168,212,0.32) 0%, transparent 50%)",
  "radial-gradient(ellipse 45% 35% at 50% 90%,  rgba(6,182,212,0.28)   0%, transparent 50%)",
  "linear-gradient(135deg, #f5eeff 0%, #eef2ff 40%, #dbeafe 100%)",
].join(", ");

// Mixed decorations: princess on the left, robot on the right
const HOME_DECO = ["✨", "🤖", "👑", "⚙️", "🌸", "🔵", "🌟", "🔧", "🦋", "🚀"];

export default async function Home() {
  const students = await prisma.student.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      displayName: true,
      currentGrade: true,
      nextGrade: true,
      themeId: true,
      xp: true,
      coins: true,
      streak: true,
      accessCodeHash: true,
    },
  });

  return (
    <main
      className="relative min-h-screen px-6 py-10"
      style={{ background: HOME_BG, backgroundAttachment: "fixed" }}
    >
      {/* Floating decorations */}
      <div className="deco-layer" aria-hidden="true">
        {HOME_DECO.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="page-content mx-auto max-w-6xl">
        {/* ── Hero header ────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-black text-white shadow-md"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
              🌟 Summer Quest
            </div>
            <h1 className="mt-3 text-5xl font-black text-slate-900 drop-shadow-sm">
              Chọn nhân vật học hôm nay
            </h1>
            <p className="mt-3 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
              Mỗi bé có một thế giới học tập riêng — nhiệm vụ vui, phần thưởng bất ngờ,
              tiến độ lưu trên máy gia đình.
            </p>
          </div>

          <Link
            href="/parent"
            className="flex h-12 items-center rounded-2xl px-5 font-black text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
              boxShadow: "0 4px 16px rgba(109,40,217,0.40), inset 0 1px 0 rgba(255,255,255,0.20)",
            }}
          >
            👨‍👩‍👧‍👦 Bảng phụ huynh
          </Link>
        </div>

        {/* ── Student cards ───────────────────────────────────────────────── */}
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {students.map(({ accessCodeHash, ...student }) => (
            <StudentCard key={student.id} student={{ ...student, hasAccessCode: Boolean(accessCodeHash) }} />
          ))}
        </div>

        {students.length === 0 ? (
          <div
            className="mt-10 rounded-3xl p-8 text-center shadow-sm backdrop-blur-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.80)", color: "#1e1b4b" }}
          >
            <h2 className="text-2xl font-black">Chưa có dữ liệu học sinh</h2>
            <p className="mt-2 text-slate-600">Chạy migration và seed database trước khi dùng app.</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
