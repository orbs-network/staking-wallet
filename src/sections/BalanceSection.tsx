import React from 'react';
import { observer } from 'mobx-react';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { Grid } from '@material-ui/core';
import { BalanceCard } from '../components/BalanceCard';
import styled from 'styled-components';

const GridItem = styled(props => <Grid item xs={11} sm={6} md={4} lg={4} xl={4} {...props} />)(styledProps => {
  return {};
});

export const BalanceSection = observer(() => {
  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={'BALANCE'} icon={AccountBalanceIcon} />

      <Grid container direction={'row'} justify={'space-between'} spacing={2}>
        <GridItem>
          <BalanceCard title={'Liquid Orbs in your wallet'} buttonTitle={'Stake your tokens'} amount={4000} />
        </GridItem>

        <GridItem>
          <BalanceCard title={'Staked Orbs in smart contract'} buttonTitle={'Unlock your tokens'} amount={3000} />
        </GridItem>

        <GridItem>
          <BalanceCard title={'Tokens in cool down'} buttonTitle={'Reddem your tokens'} amount={0} />
        </GridItem>
      </Grid>
    </Section>
  );
});
