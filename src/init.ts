import { buildServices } from './services/Services';
import { configureMobx, getStores } from './store/storesInitialization';
import axios from 'axios';
import { TEthereumProviderName } from './services/analytics/IAnalyticsService';
import { detectEthereumProviderName } from './services/analytics/analyticsUtils';
import { AppStyles, baseTheme } from './theme/Theme';
import moment from 'moment';
import 'moment/locale/ja';
import 'moment/locale/ko';
import config from './config';

const initApp = (chain?: string) => {
  if (!chain) {
    return;
  }
  moment.locale('ja');
  moment.locale('ko');
  moment.locale('en');
  configureMobx();

  const urlParams = new URLSearchParams(window.location.search);
  const alertErrors = !!urlParams.get('alertErrors');
  const ethereumProvider = (window as any).ethereum;
  if (ethereumProvider) {
    ethereumProvider.on('networkChanged', function () {
      window.location.reload();
    });
    ethereumProvider.on('accountsChanged', function () {
      window.location.reload();
    });
  }
  const services = buildServices(ethereumProvider, axios, config.networks[chain]);
  const stores = getStores(
    services.orbsPOSDataService,
    services.stakingService,
    services.stakingRewardsService,
    services.orbsTokenService,
    services.cryptoWalletConnectionService,
    services.analyticsService,
    services.orbsNodeService,
    services.delegationsService,
    alertErrors,
  );
  services.analyticsService.init();

  // TODO : FUTURE : O.L : Move this with the analytics 'init'
  let ethereumProviderName: TEthereumProviderName;
  if (ethereumProvider) {
    ethereumProviderName = detectEthereumProviderName(ethereumProvider);
  } else {
    ethereumProviderName = 'ORBS Infura';
  }

  services.analyticsService.setEthereumProvider(ethereumProviderName);
  (window as any).services = services;

  const themeAndStyle = {
    ...baseTheme,
    styles: AppStyles,
  };

  return { services, stores, themeAndStyle, chainId: chain };
};

export default initApp;
