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
        paper: "#FAF9F6",
        ink: "#1A1A1A",
        clay: "#B0492E",
        rule: "#E6E0D8",
        muted: "#6E675F"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-newsreader)", "Newsreader", "ui-serif", "Georgia"]
      },
      maxWidth: {
        measure: "760px"
      }
    }
  },
  plugins: []
};

export default config;
