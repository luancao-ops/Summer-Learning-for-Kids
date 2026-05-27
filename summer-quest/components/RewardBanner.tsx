import type { AppTheme } from "@/lib/themes";

type RewardBannerProps = {
  theme: AppTheme;
  title: string;
  subtitle: string;
};

export function RewardBanner({ theme, title, subtitle }: RewardBannerProps) {
  return (
    <div className="rounded-[8px] p-6 text-center" style={{ backgroundColor: theme.palette.primarySoft, color: theme.palette.text }}>
      <div className="text-5xl">{theme.emoji}</div>
      <h2 className="mt-3 text-3xl font-black">{title}</h2>
      <p className="mt-2 text-lg font-bold">{subtitle}</p>
    </div>
  );
}
