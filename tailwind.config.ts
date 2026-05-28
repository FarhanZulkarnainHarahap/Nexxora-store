import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1B263B",
        slateBlue: "#415A77",
        gold: "#E5A93B",
        roseGold: "#E0A96D",
        offWhite: "#F8F9FA",
        muted: "#D6DDE6",
        success: "#22C55E",
        danger: "#EF4444",
      },
      boxShadow: {
        gold: "0 18px 48px rgba(229, 169, 59, 0.22)",
        soft: "0 20px 50px rgba(0, 0, 0, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
