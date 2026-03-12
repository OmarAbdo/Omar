/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
    "./src/**/*.ts",
    "./src/**/*.tsx",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dark-bg":       "#08090D",
        "dark-surface":  "#111318",
        "light-bg":      "#F8F8FC",
        "light-surface": "#FFFFFF",
        "gold":          "#C9B896",
        "gold-hover":    "#B89870",
        "text-primary":  "#EDEDEE",
        "text-muted":    "#7A7D8A",
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
