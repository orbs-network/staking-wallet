/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import i18n from 'i18next';
import { PreLangBasenameProvider } from './PreLangBasenameContext';
import { initReactI18next } from 'react-i18next';
import { resources } from '../translations/translations';

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
  return (
    <PreLangBasenameProvider value={preLangBasename}>
      <Router basename={`${preLangBasename}`}>{children}</Router>
    </PreLangBasenameProvider>
  );
};
