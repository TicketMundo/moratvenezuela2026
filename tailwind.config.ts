import type { Config } from "tailwindcss";

/** Tailwind only styles the admin. The landing uses app/morat.css. */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E63946",
          hover: "#C92A37"
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1A1A1A"
        },
        base: {
          light: "#F8F8F8",
          dark: "#0F0F0F"
        },
        line: {
          light: "#E5E5E5",
          dark: "#2A2A2A"
        }
      },
      borderRadius: {
        card: "8px",
        input: "6px"
      },
      transitionDuration: {
        theme: "150ms"
      }
    }
  },
  plugins: []
};
export default config;
