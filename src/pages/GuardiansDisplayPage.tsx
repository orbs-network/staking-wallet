import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { GuardiansSection } from '../sections/guardians/GuardiansSection';
import { WalletSectionsWrapper } from '../sections/WalletSectionsWrapper';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { useAnalyticsService } from '../services/ServicesHooks';

export const GuardianDisplayPage = observer(() => {
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();
  const analyticsService = useAnalyticsService();

  // DEV_NOTE : Currently not showing the guardians table to mobile

  // // DEV_NOTE : id the user is connected than we consider this as a 'log in' for analytics purposes
  // useEffect(() => {
  //   if (cryptoWalletConnectionStore.hasEthereumProvider && cryptoWalletConnectionStore.isConnectedToWallet) {
  //     analyticsService.trackAppLogin();
  //   }
  // }, [
  //   analyticsService,
  //   cryptoWalletConnectionStore.hasEthereumProvider,
  //   cryptoWalletConnectionStore.isConnectedToWallet,
  // ]);

  return (
    <Grid container item direction={'column'} id={'guardianDisplayPage'}>
      <GuardiansSection />
    </Grid>
  );
});
