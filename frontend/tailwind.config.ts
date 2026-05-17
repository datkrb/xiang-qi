import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        xiangqi: {
          board: "#DCC9B6",
          line: "#8B6F47",
          light: "#F5F1E8",
          dark: "#2C1810",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
