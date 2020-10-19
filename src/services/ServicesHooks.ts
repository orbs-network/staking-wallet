import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import { IOrbsPOSDataService } from 'orbs-pos-data';
import { IServices } from './Services';
import { IAnalyticsService } from './analytics/IAnalyticsService';
import { IHttpService } from './http/IHttpService';
import {
  ICommitteeService,
  ICryptoWalletConnectionService,
  IDelegationsService,
  IGuardiansService,
  IStakingRewardsService,
} from '@orbs-network/contracts-js';

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

export function useGuardiansService(): IGuardiansService {
  return useServices().guardiansService;
}

export function useStakingRewardsService(): IStakingRewardsService {
  return useServices().stakingRewardsService;
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
