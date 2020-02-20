import { Grid } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { observer } from 'mobx-react';
import React, { useMemo } from 'react';
import { useBoolean, useNumber } from 'react-hanger';
import styled from 'styled-components';
import { BalanceCard } from '../components/BalanceCard';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useOrbsAccountStore } from '../store/storeHooks';
import { StakingWizard } from '../wizards/staking/StakingWizard';
import { UnstakingWizard } from '../wizards/unstaking/UnstakingWizard';
import { WithdrawingWizard } from '../wizards/withdrawing/WithdrawingWizard';
import { RestakingWizard } from '../wizards/restaking/RestakingWizard';
import { useOrbsInCooldownState } from '../store/storeStateHooks';
import { fullOrbsFromWeiOrbs } from '../cryptoUtils/unitConverter';
import Snackbar from '@material-ui/core/Snackbar';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import moment from 'moment';
import { TimeLeftCounter } from '../components/timeCounter/TimeLeftCounter';
import { useTranslation } from 'react-i18next';
import { useSectionsTitlesTranslations } from '../translations/translationsHooks';

const GridItem = styled(props => <Grid item xs={11} sm={6} md={4} lg={4} xl={4} {...props} />)(styledProps => {
  return {};
});

export const BalancesSection = observer(() => {
  const { t } = useTranslation();
  const rerenderNumber = useNumber(0);
  const sectionTitlesTr = useSectionsTitlesTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  const showStakingModal = useBoolean(false);
  const showUnStakingModal = useBoolean(false);
  const showCannotUnstakeNowSnackbar = useBoolean(false);
  const showRestakingModal = useBoolean(false);
  const showWithdrawingModal = useBoolean(false);

  const { hasOrbsInCooldown, canWithdrawCooldownOrbs } = useOrbsInCooldownState();

  const { orbsInCooldownBoxButtonAction, orbsInCooldownBoxButtonText } = useMemo(() => {
    let orbsInCooldownBoxButtonAction;
    let orbsInCooldownBoxButtonText: string;
    let orbsInCooldownBoxTitle;

    if (hasOrbsInCooldown && canWithdrawCooldownOrbs) {
      orbsInCooldownBoxButtonAction = showWithdrawingModal.setTrue;
      orbsInCooldownBoxButtonText = 'Withdraw your tokens';
    } else {
      orbsInCooldownBoxButtonAction = showRestakingModal.setTrue;
      orbsInCooldownBoxButtonText = 'Restake your tokens';
    }

    return {
      orbsInCooldownBoxButtonAction,
      orbsInCooldownBoxButtonText,
    };
  }, [canWithdrawCooldownOrbs, hasOrbsInCooldown, showRestakingModal.setTrue, showWithdrawingModal.setTrue]);

  const { orbsInCooldownBoxTitle, orbsInCooldownBoxEnabled } = useMemo(() => {
    let orbsInCooldownBoxTitle;
    let orbsInCooldownBoxEnabled = true;

    // No Tokens in cooldown ? Disable the balance box
    if (!hasOrbsInCooldown) {
      orbsInCooldownBoxTitle = 'No Tokens in cooldown';
      orbsInCooldownBoxEnabled = false;
    } else if (hasOrbsInCooldown && !canWithdrawCooldownOrbs) {
      // We only want to show time left if there is some time left
      orbsInCooldownBoxTitle = () => (
        <>
          {/* TODO : O.L : DESIGN : Decide on how to display how much time is left */}
          {/*// TODO : translate*/}
          Tokens in cooldown (
          <TimeLeftCounter
            onToMomentReached={rerenderNumber.increase}
            toTimestamp={orbsAccountStore.cooldownReleaseTimestamp}
          />{' '}
          left)
        </>
      );
    } else {
      // TODO : translate
      orbsInCooldownBoxTitle = 'Tokens ready for withdrawal';
    }

    return {
      orbsInCooldownBoxTitle,
      orbsInCooldownBoxEnabled,
    };
  }, [canWithdrawCooldownOrbs, hasOrbsInCooldown, orbsAccountStore.cooldownReleaseTimestamp, rerenderNumber.increase]);

  const onUnstakeTokensClicked = useMemo(() => {
    if (orbsAccountStore.hasOrbsToWithdraw) {
      return () => showCannotUnstakeNowSnackbar.setTrue();
    } else {
      return () => showUnStakingModal.setTrue();
    }
  }, [orbsAccountStore.hasOrbsToWithdraw, showCannotUnstakeNowSnackbar, showUnStakingModal]);

  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={sectionTitlesTr('balance')} icon={AccountBalanceIcon} />

      <Grid container direction={'row'} justify={'space-between'} spacing={2}>
        <GridItem>
          <BalanceCard
            title={'Unstaked ORBS in your wallet'}
            actionButtonTitle={'Stake your tokens'}
            actionButtonActive={true}
            onActionButtonPressed={showStakingModal.setTrue}
            amount={fullOrbsFromWeiOrbs(orbsAccountStore.liquidOrbs)}
            balanceCardTestId={'balance_card_liquid_orbs'}
          />
        </GridItem>

        <GridItem>
          <BalanceCard
            title={'Staked ORBS in smart contract'}
            actionButtonTitle={'Unstake your tokens'}
            amount={fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs)}
            actionButtonActive={true}
            onActionButtonPressed={onUnstakeTokensClicked}
            balanceCardTestId={'balance_card_staked_orbs'}
          />
        </GridItem>

        <GridItem>
          <BalanceCard
            title={orbsInCooldownBoxTitle}
            actionButtonTitle={orbsInCooldownBoxButtonText}
            amount={fullOrbsFromWeiOrbs(orbsAccountStore.orbsInCoolDown)}
            actionButtonActive={orbsInCooldownBoxEnabled}
            onActionButtonPressed={orbsInCooldownBoxButtonAction}
            balanceCardTestId={'balance_card_cool_down_orbs'}
          />
        </GridItem>
      </Grid>

      {/* Staking */}
      <Modal open={showStakingModal.value} onClose={showStakingModal.setFalse}>
        <StakingWizard closeWizard={showStakingModal.setFalse} />
      </Modal>

      {/* Unstaking */}
      <Modal open={showUnStakingModal.value} onClose={showUnStakingModal.setFalse}>
        <UnstakingWizard closeWizard={showUnStakingModal.setFalse} />
      </Modal>

      {/* Restaking */}
      <Modal open={showRestakingModal.value} onClose={showRestakingModal.setFalse}>
        <RestakingWizard closeWizard={showRestakingModal.setFalse} />
      </Modal>

      {/* Withdrawing */}
      <Modal open={showWithdrawingModal.value} onClose={showWithdrawingModal.setFalse}>
        <WithdrawingWizard closeWizard={showWithdrawingModal.setFalse} />
      </Modal>

      {/* Cannot unstake now snackbar */}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showCannotUnstakeNowSnackbar.value}
        autoHideDuration={2000}
        onClose={showCannotUnstakeNowSnackbar.setFalse}
      >
        <CustomSnackBarContent
          variant={'warning'}
          message={'Cannot unstake when there are ORBS to be withdrawn'}
          onClose={showCannotUnstakeNowSnackbar.setFalse}
          data-testid={'message-cannot-unstake-when-can-withdraw'}
        />
      </Snackbar>
    </Section>
  );
});
