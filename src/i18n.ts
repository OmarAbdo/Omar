import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const RTL_LANGUAGES = ["ar"];

function applyDocumentLanguage(lang: string) {
  document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? "rtl" : "ltr";
  document.documentElement.lang = lang;
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    backend: {
      loadPath: "./locales/{{lng}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
    lng: "en",
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

i18n.on("initialized", () => applyDocumentLanguage(i18n.language));
i18n.on("languageChanged", applyDocumentLanguage);

export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  localStorage.setItem("i18nextLng", language);
};

export default i18n;
