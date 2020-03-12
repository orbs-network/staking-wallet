import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { RewardsSection } from '../sections/RewardsSection';
import { GuardiansSection } from '../sections/GuardiansSection';
import { WalletSectionsWrapper } from '../sections/WalletSectionsWrapper';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const MainAppPage = observer(() => {
  const theme = useTheme();
  // TODO : O.L : Remove this limitation after fixing the table section styling
  const largerThanSmall = useMediaQuery(theme.breakpoints.up('sm'));

  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();

  // DEV_NOTE : Currently not showing the guardians table to mobile
  const canAndShouldDisplayGuardians =
    largerThanSmall &&
    cryptoWalletConnectionStore.isMetamaskInstalled &&
    cryptoWalletConnectionStore.isConnectedToWallet;

  return (
    <Grid container direction={'column'}>
      <WalletSectionsWrapper />
      {/*<RewardsSection />*/}
      {canAndShouldDisplayGuardians && <GuardiansSection />}
    </Grid>
  );
});
