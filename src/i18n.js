import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend'; // Import the backend

i18n
  // Load translation using http -> see /public/locales
  .use(HttpApi)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  .init({
    debug: true, // Set to false in production
    fallbackLng: 'en', // Use English if detected language is not available
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    // Define supported languages here
    supportedLngs: ['en', 'ro'],
    // Configure the backend
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    // Optional: Set namespaces if you plan to split translations into multiple files
    // ns: ['translation'],
    // defaultNS: 'translation',
  });

export default i18n;
