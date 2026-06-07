"use client";

import { getLevel } from "@/lib/quiz";
import {
  getAvatarTier,
  getAvatarTierName,
  ROBOT_TIER_NAMES,
  PRINCESS_TIER_NAMES,
} from "@/lib/avatar";
export { getAvatarTier, getAvatarTierName, ROBOT_TIER_NAMES, PRINCESS_TIER_NAMES };

export interface StudentAvatarProps {
  xp: number;
  themeId: string;
  size?: number;
  showTierName?: boolean;
}

// ── Robot Tier 1 — Gray Basic "Robot Tập Sự" ─────────────────────────────────

function RobotT1({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <circle cx="50" cy="50" r="44" fill="#f3f4f6" />
      {/* antenna */}
      <rect x="47" y="9" width="6" height="10" rx="3" fill="#6b7280" />
      <circle cx="50" cy="8" r="5" fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />
      {/* head */}
      <rect x="27" y="19" width="46" height="33" rx="8" fill="#d1d5db" />
      <rect x="29" y="21" width="42" height="29" rx="7" fill="#e5e7eb" />
      {/* eyes */}
      <circle cx="39" cy="33" r="7" fill="white" stroke="#9ca3af" strokeWidth="1" />
      <circle cx="61" cy="33" r="7" fill="white" stroke="#9ca3af" strokeWidth="1" />
      <circle cx="39" cy="33" r="4" fill="#374151" />
      <circle cx="61" cy="33" r="4" fill="#374151" />
      <circle cx="40.5" cy="31.5" r="1.5" fill="white" />
      <circle cx="62.5" cy="31.5" r="1.5" fill="white" />
      {/* mouth */}
      <rect x="37" y="44" width="26" height="4" rx="2" fill="#9ca3af" />
      {/* body */}
      <rect x="25" y="54" width="50" height="28" rx="8" fill="#d1d5db" />
      <rect x="28" y="57" width="44" height="22" rx="6" fill="#e5e7eb" />
      <rect x="36" y="62" width="28" height="11" rx="3" fill="#d1d5db" />
      {/* legs */}
      <rect x="29" y="82" width="16" height="12" rx="4" fill="#d1d5db" />
      <rect x="55" y="82" width="16" height="12" rx="4" fill="#d1d5db" />
      {/* arms */}
      <rect x="12" y="56" width="12" height="20" rx="6" fill="#d1d5db" />
      <rect x="76" y="56" width="12" height="20" rx="6" fill="#d1d5db" />
    </svg>
  );
}

// ── Robot Tier 2 — Blue/Orange "Kỹ Sư Robo-X" ────────────────────────────────

function RobotT2({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <circle cx="50" cy="50" r="44" fill="#eff6ff" />
      {/* antenna orange */}
      <rect x="47" y="9" width="6" height="10" rx="3" fill="#f97316" />
      <circle cx="50" cy="8" r="5" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
      {/* head */}
      <rect x="27" y="19" width="46" height="33" rx="8" fill="#2563eb" />
      <rect x="29" y="21" width="42" height="29" rx="7" fill="#3b82f6" />
      {/* orange visor */}
      <rect x="31" y="27" width="38" height="12" rx="4" fill="#1d4ed8" />
      <rect x="33" y="29" width="34" height="8" rx="3" fill="#f97316" />
      <circle cx="41" cy="33" r="4" fill="#fed7aa" />
      <circle cx="59" cy="33" r="4" fill="#fed7aa" />
      {/* mouth */}
      <rect x="37" y="44" width="26" height="4" rx="2" fill="#f97316" />
      {/* body */}
      <rect x="25" y="54" width="50" height="28" rx="8" fill="#2563eb" />
      <rect x="28" y="57" width="44" height="22" rx="6" fill="#3b82f6" />
      {/* orange chest stripe */}
      <rect x="28" y="63" width="44" height="5" rx="2" fill="#f97316" />
      {/* gear emblem */}
      <circle cx="50" cy="72" r="5.5" fill="#1d4ed8" />
      <circle cx="50" cy="72" r="3" fill="#f97316" />
      {/* legs */}
      <rect x="29" y="82" width="16" height="12" rx="4" fill="#2563eb" />
      <rect x="55" y="82" width="16" height="12" rx="4" fill="#2563eb" />
      {/* arms */}
      <rect x="12" y="56" width="12" height="20" rx="6" fill="#2563eb" />
      <rect x="14" y="67" width="8" height="4" rx="2" fill="#f97316" />
      <rect x="76" y="56" width="12" height="20" rx="6" fill="#2563eb" />
    </svg>
  );
}

// ── Robot Tier 3 — Dark Blue/Cyan Warrior "Chiến Binh X" ─────────────────────

function RobotT3({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <circle cx="50" cy="50" r="44" fill="#ecfeff" />
      {/* ear guards */}
      <rect x="19" y="23" width="10" height="18" rx="3" fill="#1e3a8a" />
      <rect x="71" y="23" width="10" height="18" rx="3" fill="#1e3a8a" />
      {/* antenna double bar */}
      <rect x="44" y="10" width="12" height="5" rx="2" fill="#0e7490" />
      <rect x="48" y="10" width="4" height="10" rx="2" fill="#06b6d4" />
      {/* head angular */}
      <path d="M27,52 L27,20 Q27,17 30,17 L70,17 Q73,17 73,20 L73,52 Z" fill="#1e3a8a" />
      <path d="M29,50 L29,22 Q29,19 32,19 L68,19 Q71,19 71,22 L71,50 Z" fill="#1e40af" />
      {/* glowing cyan visor */}
      <rect x="31" y="27" width="38" height="13" rx="4" fill="#0e7490" />
      <rect x="33" y="29" width="34" height="9" rx="3" fill="#06b6d4" />
      <rect x="35" y="31" width="30" height="5" rx="2" fill="#a5f3fc" />
      {/* angular mouth */}
      <path d="M37,46 L63,46 L61,51 L39,51 Z" fill="#0e7490" />
      <path d="M39,47 L61,47 L59.5,50 L40.5,50 Z" fill="#22d3ee" opacity="0.7" />
      {/* body */}
      <rect x="23" y="53" width="54" height="28" rx="5" fill="#1e3a8a" />
      <rect x="26" y="56" width="48" height="22" rx="4" fill="#1e40af" />
      {/* X on chest */}
      <line x1="37" y1="59" x2="50" y2="74" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="59" x2="37" y2="74" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
      {/* energy bars */}
      <rect x="56" y="61" width="12" height="3" rx="1.5" fill="#06b6d4" opacity="0.9" />
      <rect x="56" y="67" width="9" height="3" rx="1.5" fill="#06b6d4" opacity="0.7" />
      <rect x="56" y="73" width="6" height="3" rx="1.5" fill="#06b6d4" opacity="0.5" />
      {/* legs */}
      <rect x="27" y="81" width="18" height="12" rx="4" fill="#1e3a8a" />
      <rect x="55" y="81" width="18" height="12" rx="4" fill="#1e3a8a" />
      <rect x="28" y="85" width="16" height="3" rx="1.5" fill="#06b6d4" opacity="0.7" />
      <rect x="56" y="85" width="16" height="3" rx="1.5" fill="#06b6d4" opacity="0.7" />
      {/* arms with spike */}
      <rect x="11" y="55" width="11" height="22" rx="5" fill="#1e3a8a" />
      <polygon points="11,59 6,63 11,67" fill="#06b6d4" />
      <rect x="78" y="55" width="11" height="22" rx="5" fill="#1e3a8a" />
      <polygon points="89,59 94,63 89,67" fill="#06b6d4" />
    </svg>
  );
}

// ── Robot Tier 4 — Navy/Gold Commander "Chỉ Huy X" ───────────────────────────

function RobotT4({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <circle cx="50" cy="50" r="44" fill="#fefce8" />
      {/* shoulder pads */}
      <ellipse cx="18" cy="63" rx="10" ry="8" fill="#0f172a" />
      <path d="M10,59 Q18,52 26,59" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      <ellipse cx="82" cy="63" rx="10" ry="8" fill="#0f172a" />
      <path d="M74,59 Q82,52 90,59" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      {/* commander plume */}
      <path d="M42,8 Q50,3 58,8 L55,18 L45,18 Z" fill="#f59e0b" />
      <path d="M44,9 Q50,5 56,9 L54,18 L46,18 Z" fill="#fde68a" />
      {/* head */}
      <rect x="26" y="17" width="48" height="36" rx="8" fill="#0f172a" />
      <rect x="28" y="19" width="44" height="32" rx="7" fill="#1e293b" />
      {/* gold crown trim */}
      <rect x="26" y="17" width="48" height="5" rx="3" fill="#f59e0b" />
      {/* gold side plates */}
      <rect x="26" y="22" width="4" height="28" rx="2" fill="#d97706" />
      <rect x="70" y="22" width="4" height="28" rx="2" fill="#d97706" />
      {/* gold visor */}
      <rect x="32" y="26" width="36" height="14" rx="4" fill="#0c0a09" />
      <rect x="34" y="28" width="32" height="10" rx="3" fill="#d97706" />
      <rect x="36" y="30" width="28" height="6" rx="2" fill="#fde68a" />
      {/* gold mouth */}
      <rect x="36" y="44" width="28" height="5" rx="2" fill="#d97706" />
      {/* body */}
      <rect x="24" y="55" width="52" height="28" rx="6" fill="#0f172a" />
      <rect x="27" y="58" width="46" height="22" rx="5" fill="#1e293b" />
      <rect x="27" y="58" width="46" height="4" rx="2" fill="#f59e0b" />
      {/* 5-point star */}
      <path d="M50,64 L51.8,70 L58,70 L52.9,73.7 L54.8,79.7 L50,76 L45.2,79.7 L47.1,73.7 L42,70 L48.2,70 Z" fill="#f59e0b" />
      {/* rank stripes */}
      <rect x="29" y="65" width="7" height="2" rx="1" fill="#f59e0b" />
      <rect x="29" y="69" width="7" height="2" rx="1" fill="#f59e0b" />
      <rect x="29" y="73" width="7" height="2" rx="1" fill="#f59e0b" />
      {/* legs */}
      <rect x="27" y="83" width="18" height="11" rx="4" fill="#0f172a" />
      <rect x="27" y="83" width="18" height="4" rx="2" fill="#f59e0b" />
      <rect x="55" y="83" width="18" height="11" rx="4" fill="#0f172a" />
      <rect x="55" y="83" width="18" height="4" rx="2" fill="#f59e0b" />
      {/* arms */}
      <rect x="13" y="57" width="10" height="22" rx="5" fill="#0f172a" />
      <rect x="77" y="57" width="10" height="22" rx="5" fill="#0f172a" />
    </svg>
  );
}

// ── Robot Tier 5 — Rainbow/Legendary "Huyền Thoại X" ─────────────────────────

function RobotT5({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      {/* energy rings */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="#c026d3" strokeWidth="1.5" opacity="0.5" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
      <circle cx="50" cy="50" r="38" fill="#f5f3ff" />
      {/* energy wings */}
      <path d="M26,52 Q8,38 6,22 Q20,30 28,46 Z" fill="#a855f7" opacity="0.65" />
      <path d="M74,52 Q92,38 94,22 Q80,30 72,46 Z" fill="#a855f7" opacity="0.65" />
      <path d="M26,58 Q6,52 4,38 Q18,46 27,58 Z" fill="#818cf8" opacity="0.45" />
      <path d="M74,58 Q94,52 96,38 Q82,46 73,58 Z" fill="#818cf8" opacity="0.45" />
      {/* cosmic halo */}
      <ellipse cx="50" cy="14" rx="22" ry="5" fill="none" stroke="#c026d3" strokeWidth="2" opacity="0.7" />
      {/* head */}
      <rect x="26" y="17" width="48" height="36" rx="8" fill="#4c1d95" />
      <rect x="28" y="19" width="44" height="32" rx="7" fill="#5b21b6" />
      {/* rainbow visor */}
      <rect x="31" y="26" width="38" height="14" rx="4" fill="#2e1065" />
      <rect x="33" y="28" width="11" height="10" rx="2" fill="#f43f5e" />
      <rect x="44" y="28" width="11" height="10" fill="#f97316" />
      <rect x="55" y="28" width="12" height="10" rx="2" fill="#22c55e" />
      <rect x="35" y="30" width="28" height="5" rx="2" fill="white" opacity="0.35" />
      {/* sparkle dots on head */}
      <circle cx="35" cy="23" r="2.5" fill="#f0abfc" />
      <circle cx="65" cy="23" r="2.5" fill="#93c5fd" />
      <circle cx="50" cy="21" r="2" fill="#6ee7b7" />
      {/* rainbow mouth */}
      <rect x="36" y="45" width="9" height="5" rx="2" fill="#f43f5e" />
      <rect x="45" y="45" width="10" height="5" fill="#fbbf24" />
      <rect x="55" y="45" width="9" height="5" rx="2" fill="#22c55e" />
      {/* body */}
      <rect x="24" y="55" width="52" height="28" rx="6" fill="#4c1d95" />
      <rect x="27" y="58" width="46" height="22" rx="5" fill="#5b21b6" />
      {/* rainbow body top */}
      <rect x="27" y="58" width="46" height="4" rx="2" fill="#9333ea" />
      {/* X emblem */}
      <circle cx="50" cy="70" r="8" fill="#2e1065" stroke="#c026d3" strokeWidth="2" />
      <line x1="44" y1="64" x2="56" y2="76" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="64" x2="44" y2="76" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
      {/* energy orbs */}
      <circle cx="32" cy="67" r="3.5" fill="#f0abfc" opacity="0.85" />
      <circle cx="32" cy="75" r="3" fill="#93c5fd" opacity="0.85" />
      <circle cx="68" cy="67" r="3.5" fill="#6ee7b7" opacity="0.85" />
      <circle cx="68" cy="75" r="3" fill="#fde68a" opacity="0.85" />
      {/* legs */}
      <rect x="27" y="83" width="18" height="11" rx="4" fill="#4c1d95" />
      <rect x="27" y="83" width="18" height="4" rx="2" fill="#9333ea" />
      <rect x="55" y="83" width="18" height="11" rx="4" fill="#4c1d95" />
      <rect x="55" y="83" width="18" height="4" rx="2" fill="#9333ea" />
      {/* arms */}
      <rect x="11" y="56" width="12" height="22" rx="5" fill="#4c1d95" />
      <rect x="11" y="62" width="12" height="4" rx="2" fill="#9333ea" opacity="0.8" />
      <rect x="11" y="69" width="12" height="3" rx="1.5" fill="#c026d3" opacity="0.8" />
      <rect x="77" y="56" width="12" height="22" rx="5" fill="#4c1d95" />
      <rect x="77" y="62" width="12" height="4" rx="2" fill="#9333ea" opacity="0.8" />
      <rect x="77" y="69" width="12" height="3" rx="1.5" fill="#c026d3" opacity="0.8" />
    </svg>
  );
}

// ── Princess Tier 1 — Pink Simple "Công Chúa Nhỏ" ────────────────────────────

function PrincessT1({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <circle cx="50" cy="50" r="44" fill="#fdf2f8" />
      {/* hair */}
      <ellipse cx="50" cy="28" rx="18" ry="13" fill="#fde68a" />
      <ellipse cx="30" cy="36" rx="7" ry="14" fill="#fde68a" />
      <ellipse cx="70" cy="36" rx="7" ry="14" fill="#fde68a" />
      {/* simple 3-point crown */}
      <path d="M39,21 L39,14 L44.5,19 L50,12 L55.5,19 L61,14 L61,21 Z" fill="#fbbf24" />
      <rect x="39" y="20" width="22" height="5" rx="2" fill="#fcd34d" />
      <circle cx="50" cy="15" r="2.5" fill="#f43f5e" />
      <circle cx="43" cy="21" r="1.8" fill="#34d399" />
      <circle cx="57" cy="21" r="1.8" fill="#60a5fa" />
      {/* face */}
      <ellipse cx="50" cy="33" rx="13" ry="12" fill="#fde7c9" />
      {/* eyes */}
      <ellipse cx="44" cy="31" rx="2.8" ry="3.2" fill="#5b21b6" />
      <ellipse cx="56" cy="31" rx="2.8" ry="3.2" fill="#5b21b6" />
      <circle cx="44.8" cy="30" r="1.2" fill="white" />
      <circle cx="56.8" cy="30" r="1.2" fill="white" />
      {/* rosy cheeks */}
      <circle cx="40" cy="34" r="3" fill="#f9a8d4" opacity="0.65" />
      <circle cx="60" cy="34" r="3" fill="#f9a8d4" opacity="0.65" />
      {/* smile */}
      <path d="M45,37 Q50,41 55,37" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" />
      {/* neck */}
      <rect x="46" y="44" width="8" height="6" rx="3" fill="#fde7c9" />
      {/* dress */}
      <path d="M32,50 Q28,66 26,84 L74,84 Q72,66 68,50 Q61,56 50,54 Q39,56 32,50 Z" fill="#f9a8d4" />
      <path d="M38,54 Q41,60 50,58 Q59,60 62,54 Q60,68 58,80 L42,80 Q40,68 38,54 Z" fill="#fbcfe8" />
      {/* bow */}
      <path d="M44,58 Q46,54 48,58 L50,56 L52,58 Q54,54 56,58 L50,62 Z" fill="#ec4899" />
      {/* arms */}
      <ellipse cx="27" cy="60" rx="5" ry="11" fill="#fde7c9" />
      <ellipse cx="73" cy="60" rx="5" ry="11" fill="#fde7c9" />
    </svg>
  );
}

// ── Princess Tier 2 — Purple Creative "Công Chúa Sáng Tạo" ──────────────────

function PrincessT2({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <circle cx="50" cy="50" r="44" fill="#faf5ff" />
      {/* sparkle stars */}
      <path d="M15,22 L16.2,25.5 L20,25.5 L17,27.8 L18.2,31.3 L15,29 L11.8,31.3 L13,27.8 L10,25.5 L13.8,25.5 Z" fill="#fbbf24" opacity="0.7" />
      <path d="M83,28 L84,31 L87,31 L84.5,32.9 L85.5,35.9 L83,34 L80.5,35.9 L81.5,32.9 L79,31 L82,31 Z" fill="#ec4899" opacity="0.6" />
      {/* hair purple */}
      <ellipse cx="50" cy="27" rx="18" ry="13" fill="#c4b5fd" />
      <ellipse cx="29" cy="35" rx="7" ry="15" fill="#c4b5fd" />
      <ellipse cx="71" cy="35" rx="7" ry="15" fill="#c4b5fd" />
      <ellipse cx="44" cy="22" rx="5" ry="3" fill="#ddd6fe" opacity="0.7" />
      {/* 5-point gem crown */}
      <path d="M37,20 L37,13 L42,18 L45.5,12 L50,10 L54.5,12 L58,18 L63,13 L63,20 Z" fill="#7c3aed" />
      <rect x="37" y="19" width="26" height="6" rx="3" fill="#8b5cf6" />
      <circle cx="50" cy="13" r="3" fill="#f43f5e" />
      <circle cx="41" cy="20" r="2.5" fill="#fbbf24" />
      <circle cx="59" cy="20" r="2.5" fill="#34d399" />
      {/* face */}
      <ellipse cx="50" cy="32" rx="13" ry="12" fill="#fde7c9" />
      {/* eyes with lashes */}
      <ellipse cx="44" cy="30" rx="3" ry="3.5" fill="#4c1d95" />
      <ellipse cx="56" cy="30" rx="3" ry="3.5" fill="#4c1d95" />
      <circle cx="45" cy="28.8" r="1.3" fill="white" />
      <circle cx="57" cy="28.8" r="1.3" fill="white" />
      <line x1="42" y1="26.5" x2="41" y2="24.5" stroke="#4c1d95" strokeWidth="1.2" />
      <line x1="44" y1="26" x2="44" y2="24" stroke="#4c1d95" strokeWidth="1.2" />
      <line x1="47" y1="26.5" x2="48" y2="24.5" stroke="#4c1d95" strokeWidth="1.2" />
      <line x1="53" y1="26.5" x2="52" y2="24.5" stroke="#4c1d95" strokeWidth="1.2" />
      <line x1="56" y1="26" x2="56" y2="24" stroke="#4c1d95" strokeWidth="1.2" />
      <line x1="59" y1="26.5" x2="60" y2="24.5" stroke="#4c1d95" strokeWidth="1.2" />
      {/* cheeks */}
      <circle cx="40" cy="34" r="3" fill="#f9a8d4" opacity="0.65" />
      <circle cx="60" cy="34" r="3" fill="#f9a8d4" opacity="0.65" />
      {/* smile */}
      <path d="M45,37 Q50,41 55,37" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      {/* neck */}
      <rect x="46" y="43" width="8" height="6" rx="3" fill="#fde7c9" />
      {/* necklace */}
      <path d="M43,48 Q50,52 57,48" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="50" cy="51" r="2" fill="#f43f5e" />
      {/* dress purple, fuller */}
      <path d="M30,49 Q25,67 22,86 L78,86 Q75,67 70,49 Q62,57 50,54 Q38,57 30,49 Z" fill="#7c3aed" />
      <path d="M37,54 Q41,60 50,58 Q59,60 63,54 Q61,70 59,82 L41,82 Q39,70 37,54 Z" fill="#a78bfa" />
      {/* gold star on dress */}
      <path d="M50,63 L51.5,68 L57,68 L52.5,71.2 L54,76.2 L50,73 L46,76.2 L47.5,71.2 L43,68 L48.5,68 Z" fill="#fbbf24" />
      {/* arms */}
      <ellipse cx="26" cy="60" rx="5" ry="11" fill="#fde7c9" />
      <ellipse cx="74" cy="60" rx="5" ry="11" fill="#fde7c9" />
    </svg>
  );
}

// ── Princess Tier 3 — Royal Purple+Gold "Công Chúa Vương Quốc" ───────────────

function PrincessT3({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <circle cx="50" cy="50" r="44" fill="#fefce8" />
      {/* gold sparkles */}
      <path d="M15,28 L15.8,30.5 L18.5,30.5 L16.4,32.2 L17.2,34.7 L15,33.1 L12.8,34.7 L13.6,32.2 L11.5,30.5 L14.2,30.5 Z" fill="#f59e0b" opacity="0.7" />
      <path d="M83,20 L83.8,22.5 L86.5,22.5 L84.4,24.2 L85.2,26.7 L83,25.1 L80.8,26.7 L81.6,24.2 L79.5,22.5 L82.2,22.5 Z" fill="#f59e0b" opacity="0.7" />
      {/* hair dark brown */}
      <ellipse cx="50" cy="26" rx="18" ry="13" fill="#78350f" />
      <ellipse cx="29" cy="34" rx="7" ry="15" fill="#78350f" />
      <ellipse cx="71" cy="34" rx="7" ry="15" fill="#78350f" />
      <ellipse cx="44" cy="21" rx="5" ry="3" fill="#a16207" opacity="0.6" />
      {/* elaborate gold crown */}
      <path d="M35,20 L35,11 L41,18 L45,10 L50,7 L55,10 L59,18 L65,11 L65,20 Z" fill="#d97706" />
      <rect x="35" y="19" width="30" height="7" rx="3" fill="#f59e0b" />
      <circle cx="50" cy="12" r="3.5" fill="#f43f5e" />
      <circle cx="40" cy="20" r="2.8" fill="#7c3aed" />
      <circle cx="60" cy="20" r="2.8" fill="#34d399" />
      <circle cx="45" cy="20" r="2" fill="#fbbf24" />
      <circle cx="55" cy="20" r="2" fill="#fbbf24" />
      {/* face */}
      <ellipse cx="50" cy="32" rx="13" ry="12" fill="#fde7c9" />
      {/* eyes with lashes */}
      <ellipse cx="44" cy="30" rx="3.2" ry="3.8" fill="#3b0764" />
      <ellipse cx="56" cy="30" rx="3.2" ry="3.8" fill="#3b0764" />
      <circle cx="45" cy="28.5" r="1.4" fill="white" />
      <circle cx="57" cy="28.5" r="1.4" fill="white" />
      <line x1="41" y1="26.5" x2="40" y2="24" stroke="#3b0764" strokeWidth="1.3" />
      <line x1="44" y1="26" x2="44" y2="23.8" stroke="#3b0764" strokeWidth="1.3" />
      <line x1="47" y1="26.5" x2="48" y2="24" stroke="#3b0764" strokeWidth="1.3" />
      <line x1="53" y1="26.5" x2="52" y2="24" stroke="#3b0764" strokeWidth="1.3" />
      <line x1="56" y1="26" x2="56" y2="23.8" stroke="#3b0764" strokeWidth="1.3" />
      <line x1="59" y1="26.5" x2="60" y2="24" stroke="#3b0764" strokeWidth="1.3" />
      {/* cheeks */}
      <circle cx="40" cy="34" r="3" fill="#f9a8d4" opacity="0.5" />
      <circle cx="60" cy="34" r="3" fill="#f9a8d4" opacity="0.5" />
      {/* smile */}
      <path d="M45,37 Q50,41 55,37" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      {/* neck */}
      <rect x="46" y="43" width="8" height="5" rx="3" fill="#fde7c9" />
      {/* royal gold necklace */}
      <path d="M40,47 Q50,53 60,47" fill="none" stroke="#d97706" strokeWidth="2" />
      <circle cx="50" cy="52" r="2.5" fill="#f59e0b" />
      {/* royal purple gown */}
      <path d="M28,49 Q22,68 20,86 L80,86 Q78,68 72,49 Q63,58 50,55 Q37,58 28,49 Z" fill="#6d28d9" />
      <path d="M36,54 Q40,62 50,59 Q60,62 64,54 Q62,72 60,82 L40,82 Q38,72 36,54 Z" fill="#7c3aed" />
      {/* gold trim */}
      <path d="M36,54 Q40,62 50,59 Q60,62 64,54" fill="none" stroke="#f59e0b" strokeWidth="2" />
      {/* gold star emblem */}
      <path d="M50,65 L51.8,71 L58,71 L52.9,74.8 L54.8,80.8 L50,77 L45.2,80.8 L47.1,74.8 L42,71 L48.2,71 Z" fill="#f59e0b" />
      {/* arms + gloves */}
      <ellipse cx="25" cy="60" rx="5" ry="11" fill="#fde7c9" />
      <ellipse cx="25" cy="68" rx="5" ry="4" fill="#7c3aed" />
      <ellipse cx="75" cy="60" rx="5" ry="11" fill="#fde7c9" />
      <ellipse cx="75" cy="68" rx="5" ry="4" fill="#7c3aed" />
    </svg>
  );
}

// ── Princess Tier 4 — Deep Purple Queen "Nữ Hoàng" ───────────────────────────

function PrincessT4({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      <circle cx="50" cy="50" r="44" fill="#f5f3ff" />
      {/* royal cape hints */}
      <path d="M22,44 Q10,52 8,70 Q18,62 27,50 Z" fill="#4c1d95" opacity="0.5" />
      <path d="M78,44 Q90,52 92,70 Q82,62 73,50 Z" fill="#4c1d95" opacity="0.5" />
      {/* hair dark */}
      <ellipse cx="50" cy="25" rx="18" ry="13" fill="#1e1b4b" />
      <ellipse cx="29" cy="33" rx="7" ry="16" fill="#1e1b4b" />
      <ellipse cx="71" cy="33" rx="7" ry="16" fill="#1e1b4b" />
      {/* elaborate queen crown */}
      <path d="M34,21 L34,10 L40,18 L44,9 L50,6 L56,9 L60,18 L66,10 L66,21 Z" fill="#7c3aed" />
      <rect x="34" y="20" width="32" height="8" rx="3" fill="#8b5cf6" />
      <circle cx="50" cy="10" r="4" fill="#f43f5e" />
      <circle cx="39" cy="21" r="3" fill="#fbbf24" />
      <circle cx="61" cy="21" r="3" fill="#34d399" />
      <circle cx="44.5" cy="21" r="2.5" fill="#60a5fa" />
      <circle cx="55.5" cy="21" r="2.5" fill="#f97316" />
      {/* face */}
      <ellipse cx="50" cy="32" rx="13" ry="12" fill="#fde7c9" />
      {/* regal eyes */}
      <ellipse cx="44" cy="30" rx="3.5" ry="4" fill="#1e1b4b" />
      <ellipse cx="56" cy="30" rx="3.5" ry="4" fill="#1e1b4b" />
      <circle cx="45.2" cy="28.5" r="1.5" fill="white" />
      <circle cx="57.2" cy="28.5" r="1.5" fill="white" />
      <path d="M41,26.5 Q44,23 47,26.5" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
      <path d="M53,26.5 Q56,23 59,26.5" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
      {/* cheeks */}
      <circle cx="40" cy="34" r="3" fill="#f9a8d4" opacity="0.5" />
      <circle cx="60" cy="34" r="3" fill="#f9a8d4" opacity="0.5" />
      {/* smile */}
      <path d="M46,37 Q50,40 54,37" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      {/* neck */}
      <rect x="46" y="43" width="8" height="5" rx="3" fill="#fde7c9" />
      {/* elaborate necklace */}
      <path d="M38,47 Q50,55 62,47" fill="none" stroke="#c026d3" strokeWidth="2.5" />
      <circle cx="50" cy="54" r="3" fill="#f43f5e" />
      <circle cx="42" cy="50" r="2" fill="#fbbf24" />
      <circle cx="58" cy="50" r="2" fill="#fbbf24" />
      {/* queen gown */}
      <path d="M26,49 Q20,70 18,88 L82,88 Q80,70 74,49 Q64,60 50,56 Q36,60 26,49 Z" fill="#3b0764" />
      <path d="M35,55 Q39,64 50,61 Q61,64 65,55 Q63,74 61,84 L39,84 Q37,74 35,55 Z" fill="#4c1d95" />
      {/* magenta trim */}
      <path d="M35,55 Q39,64 50,61 Q61,64 65,55" fill="none" stroke="#c026d3" strokeWidth="2.5" />
      {/* royal orb */}
      <circle cx="50" cy="72" r="8" fill="#2e1065" stroke="#c026d3" strokeWidth="2" />
      <circle cx="50" cy="72" r="4" fill="#7c3aed" />
      <circle cx="50" cy="72" r="2" fill="#f0abfc" />
      {/* hem lines */}
      <rect x="35" y="79" width="30" height="2" rx="1" fill="#c026d3" opacity="0.7" />
      <rect x="37" y="75" width="26" height="1.5" rx="0.75" fill="#c026d3" opacity="0.5" />
      {/* arms + gloves */}
      <ellipse cx="23" cy="60" rx="5" ry="12" fill="#fde7c9" />
      <ellipse cx="23" cy="69" rx="5" ry="4.5" fill="#3b0764" />
      <ellipse cx="77" cy="60" rx="5" ry="12" fill="#fde7c9" />
      <ellipse cx="77" cy="69" rx="5" ry="4.5" fill="#3b0764" />
    </svg>
  );
}

// ── Princess Tier 5 — Celestial "Nữ Hoàng Huyền Thoại" ──────────────────────

function PrincessT5({ s }: { s: number }) {
  return (
    <svg viewBox="0 0 100 100" width={s} height={s}>
      {/* cosmic rings */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="#c026d3" strokeWidth="1.5" opacity="0.5" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.4" />
      <circle cx="50" cy="50" r="38" fill="#0c0a09" />
      {/* stars */}
      <circle cx="20" cy="25" r="1.5" fill="white" opacity="0.9" />
      <circle cx="75" cy="20" r="1" fill="white" opacity="0.8" />
      <circle cx="15" cy="55" r="1" fill="white" opacity="0.7" />
      <circle cx="82" cy="50" r="1.5" fill="white" opacity="0.8" />
      <circle cx="25" cy="75" r="1" fill="white" opacity="0.6" />
      <circle cx="78" cy="72" r="1" fill="white" opacity="0.7" />
      {/* celestial hair */}
      <ellipse cx="50" cy="26" rx="19" ry="14" fill="#e0e7ff" />
      <ellipse cx="28" cy="34" rx="8" ry="17" fill="#c7d2fe" />
      <ellipse cx="72" cy="34" rx="8" ry="17" fill="#c7d2fe" />
      <ellipse cx="45" cy="22" rx="6" ry="4" fill="white" opacity="0.6" />
      {/* light wings */}
      <path d="M26,52 Q6,36 4,16 Q22,28 28,48 Z" fill="#818cf8" opacity="0.6" />
      <path d="M74,52 Q94,36 96,16 Q78,28 72,48 Z" fill="#818cf8" opacity="0.6" />
      <path d="M26,60 Q4,56 2,38 Q16,48 27,62 Z" fill="#c084fc" opacity="0.4" />
      <path d="M74,60 Q96,56 98,38 Q84,48 73,62 Z" fill="#c084fc" opacity="0.4" />
      {/* cosmic crown */}
      <ellipse cx="50" cy="11" rx="20" ry="5" fill="none" stroke="#c026d3" strokeWidth="2" opacity="0.8" />
      <path d="M33,20 L33,9 L39,18 L43,7 L50,4 L57,7 L61,18 L67,9 L67,20 Z" fill="#4f46e5" />
      <rect x="33" y="19" width="34" height="8" rx="4" fill="#6366f1" />
      <circle cx="50" cy="10" r="4" fill="#f0abfc" />
      <circle cx="38" cy="20" r="3" fill="#fbbf24" />
      <circle cx="62" cy="20" r="3" fill="#34d399" />
      <circle cx="44" cy="20" r="2.5" fill="#60a5fa" />
      <circle cx="56" cy="20" r="2.5" fill="#f43f5e" />
      {/* crown star tips */}
      <circle cx="50" cy="5" r="2" fill="white" opacity="0.9" />
      <circle cx="38" cy="10" r="1.5" fill="white" opacity="0.8" />
      <circle cx="62" cy="10" r="1.5" fill="white" opacity="0.8" />
      {/* face luminous */}
      <ellipse cx="50" cy="33" rx="13" ry="12" fill="#fce7f3" />
      {/* ethereal eyes */}
      <ellipse cx="44" cy="31" rx="3.5" ry="4" fill="#1e1b4b" />
      <ellipse cx="56" cy="31" rx="3.5" ry="4" fill="#1e1b4b" />
      <circle cx="45.5" cy="29.5" r="1.8" fill="#a5b4fc" />
      <circle cx="57.5" cy="29.5" r="1.8" fill="#a5b4fc" />
      <circle cx="45.5" cy="29.5" r="0.8" fill="white" />
      <circle cx="57.5" cy="29.5" r="0.8" fill="white" />
      <path d="M41,27 Q44,23.5 47,27" fill="none" stroke="#818cf8" strokeWidth="1.5" />
      <path d="M53,27 Q56,23.5 59,27" fill="none" stroke="#818cf8" strokeWidth="1.5" />
      {/* cheeks cosmic */}
      <circle cx="40" cy="34" r="3" fill="#f0abfc" opacity="0.55" />
      <circle cx="60" cy="34" r="3" fill="#f0abfc" opacity="0.55" />
      {/* smile */}
      <path d="M45,37.5 Q50,42 55,37.5" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
      {/* neck */}
      <rect x="46" y="44" width="8" height="5" rx="3" fill="#fce7f3" />
      {/* cosmic necklace */}
      <path d="M37,48 Q50,56 63,48" fill="none" stroke="#c026d3" strokeWidth="2" />
      <circle cx="50" cy="55" r="3.5" fill="#f0abfc" />
      <circle cx="42" cy="51" r="2" fill="#818cf8" />
      <circle cx="58" cy="51" r="2" fill="#818cf8" />
      {/* celestial gown */}
      <path d="M24,50 Q18,70 16,88 L84,88 Q82,70 76,50 Q66,62 50,58 Q34,62 24,50 Z" fill="#0f0a1e" />
      <path d="M33,56 Q38,66 50,63 Q62,66 67,56 Q65,76 63,84 L37,84 Q35,76 33,56 Z" fill="#1e1b4b" />
      <path d="M33,56 Q38,66 50,63 Q62,66 67,56" fill="none" stroke="#818cf8" strokeWidth="2" />
      {/* star pattern on gown */}
      <circle cx="50" cy="70" r="2" fill="#a5b4fc" opacity="0.9" />
      <circle cx="42" cy="67" r="1.5" fill="#f0abfc" opacity="0.8" />
      <circle cx="58" cy="67" r="1.5" fill="#6ee7b7" opacity="0.8" />
      <circle cx="45" cy="77" r="1.5" fill="#fde68a" opacity="0.8" />
      <circle cx="55" cy="77" r="1.5" fill="#f9a8d4" opacity="0.8" />
      <circle cx="50" cy="80" r="1" fill="#c4b5fd" opacity="0.9" />
      {/* aurora hem */}
      <path d="M37,83 Q45,79 50,83 Q55,87 63,83" fill="none" stroke="#818cf8" strokeWidth="2" opacity="0.6" />
      <path d="M37,80 Q44,77 50,80 Q56,83 63,80" fill="none" stroke="#c026d3" strokeWidth="1.5" opacity="0.5" />
      {/* arms luminous */}
      <ellipse cx="22" cy="60" rx="5" ry="13" fill="#fce7f3" />
      <ellipse cx="22" cy="70" rx="5" ry="5" fill="#1e1b4b" />
      <circle cx="22" cy="56" r="2" fill="#a5b4fc" opacity="0.8" />
      <ellipse cx="78" cy="60" rx="5" ry="13" fill="#fce7f3" />
      <ellipse cx="78" cy="70" rx="5" ry="5" fill="#1e1b4b" />
      <circle cx="78" cy="56" r="2" fill="#a5b4fc" opacity="0.8" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function StudentAvatar({ xp, themeId, size = 80, showTierName = false }: StudentAvatarProps) {
  const level = getLevel(xp).level;
  const tier = getAvatarTier(level);
  const isRobot = themeId === "robot_sport_lab";

  const tierName = isRobot ? ROBOT_TIER_NAMES[tier - 1] : PRINCESS_TIER_NAMES[tier - 1];

  const robotTiers = [RobotT1, RobotT2, RobotT3, RobotT4, RobotT5];
  const princessTiers = [PrincessT1, PrincessT2, PrincessT3, PrincessT4, PrincessT5];
  const AvatarSvg = isRobot ? robotTiers[tier - 1] : princessTiers[tier - 1];

  if (showTierName) {
    return (
      <div className="flex flex-col items-center gap-1">
        <AvatarSvg s={size} />
        <span className="text-xs font-black leading-tight text-center">{tierName}</span>
      </div>
    );
  }

  return <AvatarSvg s={size} />;
}
