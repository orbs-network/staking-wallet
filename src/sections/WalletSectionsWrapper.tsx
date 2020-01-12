import { observer } from 'mobx-react';
import React from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { ConnectWalletSection } from './ConnectWalletSection';
import { WalletInfoSection } from './WalletInfoSection';
import { BalancesSection } from '../sections/BalancesSection';

export const WalletSectionsWrapper = observer(() => {
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  if (cryptoWalletIntegrationStore.isConnectedToWallet) {
    return (
      <span data-testid='wallet-information-sections'>
        <WalletInfoSection />
        <BalancesSection />
      </span>
    );
  } else {
    return <ConnectWalletSection />;
  }
});
