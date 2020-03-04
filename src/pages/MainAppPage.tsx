import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { RewardsSection } from '../sections/RewardsSection';
import { GuardiansSection } from '../sections/GuardiansSection';
import { WalletSectionsWrapper } from '../sections/WalletSectionsWrapper';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';

export const MainAppPage = observer(() => {
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();
  const canAndShouldDisplayGuardians =
    cryptoWalletConnectionStore.isMetamaskInstalled && cryptoWalletConnectionStore.isConnectedToWallet;

  return (
    <Grid container direction={'column'}>
      <WalletSectionsWrapper />
      {/*<RewardsSection />*/}
      {canAndShouldDisplayGuardians && <GuardiansSection />}
    </Grid>
  );
});
