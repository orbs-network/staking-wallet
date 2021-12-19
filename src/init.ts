import { buildServices } from './services/Services';
import { configureMobx, getStores } from './store/storesInitialization';
import axios from 'axios';
import { TEthereumProviderName } from './services/analytics/IAnalyticsService';
import { detectEthereumProviderName } from './services/analytics/analyticsUtils';
import moment from 'moment';
import 'moment/locale/ja';
import 'moment/locale/ko';
import config from './config';

const initApp = (chain?: string) => {
  console.log('test')
  moment.locale('ja');
  moment.locale('ko');
  moment.locale('en');
  configureMobx();

  const urlParams = new URLSearchParams(window.location.search);
  const alertErrors = !!urlParams.get('alertErrors');
  const ethereumProvider = (window as any).ethereum;
  const services = buildServices(ethereumProvider, axios, chain ? config.networks[chain] : config.networks['default']);
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

  let ethereumProviderName: TEthereumProviderName;
  if (ethereumProvider) {
    ethereumProviderName = detectEthereumProviderName(ethereumProvider);
  } else {
    ethereumProviderName = 'ORBS Infura';
  }

  services.analyticsService.setEthereumProvider(ethereumProviderName);
  (window as any).services = services;

  return { services, stores };
};

export default initApp;
