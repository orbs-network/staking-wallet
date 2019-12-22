import React from 'react';
import { observer } from 'mobx-react';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { Grid } from '@material-ui/core';
import { BalanceCard } from '../components/BalanceCard';
import styled from 'styled-components';
import { MODAL_CSTYLE_ENTERED_CONTENTS } from '../components/modals/modalsConfiguration';
import Modal from 'react-modal';
import { useBoolean } from 'react-hanger';

const GridItem = styled(props => <Grid item xs={11} sm={6} md={4} lg={4} xl={4} {...props} />)(styledProps => {
  return {};
});

export const BalanceSection = observer(() => {
  const showStakingModal = useBoolean(false);
  const showUnStakingModal = useBoolean(false);

  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={'BALANCE'} icon={AccountBalanceIcon} />

      <Grid container direction={'row'} justify={'space-between'} spacing={2}>
        <GridItem>
          <BalanceCard
            title={'Liquid Orbs in your wallet'}
            actionButtonTitle={'Stake your tokens'}
            actionButtonActive={true}
            onActionButtonPressed={showStakingModal.setTrue}
            amount={4000}
          />
        </GridItem>

        <GridItem>
          <BalanceCard
            title={'Staked Orbs in smart contract'}
            actionButtonTitle={'Unlock your tokens'}
            amount={3000}
            actionButtonActive={true}
            onActionButtonPressed={showUnStakingModal.setTrue}
          />
        </GridItem>

        <GridItem>
          <BalanceCard
            title={'Tokens in cool down'}
            actionButtonTitle={'Redeem your tokens'}
            amount={0}
            actionButtonActive={true}
            onActionButtonPressed={() => null}
          />
        </GridItem>
      </Grid>

      <Modal
        isOpen={showStakingModal.value}
        onRequestClose={showStakingModal.setFalse}
        shouldCloseOnOverlayClick={true}
        style={MODAL_CSTYLE_ENTERED_CONTENTS}
      >
        <div>Modal for Orbs Staking</div>
      </Modal>

      <Modal
        isOpen={showUnStakingModal.value}
        onRequestClose={showUnStakingModal.setFalse}
        shouldCloseOnOverlayClick={true}
        style={MODAL_CSTYLE_ENTERED_CONTENTS}
      >
        <div>Modal for Orbs Un-staking</div>
      </Modal>
    </Section>
  );
});
