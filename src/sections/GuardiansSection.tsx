import Typography from '@material-ui/core/Typography';
// @ts-ignore
import { ReactComponent as ShielIcon } from '../../assets/shield.svg';
import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useGuardiansStore, useOrbsAccountStore } from '../store/storeHooks';
import { GuardiansTable } from '../components/GuardiansTable';
import Snackbar from '@material-ui/core/Snackbar';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import { useBoolean } from 'react-hanger';
import { TGuardianInfoExtended } from '../store/GuardiansStore';
import Modal from '@material-ui/core/Modal';
import { GuardianChangingWizard } from '../wizards/guardianChange/GuardianChangingWizard';
import {
  useAlertsTranslations,
  useCommonsTranslations,
  useSectionsTitlesTranslations,
} from '../translations/translationsHooks';
import { Grid } from '@material-ui/core';
import { CommonDivider } from '../components/base/CommonDivider';

export const GuardiansSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const alertsTranslations = useAlertsTranslations();
  const commonsTranslations = useCommonsTranslations();
  const guardiansStore = useGuardiansStore();
  const orbsAccountStore = useOrbsAccountStore();
  const showGuardianChangingModal = useBoolean(false);
  const showSnackbarMessage = useBoolean(false);

  const [selectedGuardianAddress, setSelectedGuardianAddress] = useState<string>(null);

  const onGuardianSelect = useCallback(
    (guardian: TGuardianInfoExtended) => {
      if (guardian.address === orbsAccountStore.selectedGuardianAddress) {
        showSnackbarMessage.setTrue();
      } else {
        setSelectedGuardianAddress(guardian.address);
        showGuardianChangingModal.setTrue();
      }
    },
    [orbsAccountStore.selectedGuardianAddress, showGuardianChangingModal, showSnackbarMessage],
  );

  if (!guardiansStore.doneLoading || !orbsAccountStore.doneLoading) {
    return <Typography>{commonsTranslations('loading')}</Typography>;
  }

  return (
    <Section data-testid='guardians-section'>
      <SectionHeader
        title={sectionTitlesTranslations('allGuardians')}
        sideTitle={sectionTitlesTranslations('allGuardians_sideTitle', {
          totalParticipatingTokens: guardiansStore.totalParticipatingTokens.toLocaleString(),
        })}
        icon={ShielIcon}
      />

      <CommonDivider />

      <Grid item xs={12}>
        <GuardiansTable
          guardianSelectionMode={'Change'}
          selectedGuardian={orbsAccountStore.selectedGuardianAddress}
          guardians={guardiansStore.guardiansList}
          onGuardianSelect={onGuardianSelect}
          tableTestId={'guardians-table'}
        />
      </Grid>

      {/* Restaking */}
      <Modal open={showGuardianChangingModal.value} onClose={showGuardianChangingModal.setFalse}>
        <GuardianChangingWizard
          closeWizard={showGuardianChangingModal.setFalse}
          newGuardianAddress={selectedGuardianAddress}
        />
      </Modal>

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
          message={alertsTranslations('guardianAlreadySelected')}
          onClose={showSnackbarMessage.setFalse}
          data-testid={'message-guardian-already-selected'}
        />
      </Snackbar>
    </Section>
  );
});
