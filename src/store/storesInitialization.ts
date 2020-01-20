import { configure } from 'mobx';
import { GuardiansStore } from './GuardiansStore';
import { IStores } from './stores';
import { IOrbsPOSDataService, IStakingService, IOrbsTokenService, IGuardiansService } from 'orbs-pos-data';

import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { ICryptoWalletConnectionService } from '../services/cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { OrbsAccountStore } from './OrbsAccountStore';

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
): IStores {
  // Create stores instances + Hydrate the stores
  const cryptoWalletIntegrationStore = new CryptoWalletConnectionStore(cryptoWalletConnectionService);
  const guardiansStore = new GuardiansStore(cryptoWalletIntegrationStore, orbsPOSDataService, guardiansService);
  const orbsAccountStore = new OrbsAccountStore(
    cryptoWalletIntegrationStore,
    orbsPOSDataService,
    stakingService,
    orbsTokenService,
    guardiansService,
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
