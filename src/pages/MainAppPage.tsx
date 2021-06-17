import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { GuardiansSection } from '../sections/guardians/GuardiansSection';
import { WalletSectionsWrapper } from '../sections/WalletSectionsWrapper';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { useAnalyticsService } from '../services/ServicesHooks';

export const MainAppPage = observer(() => {
  const { hasEthereumProvider, isConnectedToWallet } = useCryptoWalletIntegrationStore();
  const analyticsService = useAnalyticsService();

  // DEV_NOTE : id the user is connected than we consider this as a 'log in' for analytics purposes
  useEffect(() => {
    if (hasEthereumProvider && isConnectedToWallet) {
      analyticsService.trackAppLogin();
    }
  }, [analyticsService, hasEthereumProvider, isConnectedToWallet]);

  return (
    <Grid container item direction={'column'} id={'mainPage'}>
      <WalletSectionsWrapper />
      <GuardiansSection />
    </Grid>
  );
});
