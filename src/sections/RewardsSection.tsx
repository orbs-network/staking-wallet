import React from 'react';
import { observer } from 'mobx-react';
import { ReactComponent as RewardsIcon } from '../../assets/reward.svg';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { useSectionsTitlesTranslations } from '../translations/translationsHooks';
import Grid from '@material-ui/core/Grid';
import { useOrbsAccountStore } from '../store/storeHooks';

import styled from 'styled-components';
import { useBoolean } from 'react-hanger';
import { CommonDivider } from '../components/base/CommonDivider';
import { CommonDialog } from '../components/modal/CommonDialog';
import { RewardsClaimingWizard } from '../wizards/rewardsClaiming/RewardsClaimingWizard';
import useInterval from 'use-interval';
import config from '../../config';
import TotalRewards from './raward-cards/total-rewards';
import RewardsRate from './raward-cards/rewards-rate';
import RewardsBalance from './raward-cards/rewards-balance';

const GridItem = styled((props) => <Grid item xs={12} sm={12} md={4} lg={4} xl={4} {...props} />)((styledProps) => {
  return {};
});

export const RewardsSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();

  const orbsAccountStore = useOrbsAccountStore();

  const showClaimingModal = useBoolean(false);

  // TODO : ORL : TRANSLATION
  useInterval(() => {
    orbsAccountStore.refreshAllRewardsData();
  }, 1000 * config.rewardsRefreshRateInSeconds);

  // DEV_NOTE : We put the 'width 98%' because a problem with the spacing that caused the block width to extend beyond its parent container (to the right mostly)
  return (
    <Section>
      <SectionHeader title={sectionTitlesTranslations('rewards')} icon={RewardsIcon} />

      <Grid container item direction={'row'} justify={'space-between'} spacing={3}>
        <GridItem>
          <TotalRewards />
        </GridItem>

        <GridItem>
          <RewardsRate />
        </GridItem>

        <GridItem>
          <RewardsBalance onSecondaryActionButtonPressed={showClaimingModal.setTrue} />
        </GridItem>
      </Grid>

      {/* Staking */}
      <CommonDialog open={showClaimingModal.value} onClose={showClaimingModal.setFalse}>
        <RewardsClaimingWizard closeWizard={showClaimingModal.setFalse} />
      </CommonDialog>
    </Section>
  );
});
