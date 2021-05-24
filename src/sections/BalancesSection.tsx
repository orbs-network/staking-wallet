import Grid from '@material-ui/core/Grid';
import { ReactComponent as BalanceIcon } from '../../assets/balance.svg';
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
import { TimeLeftCounter } from '../components/timeCounter/TimeLeftCounter';
import { BaseLoader } from '../components/loaders';
import {
  useAlertsTranslations,
  useBalancesSectionTranslations,
  useCommonsTranslations,
  useSectionsTitlesTranslations,
} from '../translations/translationsHooks';
import Typography from '@material-ui/core/Typography';
import { CommonDivider } from '../components/base/CommonDivider';
import { CommonDialog } from '../components/modal/CommonDialog';

const GridItem = styled((props) => <Grid item xs={12} sm={12} md={4} lg={4} xl={4} {...props} />)((styledProps) => {
  return {};
});

export const BalancesSection = observer(() => {
  const rerenderNumber = useNumber(0);
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const balancesSectionTranslations = useBalancesSectionTranslations();
  const commonsTranslations = useCommonsTranslations();
  const alertsTranslations = useAlertsTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  const showStakingModal = useBoolean(false);
  const showUnStakingModal = useBoolean(false);
  const showCannotUnstakeNowSnackbar = useBoolean(false);
  const showRestakingModal = useBoolean(false);
  const showWithdrawingModal = useBoolean(false);

  const { hasOrbsInCooldown, canWithdrawCooldownOrbs } = useOrbsInCooldownState();
  const stakedOrbs = fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs);
  const liquidOrbs = fullOrbsFromWeiOrbs(orbsAccountStore.liquidOrbs);

  const { orbsInCooldownBoxButtonAction, orbsInCooldownBoxButtonText } = useMemo(() => {
    let orbsInCooldownBoxButtonAction;
    let orbsInCooldownBoxButtonText: string;

    if (hasOrbsInCooldown && canWithdrawCooldownOrbs) {
      orbsInCooldownBoxButtonAction = showWithdrawingModal.setTrue;
      orbsInCooldownBoxButtonText = balancesSectionTranslations('action_withdrawYourTokens');
    } else {
      orbsInCooldownBoxButtonAction = showRestakingModal.setTrue;
      orbsInCooldownBoxButtonText = balancesSectionTranslations('action_restakeYourTokens');
    }

    return {
      orbsInCooldownBoxButtonAction,
      orbsInCooldownBoxButtonText,
    };
  }, [
    balancesSectionTranslations,
    canWithdrawCooldownOrbs,
    hasOrbsInCooldown,
    showRestakingModal,
    showWithdrawingModal,
  ]);

  const { orbsInCooldownBoxTitle, orbsInCooldownBoxEnabled } = useMemo(() => {
    let orbsInCooldownBoxTitle;
    let orbsInCooldownBoxEnabled = true;

    // No Tokens in cooldown ? Disable the balance box
    if (!hasOrbsInCooldown) {
      orbsInCooldownBoxTitle = balancesSectionTranslations('title_noTokensInCooldown');
      orbsInCooldownBoxEnabled = false;
    } else if (hasOrbsInCooldown && !canWithdrawCooldownOrbs) {
      // We only want to show time left if there is some time left
      orbsInCooldownBoxTitle = () => (
        <>
          {balancesSectionTranslations('title_tokensInCooldown')}
          {' ('}
          <TimeLeftCounter
            onToMomentReached={rerenderNumber.increase}
            toTimestamp={orbsAccountStore.cooldownReleaseTimestamp}
          />
          {')'}
        </>
      );
    } else {
      // TODO : translate
      orbsInCooldownBoxTitle = balancesSectionTranslations('title_tokensReadyForWithdrawal');
    }

    return {
      orbsInCooldownBoxTitle,
      orbsInCooldownBoxEnabled,
    };
  }, [
    balancesSectionTranslations,
    canWithdrawCooldownOrbs,
    hasOrbsInCooldown,
    orbsAccountStore.cooldownReleaseTimestamp,
    rerenderNumber.increase,
  ]);
  const onUnstakeTokensClicked = useMemo(() => {
    if (orbsAccountStore.hasOrbsToWithdraw) {
      return () => showCannotUnstakeNowSnackbar.setTrue();
    } else {
      return () => showUnStakingModal.setTrue();
    }
  }, [orbsAccountStore.hasOrbsToWithdraw, showCannotUnstakeNowSnackbar, showUnStakingModal]);

  const isLoading = !orbsAccountStore.doneLoading;
  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={sectionTitlesTranslations('balance')} icon={BalanceIcon} />

      <CommonDivider />

      {/* TODO : ORL : TRANSLATIONS */}

      {/* TODO : O.L : Find a better mechanism to display error vs content*/}
      {orbsAccountStore.errorLoading ? (
        <Typography>{commonsTranslations('loadingFailed')}</Typography>
      ) : (
        <>
          {/* TODO : FUTURE : O.L : Consider reducing the spacing when flex goes to column display */}
          <Grid container item direction={'row'} justify={'space-between'} spacing={3}>
            {/* Liquid ORBS */}
            <GridItem>
              <BaseLoader isLoading={isLoading}>
                <BalanceCard
                  title={balancesSectionTranslations('title_unstakedOrbsInYourWallet')}
                  actionButtonTitle={balancesSectionTranslations('action_stakeYourTokens')}
                  actionButtonActive={!!liquidOrbs}
                  onActionButtonPressed={showStakingModal.setTrue}
                  amount={liquidOrbs}
                  balanceCardTestId={'balance_card_liquid_orbs'}
                />
              </BaseLoader>
            </GridItem>

            {/* Staked&Rewards */}
            <GridItem>
              <BaseLoader isLoading={isLoading}>
                <BalanceCard
                  title={balancesSectionTranslations('title_stakedOrbsAndRewardsBalance')}
                  toolTipTitle={
                    <>
                      <Typography color={'secondary'} style={{ display: 'inline', fontWeight: 'bold' }}>
                        {balancesSectionTranslations('tooltipTitle_stakedOrbs')}:{' '}
                      </Typography>
                      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>{stakedOrbs}</Typography>
                      <br />
                      <Typography color={'secondary'} style={{ display: 'inline', fontWeight: 'bold' }}>
                        {balancesSectionTranslations('tooltipTitle_pendingRewards')}:{' '}
                      </Typography>
                      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>
                        {orbsAccountStore.rewardsBalance.toLocaleString()}
                      </Typography>
                    </>
                  }
                  amount={fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs) + orbsAccountStore.rewardsBalance}
                  actionButtonTitle={balancesSectionTranslations('action_unstakeYourTokens')}
                  actionButtonActive={!!stakedOrbs}
                  onActionButtonPressed={onUnstakeTokensClicked}
                  balanceCardTestId={'balance_card_staked_orbs'}
                />
              </BaseLoader>
            </GridItem>

            {/* Cooldown & withdraw/restake */}
            <GridItem>
              <BaseLoader isLoading={isLoading}>
                <BalanceCard
                  title={orbsInCooldownBoxTitle}
                  actionButtonTitle={orbsInCooldownBoxButtonText}
                  amount={fullOrbsFromWeiOrbs(orbsAccountStore.orbsInCoolDown)}
                  actionButtonActive={orbsInCooldownBoxEnabled}
                  onActionButtonPressed={orbsInCooldownBoxButtonAction}
                  balanceCardTestId={'balance_card_cool_down_orbs'}
                />
              </BaseLoader>
            </GridItem>
          </Grid>

          {/* Staking */}
          <CommonDialog open={showStakingModal.value} onClose={showStakingModal.setFalse}>
            <StakingWizard closeWizard={showStakingModal.setFalse} />
          </CommonDialog>

          {/* Unstaking */}
          <CommonDialog open={showUnStakingModal.value} onClose={showUnStakingModal.setFalse}>
            <UnstakingWizard closeWizard={showUnStakingModal.setFalse} />
          </CommonDialog>

          {/* Restaking */}
          <CommonDialog open={showRestakingModal.value} onClose={showRestakingModal.setFalse}>
            <RestakingWizard closeWizard={showRestakingModal.setFalse} />
          </CommonDialog>

          {/* Withdrawing */}
          <CommonDialog open={showWithdrawingModal.value} onClose={showWithdrawingModal.setFalse}>
            <WithdrawingWizard closeWizard={showWithdrawingModal.setFalse} />
          </CommonDialog>

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
              message={alertsTranslations('cannotUnstakeWhenThereAreOrbsReadyToWithdraw')}
              onClose={showCannotUnstakeNowSnackbar.setFalse}
              data-testid={'message-cannot-unstake-when-can-withdraw'}
            />
          </Snackbar>
        </>
      )}
    </Section>
  );
});
