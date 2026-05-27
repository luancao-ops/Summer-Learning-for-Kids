export type ChoreLevel = "great" | "okay" | "partial";

export const choreLevelRewards: Record<ChoreLevel, { xpEarned: number; coinsEarned: number; label: string; color: string }> = {
  great: { xpEarned: 10, coinsEarned: 5, label: "Làm tốt lắm", color: "#047857" },
  okay: { xpEarned: 5, coinsEarned: 3, label: "Được rồi", color: "#a16207" },
  partial: { xpEarned: 2, coinsEarned: 0, label: "Chưa xong hẳn", color: "#c2410c" },
};

export function todayKey(): string {
  return new Date().toLocaleDateString("sv");
}

export function previousDateKey(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return date.toLocaleDateString("sv");
}

export function recentDateCutoff(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days + 1);
  return date.toLocaleDateString("sv");
}
