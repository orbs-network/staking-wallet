import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import { IOrbsPOSDataService } from 'orbs-pos-data';
import { IServices } from './Services';
import { ICryptoWalletConnectionService } from './cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { IAnalyticsService } from './analytics/IAnalyticsService';
import { IHttpService } from './http/IHttpService';

function useServices(): IServices {
  return React.useContext(MobXProviderContext) as IServices;
}

export function useOrbsPOSDataService(): IOrbsPOSDataService {
  return useServices().orbsPOSDataService;
}

export function useCryptoWalletConnectionService(): ICryptoWalletConnectionService {
  return useServices().cryptoWalletConnectionService;
}

export function useAnalyticsService(): IAnalyticsService {
  return useServices().analyticsService;
}

export function useHttpService(): IHttpService {
  return useServices().httpService;
}
