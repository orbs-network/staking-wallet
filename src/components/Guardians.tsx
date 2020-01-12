import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGuardiansStore } from '../store/storeHooks';
import { GuardiansTable } from './GuardiansTable';

export const Guardians = observer(() => {
  const guardiansStore = useGuardiansStore();
  const { t } = useTranslation();

  if (guardiansStore.guardiansList.length === 0) {
    return <Typography>{t('Loading...')}</Typography>;
  }

  return <GuardiansTable guardians={guardiansStore.guardiansList} totalParticipatingTokens={0} />;
});
