import React, { useMemo } from 'react';
import { observer } from 'mobx-react';

import { ReactComponent as RewardsIcon } from '../../assets/reward.svg';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { useRewardsSectionTranslations, useSectionsTitlesTranslations } from '../translations/translationsHooks';
import { CommonDivider } from '../components/base/CommonDivider';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import useTheme from '@material-ui/core/styles/useTheme';
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';

export const RewardsSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();

  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();

  const theme = useTheme();
  const translation = useTranslation();

  const innerLinkLang = useMemo(() => {
    if (!translation?.i18n?.language) {
      return '';
    } else {
      return `${translation.i18n.language}/`;
    }
  }, [translation]);

  // TODO : Find a better way to combine the translations with changing order links
  const innerHtml = rewardsSectionTranslations('text__forDetailedRewardsPleaseVisitThe', {
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

  return (
    <Section>
      <SectionHeader title={sectionTitlesTranslations('rewards')} icon={RewardsIcon} bottomPadding />
      <Grid item>
        <Typography dangerouslySetInnerHTML={{ __html: innerHtml }}></Typography>
      </Grid>
    </Section>
  );
});
