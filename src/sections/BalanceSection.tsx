import React from 'react';
import { observer } from 'mobx-react';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { Grid } from '@material-ui/core';
import { BalanceCard } from '../components/BalanceCard';

export const BalanceSection = observer(() => {
  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={'BALANCE'} icon={AccountBalanceIcon} />

      <Grid container direction={'row'} justify={'space-between'}>
        <BalanceCard title={'Liquid Orbs in your wallet'} buttonTitle={'Stake your tokens'} amount={4000} />

        <BalanceCard title={'Staked Orbs in smart contract'} buttonTitle={'Unlock your tokens'} amount={3000} />

        <BalanceCard title={'Tokens in cool down'} buttonTitle={'Reddem your tokens'} amount={0} />
      </Grid>
    </Section>
  );
});
