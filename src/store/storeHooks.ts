import React from 'react';
import { MobXProviderContext } from 'mobx-react';
import { IStores } from './stores';
import { TGuardiansStore } from './GuardiansStore';
import { TCryptoWalletIntegrationStore } from './CryptoWalletIntegrationStore';

export function useStores(): IStores {
  return React.useContext(MobXProviderContext);
}

export function useGuardiansStore(): TGuardiansStore {
  return useStores().guardiansStore;
}

export function useCryptoWalletIntegrationStore(): TCryptoWalletIntegrationStore {
  return useStores().cryptoWalletIntegrationStore;
}
