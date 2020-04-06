import { observer } from 'mobx-react';
import React from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { ConnectWalletSection } from './ConnectWalletSection';
import { WalletInfoSection } from './WalletInfoSection';
import { BalancesSection } from '../sections/BalancesSection';
import { RewardsSection } from './RewardsSection';

export const WalletSectionsWrapper = observer(() => {
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  if (cryptoWalletIntegrationStore.isConnectedToWallet) {
    return (
      <div data-testid='wallet-information-sections'>
        <WalletInfoSection />
        <BalancesSection />
        <RewardsSection />
      </div>
    );
  } else {
    return <ConnectWalletSection />;
  }
});
