import { Grid } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { observer } from 'mobx-react';
import React from 'react';
import { useBoolean } from 'react-hanger';
import styled from 'styled-components';
import { BalanceCard } from '../components/BalanceCard';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useOrbsAccountStore } from '../store/storeHooks';
import { StakingWizard } from '../wizards/staking/StakingWizard';
import { UnstakingWizard } from '../wizards/unstaking/UnstakingWizard';

const GridItem = styled(props => <Grid item xs={11} sm={6} md={4} lg={4} xl={4} {...props} />)(styledProps => {
  return {};
});

export const BalancesSection = observer(() => {
  const orbsAccountStore = useOrbsAccountStore();

  const showStakingModal = useBoolean(false);
  const showUnStakingModal = useBoolean(false);

  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={'BALANCE'} icon={AccountBalanceIcon} />

      <Grid container direction={'row'} justify={'space-between'} spacing={2}>
        <GridItem>
          <BalanceCard
            title={'Unstaked Orbs in your wallet'}
            actionButtonTitle={'Stake your tokens'}
            actionButtonActive={true}
            onActionButtonPressed={showStakingModal.setTrue}
            amount={parseInt(orbsAccountStore.liquidOrbs)}
            balanceCardTestId={'balance_card_liquid_orbs'}
          />
        </GridItem>

        <GridItem>
          <BalanceCard
            title={'Staked Orbs in smart contract'}
            actionButtonTitle={'Unlock your tokens'}
            amount={orbsAccountStore.stakedOrbs}
            actionButtonActive={true}
            onActionButtonPressed={showUnStakingModal.setTrue}
            balanceCardTestId={'balance_card_staked_orbs'}
          />
        </GridItem>

        <GridItem>
          <BalanceCard
            title={'Tokens in cooldown'}
            actionButtonTitle={'Withdraw your tokens'}
            amount={orbsAccountStore.orbsInCoolDown}
            actionButtonActive={true}
            onActionButtonPressed={() => null}
            balanceCardTestId={'balance_card_cool_down_orbs'}
          />
        </GridItem>
      </Grid>

      <Modal open={showStakingModal.value} onClose={showStakingModal.setFalse}>
        <StakingWizard closeWizard={showStakingModal.setFalse} />
      </Modal>

      <Modal open={showUnStakingModal.value} onClose={showUnStakingModal.setFalse}>
        <UnstakingWizard closeWizard={showUnStakingModal.setFalse} />
      </Modal>
    </Section>
  );
});
