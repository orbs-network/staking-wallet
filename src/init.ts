import { buildServices } from './services/Services';
import { configureMobx, getStores } from './store/storesInitialization';
import axios from 'axios';
import { TEthereumProviderName } from './services/analytics/IAnalyticsService';
import { detectEthereumProviderName } from './services/analytics/analyticsUtils';
import moment from 'moment';
import 'moment/locale/ja';
import 'moment/locale/ko';
import { DEFAULT_CHAIN } from './constants';
import Web3 from 'web3';
import config from '../config';

const initApp = async (provider: any, chain: number) => {
  moment.locale('ja');
  moment.locale('ko');
  moment.locale('en');
  configureMobx();

  const urlParams = new URLSearchParams(window.location.search);
  const alertErrors = !!urlParams.get('alertErrors');

  const infuraProvider = new Web3.providers.HttpProvider(config.networks[chain].rpcUrls[0]);
  const ethereumProvider = provider || infuraProvider;

  const services = await buildServices(ethereumProvider, axios, chain);

  const stores = getStores(
    services.orbsPOSDataService,
    services.stakingService,
    services.stakingRewardsService,
    services.orbsTokenService,
    services.cryptoWalletConnectionService,
    services.analyticsService,
    services.orbsNodeService,
    services.delegationsService,
    services.electionsService,
    alertErrors,
    ethereumProvider.ethereum && ethereumProvider.isMetaMask ? true : false,
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
