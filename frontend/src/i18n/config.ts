import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./locales/vi.json";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

// Get initial language from localStorage or default to Vietnamese
const getSavedLanguage = (): string => {
  try {
    const settings = localStorage.getItem("app-settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      return parsed.language?.language || "vi";
    }
  } catch {
    // Fall back to default
  }
  return "vi";
};

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: getSavedLanguage(),
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
