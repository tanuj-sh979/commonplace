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
        paper: "#F8F3EA",
        surface: "#FFFDF8",
        "surface-muted": "#EFE6D8",
        ink: "#1F1C18",
        clay: "#A85F3D",
        "clay-soft": "#E8C7B1",
        sage: "#7B8266",
        rule: "#E3D6C4",
        muted: "#746B61"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        serif: [
          "var(--font-instrument-serif)",
          "Instrument Serif",
          "ui-serif",
          "Georgia"
        ]
      },
      maxWidth: {
        measure: "780px",
        page: "1040px"
      }
    }
  },
  plugins: []
};

export default config;
