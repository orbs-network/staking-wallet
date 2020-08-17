import { configure } from 'mobx';
import { GuardiansStore } from './GuardiansStore';
import { IStores } from './stores';
import {
  IOrbsPOSDataService,
  IStakingService,
  IOrbsTokenService,
  IGuardiansService,
  IOrbsRewardsService,
} from 'orbs-pos-data';

import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { ICryptoWalletConnectionService } from '../services/cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { OrbsAccountStore } from './OrbsAccountStore';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';
import { OrbsNodeStore } from './OrbsNodeStore';
import { IOrbsNodeService } from '../services/v2/orbsNodeService/IOrbsNodeService';
import { IDelegationsService } from '../services/v2/delegationsService/IDelegationsService';

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
  orbsTokenService: IOrbsTokenService,
  cryptoWalletConnectionService: ICryptoWalletConnectionService,
  guardiansService: IGuardiansService,
  orbsRewardsService: IOrbsRewardsService,
  analyticsService: IAnalyticsService,
  orbsNodeService: IOrbsNodeService,
  delegationsService: IDelegationsService,
): IStores {
  // Create stores instances + Hydrate the stores
  const orbsNodeStore = new OrbsNodeStore(orbsNodeService);
  const cryptoWalletIntegrationStore = new CryptoWalletConnectionStore(cryptoWalletConnectionService, analyticsService);
  const guardiansStore = new GuardiansStore(
    cryptoWalletIntegrationStore,
    orbsPOSDataService,
    guardiansService,
    analyticsService,
  );
  const orbsAccountStore = new OrbsAccountStore(
    cryptoWalletIntegrationStore,
    orbsNodeStore,
    orbsPOSDataService,
    stakingService,
    orbsTokenService,
    orbsRewardsService,
    analyticsService,
    delegationsService,
  );

  // Call the initialize function on each one
  // NOTE : FUTURE : O.L : Should consider the order and relation between Hydrating and 'init'
  // NOTE : FUTURE : O.L : Should handle the async calls properly
  guardiansStore.init();

  const stores: IStores = {
    guardiansStore,
    cryptoWalletIntegrationStore,
    orbsAccountStore,
    orbsNodeStore,
  };

  return stores;
}
