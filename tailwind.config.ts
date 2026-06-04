import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        surface: "#FAFAF8",
        "surface-muted": "#F4F1EC",
        ink: "#171717",
        clay: "#8B5E3C",
        terracotta: "#A86548",
        "clay-soft": "#F2E7DD",
        sage: "#6F7660",
        secondary: "#5F5A54",
        rule: "#E8E2D8",
        strong: "#D7C8B8",
        muted: "#666666"
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "Open Sans", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-open-sans)", "Open Sans", "ui-sans-serif", "system-ui"]
      },
      maxWidth: {
        measure: "780px",
        page: "1120px"
      }
    }
  },
  plugins: []
};

export default config;
