import { getLevel } from "@/lib/quiz";

export const ROBOT_TIER_NAMES = [
  "Robot Tập Sự",
  "Kỹ Sư Robo-X",
  "Chiến Binh X",
  "Chỉ Huy X",
  "Huyền Thoại X",
] as const;

export const PRINCESS_TIER_NAMES = [
  "Công Chúa Nhỏ",
  "Công Chúa Sáng Tạo",
  "Công Chúa Vương Quốc",
  "Nữ Hoàng",
  "Nữ Hoàng Huyền Thoại",
] as const;

export function getAvatarTier(level: number): 1 | 2 | 3 | 4 | 5 {
  if (level <= 5) return 1;
  if (level <= 10) return 2;
  if (level <= 15) return 3;
  if (level <= 20) return 4;
  return 5;
}

export function getAvatarTierName(xp: number, themeId: string): string {
  const tier = getAvatarTier(getLevel(xp).level);
  return themeId === "robot_sport_lab"
    ? ROBOT_TIER_NAMES[tier - 1]
    : PRINCESS_TIER_NAMES[tier - 1];
}
