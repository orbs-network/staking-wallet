import axios from 'axios';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { AppStyles, baseTheme, GlobalStyleComponent } from './theme/Theme';
import { Provider } from 'mobx-react';
import React from 'react';
import { App } from './App';
import { buildServices } from './services/Services';
import { configureMobx, getStores } from './store/storesInitialization';
import { LangRouter } from './multi-lang/LangRouter';

// TODO : O.L : FUTURE : Consider moving this language initialization
//                       + Change the locale when switching language
// DEV_NOTE : This is where we define the used locales for moment.js
import 'moment/locale/ja';
import 'moment/locale/ko';
import moment from 'moment';
import config, { IS_DEV } from './config';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { TEthereumProviderName } from './services/analytics/IAnalyticsService';
import Web3 from 'web3';
import { detectEthereumProviderName } from './services/analytics/analyticsUtils';
moment.locale('ja');
moment.locale('ko');
moment.locale('en');

configureMobx();

const ethereumProvider = (window as any).ethereum;
const services = buildServices(ethereumProvider, axios);
const stores = getStores(
  services.orbsPOSDataService,
  services.stakingService,
  services.stakingRewardsService,
  services.orbsTokenService,
  services.cryptoWalletConnectionService,
  services.rewardsService,
  services.analyticsService,
  services.orbsNodeService,
  services.delegationsService,
);

// TODO : FUTURE : O.L : Move this to a better location
services.analyticsService.init();

// TODO : FUTURE : O.L : Move this with the analytics 'init'
let ethereumProviderName: TEthereumProviderName;
if (ethereumProvider) {
  ethereumProviderName = detectEthereumProviderName(ethereumProvider);
} else {
  ethereumProviderName = 'ORBS Infura';
}
services.analyticsService.setEthereumProvider(ethereumProviderName);

const themeAndStyle = {
  ...baseTheme,
  styles: AppStyles,
};

export const AppWrapper: React.FunctionComponent = () => (
  <LangRouter preLangBasename={IS_DEV ? '' : config.urlBase}>
    <I18nextProvider i18n={i18n}>
      <Provider {...services} {...stores}>
        <StylesProvider injectFirst>
          <ThemeProvider theme={baseTheme}>
            <SCThemeProvider theme={themeAndStyle}>
              {/*<GlobalStyleComponent />*/}
              <CssBaseline />
              <App />
            </SCThemeProvider>
          </ThemeProvider>
        </StylesProvider>
      </Provider>
    </I18nextProvider>
  </LangRouter>
);
