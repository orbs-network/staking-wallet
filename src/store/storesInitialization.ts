import { configure } from 'mobx';
import { GuardiansStore } from './GuardiansStore';
import { IStores } from './stores';
import { OrbsPOSDataService } from 'orbs-pos-data';

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
export function getStores(orbsPOSDataService: OrbsPOSDataService): IStores {
  // Create stores instances + Hydrate the stores
  const guardiansStore = new GuardiansStore(orbsPOSDataService);


  // Call the initialize function on each one
  // NOTE : FUTURE : O.L : Should consider the order and relation between Hydrating and 'init'
  // NOTE : FUTURE : O.L : Should handle the async calls properly
  guardiansStore.init();

  const stores: IStores = {
    guardiansStore,
  };

  return stores;
}
