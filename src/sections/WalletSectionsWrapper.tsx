import { MobXProviderContext, observer } from 'mobx-react';
import React, { useCallback, useContext, useEffect } from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import ConnectWalletSection from './connect-wallet/index';
import { WalletInfoSection } from './WalletInfoSection';
import { BalancesSection } from '../sections/BalancesSection';
import { RewardsSection } from './RewardsSection';
import { addAccountChangedEvent } from '../utils/web3';
import Connect from './Connect';
// TODO : FUTURE : the tests will expect to see the "data-testid='wallet-information-sections'" so we should fix that
//  (have them looking for the sections instead)

export const WalletSectionsWrapper = observer(() => {
  const { isConnectedToWallet } = useCryptoWalletIntegrationStore();

  return isConnectedToWallet ? (
    <>
      <WalletInfoSection />
      <BalancesSection />
      <RewardsSection />
    </>
  ) : (
    <Connect />
  );
});
