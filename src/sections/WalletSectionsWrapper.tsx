import { observer } from 'mobx-react';
import React from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { ConnectWalletSection } from './ConnectWalletSection';
import { WalletInfoSection } from './WalletInfoSection';
import { BalancesSection } from '../sections/BalancesSection';
import { RewardsSection } from './RewardsSection';

// TODO : FUTURE : the tests will expect to see the "data-testid='wallet-information-sections'" so we should fix that
//  (have them looking for the sections instead)

export const WalletSectionsWrapper = observer(() => {
  const { isConnectedToWallet } = useCryptoWalletIntegrationStore();

  if (isConnectedToWallet) {
    return (
      <>
        <WalletInfoSection />
        <BalancesSection />
        <RewardsSection />
      </>
    );
  } else {
    return <ConnectWalletSection />;
  }
});
