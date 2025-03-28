import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as resources from "./resources";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: Object.keys(resources).reduce((acc, key) => {
    acc[key] = { translation: resources[key] };
    return acc;
  }, {}),
  lng: "en",
  fallbackLng: "en",
});

export default i18n;
