import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import { IStores } from './stores';
import { GuardiansStore, TGuardiansStore } from './GuardiansStore';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { OrbsAccountStore } from './OrbsAccountStore';

export function useStores(): IStores {
  return React.useContext(MobXProviderContext);
}

export function useGuardiansStore(): GuardiansStore {
  return useStores().guardiansStore;
}

export function useCryptoWalletIntegrationStore(): CryptoWalletConnectionStore {
  return useStores().cryptoWalletIntegrationStore;
}

export function useOrbsAccountStore(): OrbsAccountStore {
  return useStores().orbsAccountStore;
}
