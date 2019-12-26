import React from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';

import { WalletInfoSection } from './WalletInfoSection';
import { ConnectWalletSection } from './ConnectWalletSection';

export const WalletSectionsWrapper = observer(() => {
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  if (cryptoWalletIntegrationStore.isConnectedToWallet) {
    return <WalletInfoSection />;
  } else {
    return <ConnectWalletSection />;
  }
});
