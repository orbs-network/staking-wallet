import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import { IOrbsPOSDataService } from 'orbs-pos-data';
import { IServices } from './Services';
import { ICryptoWalletConnectionService } from './cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { IAnalyticsService } from './analytics/IAnalyticsService';
import { IHttpService } from './http/IHttpService';
import { IDelegationsService } from './v2/delegationsService/IDelegationsService';
import { ICommitteeService } from './v2/committeeService/ICommitteeService';

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

export function useDelegationsService(): IDelegationsService {
  return useServices().delegationsService;
}

export function useCommitteeService(): ICommitteeService {
  return useServices().committeeService;
}
