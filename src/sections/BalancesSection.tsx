import Grid from '@material-ui/core/Grid';
import { ReactComponent as BalanceIcon } from '../../assets/balance.svg';
import { observer } from 'mobx-react';
import React from 'react';
import { useBoolean } from 'react-hanger';
import styled from 'styled-components';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useOrbsAccountStore } from '../store/storeHooks';
import { StakingWizard } from '../wizards/staking/StakingWizard';
import { UnstakingWizard } from '../wizards/unstaking/UnstakingWizard';
import { WithdrawingWizard } from '../wizards/withdrawing/WithdrawingWizard';
import { RestakingWizard } from '../wizards/restaking/RestakingWizard';
import Snackbar from '@material-ui/core/Snackbar';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import OrbsInCooldownCard from './balance-cards/orbs-in-cooldown-card';
import StakedAndRewardsCard from './balance-cards/staked-and-rewards-card';
import LiquidOrbsCard from './balance-cards/liquid-orbs-card';
import {
  useAlertsTranslations,
  useBalancesSectionTranslations,
  useCommonsTranslations,
  useSectionsTitlesTranslations,
} from '../translations/translationsHooks';
import Typography from '@material-ui/core/Typography';
import { CommonDivider } from '../components/base/CommonDivider';
import { CommonDialog } from '../components/modal/CommonDialog';
import BalanceCardTooltip from './parts/balance-card-tooltip';
const GridItem = styled((props) => <Grid item xs={12} sm={12} md={4} lg={4} xl={4} {...props} />)((styledProps) => {
  return {};
});

export const BalancesSection = observer(() => {
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
              <LiquidOrbsCard
                title={balancesSectionTranslations('title_unstakedOrbsInYourWallet')}
                actionButtonTitle={balancesSectionTranslations('action_stakeYourTokens')}
                liquidOrbs={orbsAccountStore.liquidOrbs}
                showStakingModal={showStakingModal}
                isLoading={isLoading}
              />
            </GridItem>
            {/* Staked&Rewards */}
            <GridItem>
              <StakedAndRewardsCard
                stakedOrbs={orbsAccountStore.stakedOrbs}
                rewardsBalance={orbsAccountStore.rewardsBalance}
                hasOrbsToWithdraw={orbsAccountStore.hasOrbsToWithdraw}
                showCannotUnstakeNowSnackbar={showCannotUnstakeNowSnackbar}
                showUnStakingModal={showUnStakingModal}
                title={balancesSectionTranslations('title_stakedOrbsAndRewardsBalance')}
                pendingRewardsTitle={balancesSectionTranslations('tooltipTitle_pendingRewards')}
                actionButtonTitle={balancesSectionTranslations('action_unstakeYourTokens')}
                stakeTitle={balancesSectionTranslations('tooltipTitle_stakedOrbs')}
                isLoading={isLoading}
              />
            </GridItem>
            {/* Cooldown & withdraw/restake */}
            <GridItem>
              <OrbsInCooldownCard
                showWithdrawingModal={showWithdrawingModal.setTrue}
                showRestakingModal={showRestakingModal.setTrue}
                orbsInCoolDown={orbsAccountStore.orbsInCoolDown}
                cooldownReleaseTimestamp={orbsAccountStore.cooldownReleaseTimestamp}
                withdrawText={balancesSectionTranslations('action_withdrawYourTokens')}
                restakeText={balancesSectionTranslations('action_restakeYourTokens')}
                noTokensInCooldownText={balancesSectionTranslations('title_noTokensInCooldown')}
                tokensInCooldownText={balancesSectionTranslations('title_tokensInCooldown')}
                tokensReadyForWithdrawalText={balancesSectionTranslations('title_tokensReadyForWithdrawal')}
                isLoading={isLoading}
              />
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
