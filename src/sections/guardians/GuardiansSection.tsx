import React, { useCallback, useState } from 'react';
import { useBoolean } from 'react-hanger';
import { Button, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as ShielIcon } from '../../../assets/shield.svg';
import { observer } from 'mobx-react';
import Snackbar from '@material-ui/core/Snackbar';
import { Section } from '../../components/structure/Section';
import { SectionHeader } from '../../components/structure/SectionHeader';
import { useGuardiansStore, useOrbsAccountStore } from '../../store/storeHooks';
import { GuardiansTable } from '../../components/GuardiansTable';
import { CustomSnackBarContent } from '../../components/snackbar/CustomSnackBarContent';
import { TGuardianInfoExtended } from '../../store/GuardiansStore';
import { GuardianChangingWizard } from '../../wizards/guardianChange/GuardianChangingWizard';
import {
  useAlertsTranslations,
  useCommonsTranslations,
  useSectionsTitlesTranslations,
} from '../../translations/translationsHooks';
import { CommonDivider } from '../../components/base/CommonDivider';
import { CommonDialog } from '../../components/modal/CommonDialog';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { MyGuardianDisplay } from './MyGuardianDisplay';
import { GuardianSelectingWizard } from '../../wizards/guardianSelection/GuardianSelectingWizard';

export const GuardiansSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const alertsTranslations = useAlertsTranslations();
  const commonsTranslations = useCommonsTranslations();
  const guardiansStore = useGuardiansStore();
  const orbsAccountStore = useOrbsAccountStore();
  const showGuardianChangingModal = useBoolean(false);
  const showGuardianSelectionModal = useBoolean(false);
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

  const isLoadingData = !guardiansStore.doneLoading || !orbsAccountStore.doneLoading;
  const isErrorOnLoading = guardiansStore.errorLoading || orbsAccountStore.errorLoading;

  // Before data was loaded
  if (isLoadingData) {
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
        bottomPadding
      />

      {/*<CommonDivider />*/}

      {/* TODO : O.L : Find a better mechanism to display error vs content*/}
      {isErrorOnLoading && <Typography>{commonsTranslations('loadingFailed')}</Typography>}
      {!isErrorOnLoading && (
        <>
          {orbsAccountStore.participatingInStaking && (
            <MyGuardianDisplay openGuardianSelectionWizard={showGuardianSelectionModal.setTrue} />
          )}
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
          <CommonDialog open={showGuardianChangingModal.value} onClose={showGuardianChangingModal.setFalse}>
            <GuardianChangingWizard
              closeWizard={showGuardianChangingModal.setFalse}
              newGuardianAddress={selectedGuardianAddress}
            />
          </CommonDialog>

          <CommonDialog open={showGuardianSelectionModal.value} onClose={showGuardianSelectionModal.setFalse}>
            <GuardianSelectingWizard closeWizard={showGuardianSelectionModal.setFalse} selectedGuardianAddress={orbsAccountStore.selectedGuardianAddress} />
          </CommonDialog>

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
        </>
      )}
    </Section>
  );
});
