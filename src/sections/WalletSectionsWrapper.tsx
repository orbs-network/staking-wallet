import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import ConnectWalletSection from './connect-wallet/index';
import Connected from './Connected';
import initApp from '../init';

// TODO : FUTURE : the tests will expect to see the "data-testid='wallet-information-sections'" so we should fix that
//  (have them looking for the sections instead)

export const WalletSectionsWrapper = observer(() => {
  const [provider, setProvider] = useState(null);
  return provider ? <Connected provider={provider} /> : <ConnectWalletSection setProvider={setProvider} />;
});
