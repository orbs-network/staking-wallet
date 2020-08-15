import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import { IStores } from './stores';
import { GuardiansStore } from './GuardiansStore';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { OrbsAccountStore } from './OrbsAccountStore';
import { OrbsNodeStore } from './OrbsNodeStore';

export function useStores(): IStores {
  // @ts-ignore
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

export function useOrbsNodeStore(): OrbsNodeStore {
  return useStores().orbsNodeStore;
}
