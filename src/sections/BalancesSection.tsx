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
import OrbsInCooldownCard from './balance-cards/orbs-in-cooldown-card';
import StakedAndRewardsCard from './balance-cards/staked-and-rewards-card';
import LiquidOrbsCard from './balance-cards/liquid-orbs-card';
import {
  useAlertsTranslations,
  useCommonsTranslations,
  useSectionsTitlesTranslations,
} from '../translations/translationsHooks';
import { CommonDivider } from '../components/base/CommonDivider';
import { CommonDialog } from '../components/modal/CommonDialog';
import CustomSnackbar from '../components/snackbar/custom-snackbar';
import ErrorFallback from '../components/errors';

const GridItem = styled((props) => <Grid item xs={12} sm={12} md={4} lg={4} xl={4} {...props} />)((styledProps) => {
  return {};
});

export const BalancesSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const commonsTranslations = useCommonsTranslations();
  const alertsTranslations = useAlertsTranslations();
  const { errorLoading } = useOrbsAccountStore();

  const showStakingModal = useBoolean(false);
  const showUnStakingModal = useBoolean(false);
  const showCannotUnstakeNowSnackbar = useBoolean(false);
  const showRestakingModal = useBoolean(false);
  const showWithdrawingModal = useBoolean(false);

  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={sectionTitlesTranslations('balance')} icon={BalanceIcon} />
      <CommonDivider />

      <ErrorFallback errorText={commonsTranslations('loadingFailed')} isError={errorLoading}>
        <>
          {/* TODO : FUTURE : O.L : Consider reducing the spacing when flex goes to column display */}
          <Grid container item direction={'row'} justify={'space-between'} spacing={3}>
            {/* Liquid ORBS */}
            <GridItem>
              <LiquidOrbsCard showStakingModal={showStakingModal} />
            </GridItem>
            {/* Staked&Rewards */}
            <GridItem>
              <StakedAndRewardsCard
                showCannotUnstakeNowSnackbar={showCannotUnstakeNowSnackbar}
                showUnStakingModal={showUnStakingModal}
              />
            </GridItem>
            {/* Cooldown & withdraw/restake */}
            <GridItem>
              <OrbsInCooldownCard
                showWithdrawingModal={showWithdrawingModal.setTrue}
                showRestakingModal={showRestakingModal.setTrue}
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
          <CustomSnackbar
            message={alertsTranslations('cannotUnstakeWhenThereAreOrbsReadyToWithdraw')}
            hide={showCannotUnstakeNowSnackbar.setFalse}
            show={showCannotUnstakeNowSnackbar.value}
            variant='warning'
            testId='message-cannot-unstake-when-can-withdraw'
          />
        </>
      </ErrorFallback>
    </Section>
  );
});
