import React, { useMemo } from 'react';
import { observer } from 'mobx-react';

import { ReactComponent as RewardsIcon } from '../../assets/reward.svg';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import {
  useCommonsTranslations,
  useRewardsSectionTranslations,
  useSectionsTitlesTranslations,
} from '../translations/translationsHooks';
import Grid, { GridProps } from '@material-ui/core/Grid';
import { Theme, Typography } from '@material-ui/core';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore, useOrbsNodeStore } from '../store/storeHooks';
import useTheme from '@material-ui/core/styles/useTheme';
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOrbsPOSDataService } from '../services/ServicesHooks';
import { useBoolean, useNumber } from 'react-hanger';
import { CommonDivider } from '../components/base/CommonDivider';
import { fullOrbsFromWeiOrbs } from '../cryptoUtils/unitConverter';
import { CommonDialog } from '../components/modal/CommonDialog';
import { RewardsClaimingWizard } from '../wizards/rewardsClaiming/RewardsClaimingWizard';
import { BalanceCard } from '../components/BalanceCard';
import useInterval from 'use-interval';
import config from '../config';

const GridItem = styled((props) => <Grid item xs={12} sm={12} md={4} lg={4} xl={4} {...props} />)((styledProps) => {
  return {};
});

export const RewardsSection = observer(() => {
  const commonsTranslations = useCommonsTranslations();
  const sectionTitlesTranslations = useSectionsTitlesTranslations();

  const orbsAccountStore = useOrbsAccountStore();
  const orbsNodeStore = useOrbsNodeStore();
  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();

  const theme = useTheme();
  const translation = useTranslation();

  const showClaimingModal = useBoolean(false);

  // TODO : ORL : TRANSLATION
  const availableRewards = orbsAccountStore.rewardsBalance;

  useInterval(() => {
    orbsAccountStore.refreshAllRewardsData();
  }, 1000 * config.rewardsRefreshRateInSeconds);

  if (!orbsAccountStore.doneLoading) {
    return <Typography>{commonsTranslations('loading')}</Typography>;
  }

  // DEV_NOTE : We put the 'width 98%' because a problem with the spacing that caused the block width to extend beyond its parent container (to the right mostly)
  return (
    <Section>
      <SectionHeader title={sectionTitlesTranslations('rewards')} icon={RewardsIcon} />

      <CommonDivider />
      <Grid container item direction={'row'} justify={'space-between'} spacing={3}>
        <GridItem>
          <BalanceCard
            title={`${rewardsSectionTranslations('title_totalRewardsAwarded')} (${rewardsSectionTranslations(
              'title_quantity_orbs',
            )})`}
            amount={orbsAccountStore.totalRewardedRewards}
            showFraction
          />
        </GridItem>

        <GridItem>
          <BalanceCard
            title={`${rewardsSectionTranslations('title_rewardsRate')} (${rewardsSectionTranslations(
              'title_quantity_orbsPerWeek',
            )})`}
            amount={orbsAccountStore.estimatedRewardsForNextWeek}
            showFraction
          />
        </GridItem>

        <GridItem>
          <BalanceCard
            title={`${rewardsSectionTranslations('title_rewardsBalance')} (${rewardsSectionTranslations(
              'title_quantity_orbs',
            )})`}
            amount={availableRewards}
            secondaryActionButtonActive={availableRewards > 0}
            secondaryActionButtonTitle={rewardsSectionTranslations('action_claim')}
            onSecondaryActionButtonPressed={showClaimingModal.setTrue}
            showFraction
          />
        </GridItem>
      </Grid>

      {/* Staking */}
      <CommonDialog open={showClaimingModal.value} onClose={showClaimingModal.setFalse}>
        <RewardsClaimingWizard closeWizard={showClaimingModal.setFalse} />
      </CommonDialog>
    </Section>
  );
});
