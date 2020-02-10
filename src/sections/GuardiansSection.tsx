import Typography from '@material-ui/core/Typography';
import SecurityIcon from '@material-ui/icons/Security';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useGuardiansStore, useOrbsAccountStore } from '../store/storeHooks';
import { GuardiansTable } from '../components/GuardiansTable';
import Snackbar from '@material-ui/core/Snackbar';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import { useBoolean } from 'react-hanger';
import { TGuardianInfoExtended } from '../store/GuardiansStore';

export const GuardiansSection = observer(() => {
  const guardiansStore = useGuardiansStore();
  const orbsAccountStore = useOrbsAccountStore();
  const { t } = useTranslation();
  const showSnackbarMessage = useBoolean(false);

  const onGuardianSelect = useCallback(
    (guardian: TGuardianInfoExtended) => {
      if (guardian.address === orbsAccountStore.selectedGuardianAddress) {
        showSnackbarMessage.setTrue();
      } else {
        console.log(`On Guardian select ${guardian.address}`);
      }
    },
    [orbsAccountStore.selectedGuardianAddress, showSnackbarMessage],
  );

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
      <GuardiansTable
        selectedGuardian={orbsAccountStore.selectedGuardianAddress}
        guardians={guardiansStore.guardiansList}
        onGuardianSelect={onGuardianSelect}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showSnackbarMessage.value}
        autoHideDuration={1500}
        onClose={showSnackbarMessage.setFalse}
      >
        <CustomSnackBarContent
          variant={'info'}
          message={'Guardian already selected !'}
          onClose={showSnackbarMessage.setFalse}
          data-testid={'message-address-was-copied'}
        />
      </Snackbar>
    </Section>
  );
});
