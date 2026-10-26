// Design tokens no estilo Duolingo (cores/raio/sombra 3D).
export const colors = {
  green: "#58CC02",
  greenDark: "#58A700",
  greenLight: "#D7FFB8",

  blue: "#1CB0F6",
  blueDark: "#1899D6",
  blueLight: "#DDF4FF",

  red: "#FF4B4B",
  redDark: "#EA2B2B",
  redLight: "#FFDFE0",

  yellow: "#FFC800",
  yellowDark: "#E5A700",

  purple: "#CE82FF",

  text: "#3C3C3C",
  textMuted: "#777777",
  textFaint: "#AFAFAF",

  bg: "#FFFFFF",
  bgAlt: "#F7F7F7",
  border: "#E5E5E5",
  locked: "#E5E5E5",
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36,
  pill: 999,
};

export const font = {
  bold: "800" as const,
  semi: "700" as const,
};

export const EDGE = 4; // altura da "borda 3D" dos botões

export type Variant = "primary" | "secondary" | "danger" | "neutral";

export const variants: Record<Variant, { bg: string; edge: string; text: string }> = {
  primary: { bg: colors.blue, edge: colors.blueDark, text: "#FFFFFF" },
  secondary: { bg: colors.purple, edge: "#A566D0", text: "#FFFFFF" },
  danger: { bg: colors.red, edge: colors.redDark, text: "#FFFFFF" },
  neutral: { bg: colors.bg, edge: colors.border, text: colors.textMuted },
};
