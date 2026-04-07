import { Platform } from "react-native";

const tintColorLight = "#d7f06a";
const tintColorDark = "#f7f5eb";

export const Colors = {
  light: {
    text: "#0f1d12",
    background: "#f7f5eb",
    tint: tintColorLight,
    icon: "#6d766b",
    tabIconDefault: "#7b867a",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#f3f1e8",
    background: "#04150c",
    tint: tintColorDark,
    icon: "#8fa39a",
    tabIconDefault: "#8fa39a",
    tabIconSelected: tintColorDark,
  },
};

export const ChapeTheme = {
  colors: {
    page: "#05160d",
    pageAlt: "#0b2416",
    surface: "rgba(10, 36, 21, 0.88)",
    surfaceStrong: "#0f2f1d",
    surfaceElevated: "rgba(243, 241, 232, 0.08)",
    surfaceMuted: "rgba(255, 255, 255, 0.12)",
    border: "rgba(233, 237, 226, 0.14)",
    borderStrong: "rgba(215, 240, 106, 0.24)",
    text: "#f7f5eb",
    textMuted: "#c9d2c7",
    textSubtle: "#93a292",
    primary: "#14532d",
    primaryBright: "#1e7a43",
    accent: "#d7f06a",
    accentSoft: "#eef6c5",
    gold: "#d3b56d",
    danger: "#ff8974",
    shadow: "rgba(0, 0, 0, 0.28)",
    overlay: "rgba(2, 15, 8, 0.82)",
  },
  radii: {
    xs: 12,
    sm: 18,
    md: 24,
    lg: 32,
    pill: 999,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fonts: Platform.select({
    ios: {
      sans: "system-ui",
      serif: "ui-serif",
      rounded: "ui-rounded",
      mono: "ui-monospace",
    },
    default: {
      sans: "sans-serif",
      serif: "serif",
      rounded: "sans-serif-medium",
      mono: "monospace",
    },
    web: {
      sans: "'Avenir Next', 'Segoe UI', sans-serif",
      serif: "'Iowan Old Style', Georgia, serif",
      rounded: "'Avenir Next Rounded', 'Trebuchet MS', sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
  }),
  shadow: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.22,
      shadowRadius: 28,
    },
    android: {
      elevation: 12,
    },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.18,
      shadowRadius: 28,
    },
  }),
};

export const Fonts = ChapeTheme.fonts;
