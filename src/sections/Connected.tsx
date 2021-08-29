import React from 'react';
import { Provider } from 'mobx-react';
import { WalletInfoSection } from './WalletInfoSection';
import { BalancesSection } from '../sections/BalancesSection';
import { RewardsSection } from './RewardsSection';
import initApp from '../init';
function Connected({ provider }: any) {
  const { services, stores } = initApp(provider);
  //useConnection();
  return (
    <Provider {...services} {...stores}>
      <>
        <WalletInfoSection />
        <BalancesSection />
        <RewardsSection />
      </>
    </Provider>
  );
}

export default Connected;
