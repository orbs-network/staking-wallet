import { useEffect } from 'react';
import i18n from 'i18next';
import moment from 'moment';
import { useLocation } from 'react-router';

function getForcedLanguage(pathname: string) {
  const langMatch = pathname.match(/\/(en|ko|jp)\/?/);
  return langMatch ? langMatch[1] : '';
}

const useLanguage = () => {
  const location = useLocation();

  const forcedLang = getForcedLanguage(location.pathname);

  const updateLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    moment.locale(lang);
  };

  useEffect(() => {
    let langBaseName = '';
    if (forcedLang) {
      langBaseName = `/${forcedLang}/`;
      if (i18n.language !== forcedLang) {
        updateLanguage(forcedLang);
      }
    } else {
      const navigatorLang = navigator.language.split('-')[0];
      if (i18n.languages.indexOf(navigatorLang) > -1) {
        if (i18n.language !== navigatorLang) {
          updateLanguage(navigatorLang);
        }
      }
    }
  }, [forcedLang]);
};

export default useLanguage;
