/** @type {import('tailwindcss').Config} */
// import formsPlugin from "@tailwindcss/forms";

export default {
  content: [
    "./index.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
    "./src/**/*.ts",
    "./src/**/*.tsx",
  ],
  darkMode: "media", // 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "custom-teal": "#35BBBB",
      },
    },
  },
  plugins: [
    // formsPlugin
    // eslint-disable-next-line no-undef
    // require("@tailwindcss/forms"),
  ],
};
