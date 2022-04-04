import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import ConnectWalletSection from './connect-wallet/index';
import { BalancesSection } from '../sections/BalancesSection';
import { RewardsSection } from './RewardsSection';
import web3Service from '../services/web3Service';
import BridgeWarning from '../warnings/BridgeWarning';
import NoBalanceWarning from '../warnings/NoBalanceWarning';
import { hasInjectedProvider } from '../constants';
import { useAppContext } from '../context/app-context';

// TODO : FUTURE : the tests will expect to see the "data-testid='wallet-information-sections'" so we should fix that
//  (have them looking for the sections instead)

export const WalletSectionsWrapper = observer(() => {
  const { provider } = useAppContext();

  useEffect(() => {
    if (hasInjectedProvider && provider) {
      web3Service.addAccountChangedEvent();
    }
  }, [provider]);

  return provider ? (
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
