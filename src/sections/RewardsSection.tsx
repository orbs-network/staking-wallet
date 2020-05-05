import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';

import { ReactComponent as RewardsIcon } from '../../assets/reward.svg';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { useRewardsSectionTranslations, useSectionsTitlesTranslations } from '../translations/translationsHooks';
import Grid, { GridProps } from '@material-ui/core/Grid';
import { Theme, Typography } from '@material-ui/core';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore } from '../store/storeHooks';
import useTheme from '@material-ui/core/styles/useTheme';
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOrbsPOSDataService } from '../services/ServicesHooks';
import { useNumber } from 'react-hanger';

export const RewardsContainer = styled((props: GridProps) => <Grid item container {...props} />)<GridProps>(
  (styledProps: { theme: Theme }) => {
    return {};
  },
);

export const RewardsSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();

  const orbsAccountStore = useOrbsAccountStore();
  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();
  const orbsPOSDataService = useOrbsPOSDataService();

  const theme = useTheme();
  const translation = useTranslation();

  const nextElectionBlock = useNumber(0);

  useEffect(() => {
    async function readAndSetNextElectionBlock() {
      const nextElectionsEthereumBlock = await orbsPOSDataService.readUpcomingElectionBlockNumber();
      nextElectionBlock.setValue(nextElectionsEthereumBlock);
    }

    readAndSetNextElectionBlock();
  }, [orbsPOSDataService, nextElectionBlock]);

  const innerLinkLang = useMemo(() => {
    if (!translation?.i18n?.language) {
      return '';
    } else {
      return `${translation.i18n.language}/`;
    }
  }, [translation]);

  // TODO : Find a better way to combine the translations with changing order links
  const rewardsPageInnerHtml = rewardsSectionTranslations('text__forDetailedRewardsPleaseVisitThe', {
    rewardsPageTextLink: renderToString(
      <a
        style={{ color: theme.palette.secondary.main }}
        target={'_blank'}
        rel={'noopener noreferrer'}
        href={`https://orbs-network.github.io/voting/${innerLinkLang}reward?address=${cryptoWalletConnectionStore.mainAddress}`}
      >
        {rewardsSectionTranslations('linkText_rewardsPage')}
      </a>,
    ),
  });

  const nextElectionsInnerHtml = rewardsSectionTranslations('text__NextElectionRoundWillTakePlaceAtEthereumBlock', {
    nextElectionBlockNumberLink: renderToString(
      <a
        style={{ color: theme.palette.secondary.main }}
        target={'_blank'}
        rel={'noopener noreferrer'}
        href={`https://etherscan.io/block/countdown/${nextElectionBlock.value}`}
      >
        {nextElectionBlock.value.toLocaleString()}
      </a>,
    ),
  });

  const gridMargin = theme.spacing(1);
  const gridPadding = theme.spacing(2);

  // DEV_NOTE : We put the 'width 98%' because a problem with the spacing that caused the block width to extend beyond its parent container (to the right mostly)
  return (
    <Section>
      <SectionHeader title={sectionTitlesTranslations('rewards')} icon={RewardsIcon} bottomPadding />

      <Grid
        item
        container
        direction={'column'}
        spacing={1}
        style={{
          width: '98%',
          alignSelf: 'center',
          backgroundColor: 'rgba(47, 47, 47, 0.6)',
          marginRight: gridMargin,
          marginLeft: gridMargin,
          paddingLeft: gridPadding,
          paddingRight: gridPadding,
        }}
      >
        <Grid item>
          <Typography dangerouslySetInnerHTML={{ __html: rewardsPageInnerHtml }} />
        </Grid>

        <Grid item>
          <Typography dangerouslySetInnerHTML={{ __html: nextElectionsInnerHtml }} />
        </Grid>

        <RewardsContainer direction={'column'} spacing={1}>
          <Grid item>
            <Typography>
              -{' '}
              {rewardsSectionTranslations('text__totalDistributedRewards', {
                totalDistributedRewards: orbsAccountStore.totalDistributedRewards.toLocaleString(),
              })}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              -{' '}
              {rewardsSectionTranslations('text__totalAccumulatedRewards', {
                totalAccumulatedRewards: orbsAccountStore.totalAccumulatedRewards.toLocaleString(),
              })}
            </Typography>
          </Grid>
        </RewardsContainer>
      </Grid>
    </Section>
  );
});
