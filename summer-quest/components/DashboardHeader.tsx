import Link from "next/link";
import { StudentLockButton } from "@/components/StudentLockButton";
import { getLevel } from "@/lib/quiz";
import type { AppTheme } from "@/lib/themes";

type DashboardHeaderProps = {
  student: {
    id: string;
    displayName: string;
    currentGrade: number;
    nextGrade: number;
    xp: number;
    coins: number;
    streak: number;
    readingStreak?: number;
    hasAccessCode?: boolean;
  };
  theme: AppTheme;
};

export function DashboardHeader({ student, theme }: DashboardHeaderProps) {
  const level = getLevel(student.xp);

  return (
    <header
      className="relative overflow-hidden rounded-3xl shadow-xl"
      style={{
        background: theme.palette.headerBg,
        boxShadow: `0 8px 40px ${theme.palette.primary}50, 0 2px 12px rgba(0,0,0,0.15)`,
      }}
    >
      {/* Sparkle dot star-field overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px), " +
            "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "36px 36px, 18px 18px",
          backgroundPosition: "0 0, 9px 9px",
        }}
      />

      {/* Ambient top-centre glow */}
      <div
        className="pointer-events-none absolute -top-16 left-1/4 h-56 w-1/2"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.20) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {/* Theme label */}
            <div
              className="text-sm font-black uppercase tracking-widest"
              style={{ color: theme.palette.accentSoft }}
            >
              {theme.name}
            </div>

            {/* Player name + big emoji */}
            <h1 className="mt-2 text-4xl font-black text-white drop-shadow-md">
              {theme.emoji} {student.displayName}
            </h1>

            <p className="mt-1 text-base font-bold text-white/70">
              {theme.title} · Lớp {student.currentGrade} ôn tập, chuẩn bị lớp {student.nextGrade}
            </p>
          </div>

          {/* Nav buttons */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="flex h-10 items-center rounded-2xl px-4 text-sm font-black text-white/90 backdrop-blur-sm transition hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Trang chủ
            </Link>
            <Link
              href="/parent"
              className="flex h-10 items-center rounded-2xl px-4 text-sm font-black text-white/90 backdrop-blur-sm transition hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Phụ huynh
            </Link>
            {student.hasAccessCode ? <StudentLockButton studentId={student.id} /> : null}
          </div>
        </div>

        {/* Stats row */}
        <div className={student.readingStreak && student.readingStreak > 0 ? "mt-5 grid gap-3 md:grid-cols-[1fr_120px_120px_120px]" : "mt-5 grid gap-3 md:grid-cols-[1fr_120px_120px]"}>
          {/* XP progress bar */}
          <div>
            <div className="mb-2 flex justify-between text-sm font-bold text-white/85">
              <span>⭐ Level {level.level}</span>
              <span>
                {level.currentLevelXp} / {level.nextLevelXp} XP
              </span>
            </div>
            <div
              className="h-5 overflow-hidden rounded-full"
              style={{ background: "rgba(0,0,0,0.30)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${level.percent}%`,
                  background: `linear-gradient(90deg, ${theme.palette.accent}, rgba(255,255,255,0.85))`,
                  boxShadow: `0 0 12px ${theme.palette.accent}90`,
                }}
              />
            </div>
          </div>

          {/* Coins */}
          <div
            className="rounded-2xl p-3 text-center backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <div className="text-2xl font-black text-white">{student.coins}</div>
            <div className="text-xs font-bold text-white/65">🪙 xu</div>
          </div>

          {/* Streak */}
          <div
            className="rounded-2xl p-3 text-center backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <div className="text-2xl font-black text-white">
              {student.streak > 0 ? `🔥 ${student.streak}` : "🌱"}
            </div>
            <div className="text-xs font-bold text-white/65">streak</div>
          </div>

          {student.readingStreak && student.readingStreak > 0 ? (
            <div
              className="rounded-2xl p-3 text-center backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <div className="text-2xl font-black text-white">📚🔥 {student.readingStreak}</div>
              <div className="text-xs font-bold text-white/65">đọc sách</div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
