import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    backend: {
      loadPath: "./locales/{{lng}}.json",
    },
    interpolation: {
      escapeValue: false, // React escapes by default
    },
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  localStorage.setItem("i18nextLng", language); // Save selected language
};

export default i18n;
