import React from 'react';
import { MyWalletPage } from './MyWalletPage';
import { ConnectWalletPage } from './ConnectWalletPage';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';

export const WalletPageWrapper = observer(() => {
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  if (cryptoWalletIntegrationStore.isConnectedToWallet) {
    return <MyWalletPage />;
  } else {
    return <ConnectWalletPage />;
  }
});
