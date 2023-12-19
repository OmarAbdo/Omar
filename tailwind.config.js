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
  theme: {
    extend: {},
  },
  plugins: [
    // formsPlugin
    // eslint-disable-next-line no-undef
    // require("@tailwindcss/forms"),
  ],
};
