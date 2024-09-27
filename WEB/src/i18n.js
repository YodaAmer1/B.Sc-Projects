import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Initialize i18n
i18n
  .use(HttpApi) // Loads translations from the server
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    supportedLngs: ["en", "it", "zh", "ru", "de"], // Supported languages
    fallbackLng: "en", // Fallback language
    detection: {
      order: ["querystring", "cookie", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to the translation files
    },
  });

export default i18n;
