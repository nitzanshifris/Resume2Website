export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px"
};

export const colors = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  foreground: "var(--color-foreground)",
  background: "var(--color-background)"
};

export const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem"
};

export const fontFamily = {
  sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
  display: ["Calsans", "Inter", "sans-serif"]
};

export const tokens = { spacing, colors, fontSizes, fontFamily };

export default tokens; 