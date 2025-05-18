
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Enables the i18next backend
  .use(Backend)
  // Enables automatic language detection
  .use(LanguageDetector)
  // Passes i18n to react-i18next
  .use(initReactI18next)
  // Initializes i18next
  .init({
    // Default language
    fallbackLng: 'pl',
    // Debug mode
    debug: false,
    // Supported languages
    supportedLngs: ['pl', 'en', 'de', 'fr', 'es'],
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    // Namespaces
    ns: ['translation'],
    defaultNS: 'translation',
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // React options
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
