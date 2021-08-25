import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '../../translations/translations';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: '.',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
