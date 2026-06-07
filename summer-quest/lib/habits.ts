export type ChoreLevel = "great" | "okay" | "partial";
export type DaySession = "morning" | "afternoon" | "evening";

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

export const daySessions: { id: DaySession; label: string }[] = [
  { id: "morning", label: "Buổi sáng" },
  { id: "afternoon", label: "Buổi trưa" },
  { id: "evening", label: "Buổi tối" },
];

export function sessionLabel(session: DaySession | string): string {
  return daySessions.find((item) => item.id === session)?.label ?? "Chưa rõ";
}

export function sessionFromDateTime(value: Date | string): DaySession {
  const date = value instanceof Date ? value : new Date(value);
  const hour = date.getHours();

  if (hour < 11) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
