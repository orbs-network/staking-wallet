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

// DEV_NOTE : O.L : This import add MobX batching (https://github.com/mobxjs/mobx-react-lite/#observer-batching)
import 'mobx-react-lite/batchingForReactDom';


import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { ICryptoWalletConnectionService } from '../services/cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { OrbsAccountStore } from './OrbsAccountStore';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';

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
): IStores {
  // Create stores instances + Hydrate the stores
  const cryptoWalletIntegrationStore = new CryptoWalletConnectionStore(cryptoWalletConnectionService, analyticsService);
  const guardiansStore = new GuardiansStore(
    cryptoWalletIntegrationStore,
    orbsPOSDataService,
    guardiansService,
    analyticsService,
  );
  const orbsAccountStore = new OrbsAccountStore(
    cryptoWalletIntegrationStore,
    guardiansStore,
    orbsPOSDataService,
    stakingService,
    orbsTokenService,
    guardiansService,
    orbsRewardsService,
    analyticsService,
  );

  // Call the initialize function on each one
  // NOTE : FUTURE : O.L : Should consider the order and relation between Hydrating and 'init'
  // NOTE : FUTURE : O.L : Should handle the async calls properly
  guardiansStore.init();

  const stores: IStores = {
    guardiansStore,
    cryptoWalletIntegrationStore,
    orbsAccountStore,
  };

  return stores;
}
