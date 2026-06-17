/**
 * Shared design tokens for Disha's dashboard system.
 */
export const TOKENS = {
  colors: {
    background: "#0a0d0a",
    surface: "#111914",
    border: "rgba(255,255,255,0.07)",
    accent: "#22c55e",
    accentDim: "#16a34a",
    text: {
      primary: "#f0fdf4",
      secondary: "rgba(255,255,255,0.5)",
      muted: "rgba(255,255,255,0.25)",
    },
  },
  spacing: [4, 8, 12, 16, 24, 32, 48, 64] as const,
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  transitions: {
    fast: 150,
    base: 250,
    slow: 400,
    spring: {
      type: "spring",
      stiffness: 260,
      damping: 24,
      mass: 0.9,
    },
  },
} as const;

