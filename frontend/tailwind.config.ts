import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        xiangqi: {
          board: "#DCC9B6",
          line: "#8B6F47",
          light: "#F5F1E8",
          dark: "#2C1810",
        },
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-opaque": "var(--color-surface-opaque)",
        "surface-hover": "var(--color-surface-hover)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          foreground: "var(--color-primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
        },
        border: "var(--color-border)",
        text: {
          main: "var(--color-text-main)",
          muted: "var(--color-text-muted)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 5px rgba(6, 182, 212, 0.2)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
