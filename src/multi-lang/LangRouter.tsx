/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import i18n, { Resource } from 'i18next';
import { PreLangBasenameProvider } from './PreLangBasenameContext';
import { initReactI18next } from 'react-i18next';
import { resources } from '../translations/translations';

function getForcedLanguage() {
  const langMatch = window.location.pathname.match(/\/(en|ko|jp)\//);
  return langMatch ? langMatch[1] : '';
}

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

interface IProps {
  preLangBasename?: string;
}

export const LangRouter: React.FC<IProps> = ({ children, preLangBasename = '' }) => {
  const forcedLang = getForcedLanguage();
  let langBaseName = '';
  if (forcedLang) {
    langBaseName = `/${forcedLang}/`;
    if (i18n.language !== forcedLang) {
      i18n.changeLanguage(forcedLang);
    }
  } else {
    const navigatorLang = navigator.language.split('-')[0];
    if (i18n.languages.indexOf(navigatorLang) > -1) {
      if (i18n.language !== navigatorLang) {
        i18n.changeLanguage(navigatorLang);
      }
    }
  }

  return (
    <I18nextProvider i18n={i18n}>
      <PreLangBasenameProvider value={preLangBasename}>
        <Router basename={`${preLangBasename}${langBaseName}`}>{children}</Router>
      </PreLangBasenameProvider>
    </I18nextProvider>
  );
};
