/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { useLocation } from 'react-router';
import React, { useContext } from 'react';
import { PreLangBasenameContext } from './PreLangBasenameContext';
import { Link } from 'react-router-dom';
import config from '../../config';

function addLangToCurrentLocation(location, preLangBasename: string, lang: string) {
  const langRegexp = /\/(en|ko|jp)\//;
  const locationWithProperLang = location.pathname.match(langRegexp)
    ? location.pathname.replace(langRegexp, `/${lang}/`)
    : `/${lang}${location.pathname}`;

  return locationWithProperLang;
}

function addLangToCurrentLocationBasic(lang: string, base = '') {
  return `/${lang}`;
}

interface IProps {
  location: any;
  lang: string;
}

export const ChangeLangLink: React.FC<IProps> = ({ lang, location, children, ...others }) => {
  // TODO : FUTURE : O.L : Change this 'a' to 'Link'
  return (
    // <a href={addLangToCurrentLocation(location, preLangBasename, lang)} {...others}>
    //   {children}
    // </a>
    <Link to={addLangToCurrentLocation(location, config.urlBase, lang)} {...others}>
      {children}
    </Link>
  );
};
