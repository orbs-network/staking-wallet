import Typography from '@material-ui/core/Typography';
import SecurityIcon from '@material-ui/icons/Security';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useGuardiansStore } from '../store/storeHooks';
import { GuardiansTable } from '../components/GuardiansTable';

export const GuardiansSection = observer(() => {
  const guardiansStore = useGuardiansStore();
  const { t } = useTranslation();

  if (guardiansStore.guardiansList.length === 0) {
    return <Typography>{t('Loading...')}</Typography>;
  }

  return (
    <Section data-testid='guardians-section'>
      <SectionHeader
        title='ALL GUARDIANS'
        sideTitle={`${t('Participating stake')}: ${guardiansStore.totalParticipatingTokens.toLocaleString()}`}
        icon={SecurityIcon}
      />
      <GuardiansTable guardians={guardiansStore.guardiansList} />
    </Section>
  );
});
