import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import ConnectWalletSection from './connect-wallet/index';
import { WalletInfoSection } from './WalletInfoSection';
import { BalancesSection } from '../sections/BalancesSection';
import { RewardsSection } from './RewardsSection';
import web3Service from '../services/web3Service';

// TODO : FUTURE : the tests will expect to see the "data-testid='wallet-information-sections'" so we should fix that
//  (have them looking for the sections instead)

export const WalletSectionsWrapper = observer(() => {
  const { isConnectedToWallet } = useCryptoWalletIntegrationStore();

  useEffect(() => {
    if (isConnectedToWallet) {
      web3Service.addAccountChangedEvent();
    }
  }, [isConnectedToWallet]);

  return isConnectedToWallet ? (
    <>
      <BalancesSection />
      <RewardsSection />
    </>
  ) : (
    <ConnectWalletSection />
  );
});
