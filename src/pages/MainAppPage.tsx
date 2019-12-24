import React from 'react';
import { observer } from 'mobx-react';
import { WalletPageWrapper } from './WalletPageWrapper';
import { SectionHeader } from '../components/structure/SectionHeader';
import SecurityIcon from '@material-ui/icons/Security';
import StarIcon from '@material-ui/icons/Star';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Grid } from '@material-ui/core';
import { WalletInfoSection } from '../sections/WalletInfoSection';
import { BalanceSection } from '../sections/BalanceSection';
import { RewardsSection } from '../sections/RrewardsSection';
import { GuardiansSection } from '../sections/GuardiansSection';

export const MainAppPage = observer(() => {
  return (
    <Grid container direction={'column'}>
      {/*<WalletPageWrapper />*/}

      <WalletInfoSection />

      {/* Balance */}
      <BalanceSection />

      {/* Rewards */}
      <RewardsSection />

      {/* Guardians */}
      <GuardiansSection />
    </Grid>
  );
});
