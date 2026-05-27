import type { CSSProperties } from "react";

export type ThemeId = "princess_craft_kingdom" | "robot_sport_lab";

export type ThemePalette = {
  background: string;
  surface: string;
  primary: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
  success: string;
  warning: string;
  /** Full CSS `background` value for page-shell (multi-layer with sparkle dots) */
  pageBg: string;
  /** CSS gradient for the illustrated top-panel of game cards */
  cardHeroBg: string;
  /** CSS gradient for the dashboard header */
  headerBg: string;
  /** CSS `filter` drop-shadow colour for decorative emoji glow */
  decoGlow: string;
};

export type AppTheme = {
  id: ThemeId;
  name: string;
  emoji: string;
  title: string;
  visualDirection: string;
  palette: ThemePalette;
  /** Floating decoration emojis shown behind content */
  decorations: string[];
  feedback: {
    correct: string[];
    retry: string[];
    reveal: string[];
    hint: string;
  };
  rewards: string[];
};

export const themes: Record<ThemeId, AppTheme> = {
  princess_craft_kingdom: {
    id: "princess_craft_kingdom",
    name: "Princess Craft Kingdom",
    emoji: "👑",
    title: "Công chúa sáng tạo",
    visualDirection: "Soft, magical, creative princess castle craft world",
    palette: {
      background: "#fdf4ff",
      surface: "#ffffff",
      primary: "#8b5cf6",    // vibrant violet
      primarySoft: "#ede9fe",
      accent: "#ec4899",     // hot pink
      accentSoft: "#fce7f3",
      text: "#3b0764",
      muted: "#7c3aed",
      success: "#16a34a",
      warning: "#f97316",

      // Page background: sparkle dot star-field + atmospheric glows + rich lavender base
      pageBg: [
        // Tiny sparkle dots — two offset grids → star-field effect
        "radial-gradient(circle, rgba(255,255,255,0.80) 1px, transparent 1px) 0 0 / 42px 42px",
        "radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px) 0 0 / 21px 21px",
        // Glowing glow blobs
        "radial-gradient(ellipse 90% 60% at 50% -5%,  rgba(167,139,250,0.65) 0%, transparent 60%)",
        "radial-gradient(ellipse 80% 55% at 10% 20%,  rgba(196,181,253,0.50) 0%, transparent 55%)",
        "radial-gradient(ellipse 65% 45% at 88% 75%,  rgba(249,168,212,0.48) 0%, transparent 55%)",
        "radial-gradient(ellipse 50% 35% at 55% 55%,  rgba(216,180,254,0.22) 0%, transparent 45%)",
        // Base: soft warm lavender
        "linear-gradient(160deg, #f5eeff 0%, #fce7f3 45%, #fff0f9 75%, #fdf4ff 100%)",
      ].join(", "),

      // Card hero panel: deep purple → violet → pink (Prodigy-style illustrated card top)
      cardHeroBg:
        "linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #a855f7 75%, #ec4899 100%)",

      // Dashboard header: rich violet gradient
      headerBg:
        "linear-gradient(135deg, #3b0764 0%, #6d28d9 40%, #9333ea 70%, #c026d3 100%)",

      // Glow for the floating deco emojis
      decoGlow: "rgba(167,139,250,0.70)",
    },
    decorations: ["✨", "👑", "🌸", "💜", "🦋", "⭐", "🌟", "🎀", "🔮", "🌺"],
    feedback: {
      correct: [
        "Tuyệt vời! Viên sao nhỏ đã sáng lên rồi.",
        "Công chúa nhỏ xử lý rất khéo đó!",
        "Chính xác rồi, lâu đài có thêm một tia sáng mới.",
      ],
      retry: [
        "Gần đúng rồi đó! Mình thử thêm một lần nữa nha.",
        "Công chúa nhỏ đã rất cố gắng rồi, thử nhìn lại gợi ý nhé.",
        "Một chút phép thuật nữa thôi là ra rồi.",
      ],
      reveal: [
        "Không sao cả, mình cùng xem đáp án để lần sau nhớ hơn nha.",
        "Câu này sẽ được giữ lại để công chúa luyện thêm sau nhé.",
      ],
      hint: "Một gợi ý phép thuật nè...",
    },
    rewards: ["Váy mới", "Vương miện", "Phụ kiện búp bê", "Vật liệu thủ công", "Phòng lâu đài"],
  },

  robot_sport_lab: {
    id: "robot_sport_lab",
    name: "Robot Sport Lab",
    emoji: "🤖",
    title: "Kỹ sư Robo-X",
    visualDirection: "Robot, Lego, sports, lab, arena learning world",
    palette: {
      background: "#eff6ff",
      surface: "#ffffff",
      primary: "#2563eb",    // vibrant royal blue
      primarySoft: "#dbeafe",
      accent: "#f97316",     // energetic orange
      accentSoft: "#ffedd5",
      text: "#0f2952",
      muted: "#1d4ed8",
      success: "#16a34a",
      warning: "#ea580c",

      // Page background: circuit dot grid + deep blue atmospheric glows
      pageBg: [
        // Circuit-style dot grid (two offsets = tighter grid feel)
        "radial-gradient(circle, rgba(255,255,255,0.75) 1px, transparent 1px) 0 0 / 40px 40px",
        "radial-gradient(circle, rgba(255,255,255,0.40) 1px, transparent 1px) 0 0 / 20px 20px",
        // Atmospheric glows
        "radial-gradient(ellipse 90% 60% at 50% -5%,  rgba(59,130,246,0.55)  0%, transparent 60%)",
        "radial-gradient(ellipse 75% 50% at 5%  25%,  rgba(37,99,235,0.45)   0%, transparent 55%)",
        "radial-gradient(ellipse 65% 45% at 90% 70%,  rgba(6,182,212,0.45)   0%, transparent 55%)",
        "radial-gradient(ellipse 45% 30% at 55% 50%,  rgba(99,102,241,0.18)  0%, transparent 45%)",
        // Base: sky blue
        "linear-gradient(160deg, #dbeafe 0%, #e0f2fe 40%, #eff6ff 70%, #ecfeff 100%)",
      ].join(", "),

      // Card hero panel: deep navy → royal blue → cyan (tech arena feel)
      cardHeroBg:
        "linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #0284c7 70%, #06b6d4 100%)",

      // Dashboard header: dramatic blue gradient
      headerBg:
        "linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #2563eb 65%, #0ea5e9 100%)",

      // Glow for the floating deco emojis
      decoGlow: "rgba(59,130,246,0.75)",
    },
    decorations: ["⚙️", "🤖", "🔵", "🔧", "🏆", "⚡", "🚀", "💎", "🎯", "🔩"],
    feedback: {
      correct: [
        "Phân tích chính xác! Robo-X đã nâng cấp một module.",
        "Tư duy tốt lắm! Kết quả đã khớp dữ liệu.",
        "Kỹ sư xử lý rất gọn, phòng lab ghi nhận.",
      ],
      retry: [
        "Robot phân tích thấy đáp án này chưa tối ưu. Mình thử lại nhé!",
        "Tư duy tốt lắm! Thêm một bước nữa là ra.",
        "Dữ liệu gần khớp rồi, kỹ sư kiểm tra lại một chút nha.",
      ],
      reveal: [
        "Robo-X mở đáp án tham khảo để mình luyện lại sau.",
        "Không sao, câu này sẽ vào danh sách ôn để hệ thống mạnh hơn.",
      ],
      hint: "Gợi ý từ phòng lab nè...",
    },
    rewards: ["Bộ phận robot", "Khối Lego", "Huy chương thể thao", "Dụng cụ lab", "Tầng đấu trường"],
  },
};

export function getTheme(themeId: string): AppTheme {
  return themes[(themeId as ThemeId) in themes ? (themeId as ThemeId) : "princess_craft_kingdom"];
}

export function themeStyle(theme: AppTheme): CSSProperties {
  return {
    "--sq-bg":           theme.palette.background,
    "--sq-page-bg":      theme.palette.pageBg,
    "--sq-card-hero-bg": theme.palette.cardHeroBg,
    "--sq-header-bg":    theme.palette.headerBg,
    "--sq-deco-glow":    theme.palette.decoGlow,
    "--sq-surface":      theme.palette.surface,
    "--sq-primary":      theme.palette.primary,
    "--sq-primary-soft": theme.palette.primarySoft,
    "--sq-accent":       theme.palette.accent,
    "--sq-accent-soft":  theme.palette.accentSoft,
    "--sq-text":         theme.palette.text,
    "--sq-muted":        theme.palette.muted,
    "--sq-success":      theme.palette.success,
    "--sq-warning":      theme.palette.warning,
  } as CSSProperties;
}
