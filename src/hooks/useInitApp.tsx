import { buildServices } from '../services/Services';
import { configureMobx, getStores } from '../store/storesInitialization';
import axios from 'axios';
import { TEthereumProviderName } from '../services/analytics/IAnalyticsService';
import { detectEthereumProviderName } from '../services/analytics/analyticsUtils';
import { AppStyles, baseTheme } from '../theme/Theme';

const useInitApp = () => {
  configureMobx();

  const urlParams = new URLSearchParams(window.location.search);
  const alertErrors = !!urlParams.get('alertErrors');

  const ethereumProvider = (window as any).ethereum;
  const services = buildServices(ethereumProvider, axios);
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

  // @ts-ignore
  window.services = services;

  const themeAndStyle = {
    ...baseTheme,
    styles: AppStyles,
  };
  return { services, stores, themeAndStyle, baseTheme };
};

export default useInitApp;
