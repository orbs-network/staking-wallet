import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { GuardiansSection } from '../sections/GuardiansSection';
import { WalletSectionsWrapper } from '../sections/WalletSectionsWrapper';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';

export const MainAppPage = observer(() => {
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();

  // DEV_NOTE : Currently not showing the guardians table to mobile
  const canAndShouldDisplayGuardians =
    cryptoWalletConnectionStore.hasEthereumProvider && cryptoWalletConnectionStore.isConnectedToWallet;

  return (
    <Grid container direction={'column'} id={'mainPage'}>
      <WalletSectionsWrapper />
      {canAndShouldDisplayGuardians && <GuardiansSection />}
    </Grid>
  );
});
