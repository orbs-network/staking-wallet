import React from 'react';
import { observer } from 'mobx-react';

import { ReactComponent as RewardsIcon } from '../../assets/reward.svg';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { useRewardsSectionTranslations, useSectionsTitlesTranslations } from '../translations/translationsHooks';
import { CommonDivider } from '../components/base/CommonDivider';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';

export const RewardsSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();

  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();

  return (
    <Section>
      <SectionHeader title={sectionTitlesTranslations('rewards')} icon={RewardsIcon} />
      <Grid item>
        <CommonDivider />
      </Grid>

      <Grid item>
        <Typography>
          {rewardsSectionTranslations('text_visitThe')}{' '}
          <a
            style={{ color: '#6ec6d8' }}
            target={'_blank'}
            rel={'noopener noreferrer'}
            href={`https://orbs-network.github.io/voting/reward?address=${cryptoWalletConnectionStore.mainAddress}`}
          >
            {rewardsSectionTranslations('linkText_rewardsPage')}
          </a>
        </Typography>
      </Grid>
    </Section>
  );
});
