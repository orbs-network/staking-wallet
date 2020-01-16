import { configure } from 'mobx';
import { GuardiansStore } from './GuardiansStore';
import { IStores } from './stores';
import { IOrbsPOSDataService, IStakingService, IOrbsTokenService, IGuardiansService } from 'orbs-pos-data';

import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';
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
  ethereumTxService: IEthereumTxService,
  guardiansService: IGuardiansService,
): IStores {
  // Create stores instances + Hydrate the stores
  const guardiansStore = new GuardiansStore(orbsPOSDataService, guardiansService);
  const cryptoWalletIntegrationStore = new CryptoWalletConnectionStore(ethereumTxService);
  const orbsAccountStore = new OrbsAccountStore(
    cryptoWalletIntegrationStore,
    orbsPOSDataService,
    stakingService,
    orbsTokenService,
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
