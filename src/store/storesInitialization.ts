import { configure } from 'mobx';
import { IStores } from './stores';
import { IOrbsPOSDataService, IOrbsTokenService, IOrbsRewardsService } from 'orbs-pos-data';

// This import ensures mobx batching
import 'mobx-react-lite/batchingForReactDom';

import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { OrbsAccountStore } from './OrbsAccountStore';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';
import { OrbsNodeStore } from './OrbsNodeStore';
import { IOrbsNodeService } from '../services/v2/orbsNodeService/IOrbsNodeService';
import {
  ElectionsService,
  ICommitteeService,
  ICryptoWalletConnectionService,
  IDelegationsService,
  IElectionsService,
  IStakingRewardsService,
  IStakingService,
} from '@orbs-network/contracts-js';

/**
 * Configures the mobx library. Should get called at App's initialization.
 */
export function configureMobx() {
  configure({
    enforceActions: 'observed',
  });
}

/**
 * Builds and initializes all of the stores
 */
export function getStores(
  orbsPOSDataService: IOrbsPOSDataService,
  stakingService: IStakingService,
  stakingRewardsService: IStakingRewardsService,
  orbsTokenService: IOrbsTokenService,
  cryptoWalletConnectionService: ICryptoWalletConnectionService,
  analyticsService: IAnalyticsService,
  orbsNodeService: IOrbsNodeService,
  delegationsService: IDelegationsService,
  electionsService: IElectionsService,
  alertErrors = false,
): IStores {
  // Create stores instances + Hydrate the stores
  const orbsNodeStore = new OrbsNodeStore(orbsNodeService, electionsService);
  const cryptoWalletIntegrationStore = new CryptoWalletConnectionStore(cryptoWalletConnectionService, analyticsService);
  const orbsAccountStore = new OrbsAccountStore(
    cryptoWalletIntegrationStore,
    orbsNodeStore,
    orbsPOSDataService,
    stakingService,
    stakingRewardsService,
    orbsTokenService,
    analyticsService,
    delegationsService,
    alertErrors,
  );

  const stores: IStores = {
    cryptoWalletIntegrationStore,
    orbsAccountStore,
    orbsNodeStore,
  };

  return stores;
}
