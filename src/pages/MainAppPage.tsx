import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { BalanceSection } from '../sections/BalanceSection';
import { RewardsSection } from '../sections/RrewardsSection';
import { GuardiansSection } from '../sections/GuardiansSection';
import { WalletSectionsWrapper } from '../sections/WalletSectionsWrapper';

export const MainAppPage = observer(() => {
  return (
    <Grid container direction={'column'}>
      <WalletSectionsWrapper />

      {/* Balance */}
      <BalanceSection />

      {/* Rewards */}
      <RewardsSection />

      {/* Guardians */}
      <GuardiansSection />
    </Grid>
  );
});
