import React from 'react';
import { observer } from 'mobx-react';

import { ReactComponent as RewardsIcon } from '../../assets/reward.svg';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { useSectionsTitlesTranslations } from '../translations/translationsHooks';
import { CommonDivider } from '../components/base/CommonDivider';
import Grid from '@material-ui/core/Grid';
import { CommonActionButton } from '../components/base/CommonActionButton';
import { Typography } from '@material-ui/core';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore } from '../store/storeHooks';

export const RewardsSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();

  const orbsAccountStore = useOrbsAccountStore();
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();

  return (
    <Section>
      <SectionHeader title={sectionTitlesTranslations('rewards')} icon={RewardsIcon} />
      <Grid item> <CommonDivider /> </Grid>

      <Grid item> <Typography>Visit the detailed <a style={{ color: '#6ec6d8' }} target={'_blank'} rel={'noopener noreferrer'} href={`https://orbs-network.github.io/voting/reward?address=${cryptoWalletConnectionStore.mainAddress}`}>rewards page</a></Typography> </Grid>
    </Section>
  );
});
