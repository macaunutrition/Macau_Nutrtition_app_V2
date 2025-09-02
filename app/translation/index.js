import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as resources from "./resources";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize i18n with default language
i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: Object.keys(resources).reduce((acc, key) => {
    acc[key] = { translation: resources[key] };
    return acc;
  }, {}),
  lng: "en",
  fallbackLng: "en",
});

// Load saved language from AsyncStorage
const loadSavedLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem('lang');
    if (savedLang && (savedLang === 'cn' || savedLang === 'en')) {
      i18n.changeLanguage(savedLang);
    }
  } catch (error) {
    console.log('Error loading saved language:', error);
  }
};

// Load the saved language when the module is imported
loadSavedLanguage();

export default i18n;
