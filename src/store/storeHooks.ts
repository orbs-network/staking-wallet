import React, { useCallback } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { IStores } from './stores';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { OrbsAccountStore } from './OrbsAccountStore';
import { OrbsNodeStore } from './OrbsNodeStore';

export function useStores(): IStores {
  // @ts-ignore
  return React.useContext(MobXProviderContext);
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

export function useReReadAllStoresData() {
  const orbsAccountStore = useOrbsAccountStore();

  const reReadAllStoresData = useCallback(() => {
    orbsAccountStore.manuallyReadAccountData();
  }, [orbsAccountStore]);

  return reReadAllStoresData;
}
