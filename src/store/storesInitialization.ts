import { configure } from 'mobx';
import { GuardiansStore } from './GuardiansStore';
import { IStores } from './stores';
import { IOrbsPOSDataService } from 'orbs-pos-data';

import { CryptoWalletIntegrationStore } from './CryptoWalletIntegrationStore';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';
import { OrbsAccountStore } from './OrbsAccountStore';
import { IOrbsContractsService } from '../services/orbsContractsService/IOrbsContractsService';

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
  orbsContractsService: IOrbsContractsService,
  ethereumTxService: IEthereumTxService,
): IStores {
  // Create stores instances + Hydrate the stores
  const guardiansStore = new GuardiansStore(orbsPOSDataService);
  const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);
  const orbsAccountStore = new OrbsAccountStore(cryptoWalletIntegrationStore, orbsPOSDataService, orbsContractsService);

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
