/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import React from 'react';
import i18n from 'i18next';
import { PreLangBasenameProvider } from './PreLangBasenameContext';
import AppRouter from '../router/app-router';
interface IProps {
  preLangBasename?: string;
}

export const LangRouter: React.FC<IProps> = ({ children, preLangBasename = '' }) => {
  return (
    <PreLangBasenameProvider value={preLangBasename}>
      <AppRouter preLangBasename={preLangBasename}>{children}</AppRouter>
    </PreLangBasenameProvider>
  );
};
