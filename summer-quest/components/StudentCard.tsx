import Link from "next/link";
import { getLevel } from "@/lib/quiz";
import { getTheme } from "@/lib/themes";
import { StudentAvatar } from "@/components/StudentAvatar";
import { getAvatarTierName } from "@/lib/avatar";

type StudentCardProps = {
  student: {
    id: string;
    displayName: string;
    currentGrade: number;
    nextGrade: number;
    themeId: string;
    xp: number;
    coins: number;
    streak: number;
    hasAccessCode?: boolean;
  };
};

export function StudentCard({ student }: StudentCardProps) {
  const theme = getTheme(student.themeId);
  const level = getLevel(student.xp);
  const tierName = getAvatarTierName(student.xp, student.themeId);

  // Secondary deco emojis shown inside the card hero panel
  const heroDeco = theme.decorations.slice(1, 4);

  return (
    <Link
      href={student.hasAccessCode ? `/student/${student.id}/unlock` : `/student/${student.id}`}
      className="group relative block overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-3"
      style={{
        boxShadow: `0 8px 32px ${theme.palette.primary}40, 0 2px 8px rgba(0,0,0,0.12)`,
        border: `2px solid ${theme.palette.primary}55`,
      }}
    >
      {/* ── Illustrated hero panel (Prodigy-style top zone) ──────────────── */}
      <div
        className="card-hero"
        style={{ background: theme.palette.cardHeroBg }}
      >
        {/* Floating deco emojis in the panel — positioned absolutely */}
        <div className="absolute inset-0 z-[1] pointer-events-none select-none" aria-hidden="true">
          <span
            className="absolute text-5xl opacity-30"
            style={{ top: "8%", right: "14%", transform: "rotate(12deg)" }}
          >
            {heroDeco[0]}
          </span>
          <span
            className="absolute text-3xl opacity-25"
            style={{ bottom: "20%", right: "5%", transform: "rotate(-8deg)" }}
          >
            {heroDeco[1]}
          </span>
          <span
            className="absolute text-4xl opacity-20"
            style={{ top: "40%", right: "35%", transform: "rotate(5deg)" }}
          >
            {heroDeco[2]}
          </span>
        </div>

        {/* Main character emoji + level badge */}
        <div className="relative z-[2] flex items-start justify-between">
          <div>
            {/* Tiered character avatar */}
            <div className="select-none drop-shadow-xl">
              <StudentAvatar xp={student.xp} themeId={student.themeId} size={96} />
            </div>

            {/* Level badge + tier name */}
            <span
              className="game-badge mt-2 inline-flex"
              style={{
                background: `linear-gradient(135deg, ${theme.palette.accent}, ${theme.palette.primary})`,
              }}
            >
              ⭐ Level {level.level}
            </span>
            <div
              className="mt-1 text-xs font-black text-white/90 text-center leading-tight"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
            >
              {tierName}
            </div>
          </div>

          {/* Theme name tag */}
          <div className="text-right">
            <div
              className="inline-block rounded-2xl px-3 py-1 text-xs font-black text-white/90 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.25)" }}
            >
              {theme.name}
            </div>
          </div>
        </div>
      </div>

      {/* ── Wave separator (CSS-only, no extra DOM) ───────────────────────── */}
      {/* Negative margin pulls the wave up to overlap the hero panel */}
      <div className="-mt-[1px] leading-none" aria-hidden="true">
        <svg
          viewBox="0 0 400 28"
          className="w-full"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <path
            d="M0,14 C80,28 160,0 240,14 C320,28 370,8 400,14 L400,28 L0,28 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ── Card body (white zone) ────────────────────────────────────────── */}
      <div className="px-5 pb-5" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
        <h2 className="text-2xl font-black" style={{ color: theme.palette.text }}>
          {student.displayName}
        </h2>
        <p className="mt-0.5 text-sm font-bold" style={{ color: theme.palette.primary }}>
          {theme.title}
        </p>
        <p className="text-sm font-semibold text-slate-500">
          Lớp {student.currentGrade} → lớp {student.nextGrade}
        </p>

        {/* XP bar */}
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
            <span>XP Level {level.level}</span>
            <span>
              {level.currentLevelXp}/{level.nextLevelXp}
            </span>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: theme.palette.primarySoft }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${level.percent}%`,
                background: `linear-gradient(90deg, ${theme.palette.primary}, ${theme.palette.accent})`,
                boxShadow: `0 0 8px ${theme.palette.primary}80`,
              }}
            />
          </div>
        </div>

        {/* Stat pills */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div
            className="rounded-2xl p-3"
            style={{ backgroundColor: theme.palette.primarySoft }}
          >
            <div className="text-xl font-black" style={{ color: theme.palette.primary }}>
              {student.xp}
            </div>
            <div className="text-xs font-bold opacity-70">XP</div>
          </div>
          <div
            className="rounded-2xl p-3"
            style={{ backgroundColor: theme.palette.accentSoft }}
          >
            <div className="text-xl font-black" style={{ color: theme.palette.accent }}>
              {student.coins}
            </div>
            <div className="text-xs font-bold opacity-70">xu</div>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3">
            <div className="text-xl font-black text-amber-600">
              {student.streak > 0 ? `🔥 ${student.streak}` : "🌱"}
            </div>
            <div className="text-xs font-bold opacity-70">ngày</div>
          </div>
        </div>

        {/* CTA button — full-width, Prodigy-style gradient with inner glow */}
        <div
          className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl font-black text-white shadow-lg transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.accent})`,
            boxShadow: `0 4px 16px ${theme.palette.primary}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
          }}
        >
          {student.hasAccessCode ? "🔒 Nhập mã để vào" : theme.id === "princess_craft_kingdom" ? "✨ Vào vương quốc" : "🚀 Vào lab"}
        </div>
      </div>
    </Link>
  );
}
