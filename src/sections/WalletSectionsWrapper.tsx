import { observer } from 'mobx-react';
import React  from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import ConnectWalletSection from './connect-wallet/index';
import { BalancesSection } from '../sections/BalancesSection';
import { RewardsSection } from './RewardsSection';
import BridgeWarning from '../warnings/BridgeWarning';
import NoBalanceWarning from '../warnings/NoBalanceWarning';

// TODO : FUTURE : the tests will expect to see the "data-testid='wallet-information-sections'" so we should fix that
//  (have them looking for the sections instead)

export const WalletSectionsWrapper = observer(() => {
  const store = useCryptoWalletIntegrationStore();



  return store.isConnected ? (
    <>
      <BalancesSection />
      <RewardsSection />
      <BridgeWarning />
      <NoBalanceWarning />
    </>
  ) : (
    <ConnectWalletSection />
  );
});
