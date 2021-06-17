import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoolean } from 'react-hanger';
import { Button, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as ShielIcon } from '../../../assets/shield.svg';
import { observer } from 'mobx-react';
import Snackbar from '@material-ui/core/Snackbar';
import { Section } from '../../components/structure/Section';
import { SectionHeader } from '../../components/structure/SectionHeader';
import { useOrbsAccountStore, useOrbsNodeStore } from '../../store/storeHooks';
import { GuardiansTable } from '../../components/GuardiansTable/GuardiansTable';
import { CustomSnackBarContent } from '../../components/snackbar/CustomSnackBarContent';
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
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import { useGuardiansDelegatorsCut, useGuardiansService, useStakingRewardsService } from '../../services/ServicesHooks';
import BaseLoader from '../../components/loaders/index';
import customLoaders from '../../components/loaders/custom-loaders';
export const GuardiansSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const alertsTranslations = useAlertsTranslations();
  const commonsTranslations = useCommonsTranslations();
  const orbsNodeStore = useOrbsNodeStore();
  const orbsAccountStore = useOrbsAccountStore();
  const showGuardianChangingModal = useBoolean(false);
  const showGuardianSelectionModal = useBoolean(false);
  const showSnackbarMessage = useBoolean(false);

  orbsNodeStore.guardians;
  const stakingRewardsService = useStakingRewardsService();

  const [selectedGuardianAddress, setSelectedGuardianAddress] = useState<string>(null);

  const onGuardianSelect = useCallback(
    (guardian: Guardian) => {
      if (guardian.EthAddress === orbsAccountStore.selectedGuardianAddress) {
        showSnackbarMessage.setTrue();
      } else {
        setSelectedGuardianAddress(guardian.EthAddress);
        showGuardianChangingModal.setTrue();
      }
    },
    [orbsAccountStore.selectedGuardianAddress, showGuardianChangingModal, showSnackbarMessage],
  );

  const isLoadingData = !orbsNodeStore.doneLoading || !orbsAccountStore.doneLoading;
  const isErrorOnLoading = orbsNodeStore.errorLoading || orbsAccountStore.errorLoading;

  const totalStake = orbsNodeStore.totalStake;
  const committeeEffectiveStake = orbsNodeStore.committeeEffectiveStake;

  const guardianAddressToDelegatorsCut = useGuardiansDelegatorsCut(orbsNodeStore.guardians, stakingRewardsService);

  return (
    <Section data-testid='guardians-section'>
      <BaseLoader isLoading={isLoadingData} hideContent customLoader={customLoaders.guardiansSection}>
        <>
          <SectionHeader
            title={sectionTitlesTranslations('allGuardians')}
            sideTitle={[
              `${sectionTitlesTranslations(
                'allGuardians_sideTitleTotalStake',
              )}: ${orbsAccountStore.totalSystemStakedTokens.toLocaleString()}`,
              `${sectionTitlesTranslations(
                'allGuardians_sideTitleCommitteeStake',
              )}: ${committeeEffectiveStake.toLocaleString()}`,
            ]}
            icon={ShielIcon}
            bottomPadding
          />
          <CommonDivider />

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
                  selectedGuardian={
                    orbsAccountStore.hasSelectedGuardian ? orbsAccountStore.selectedGuardianAddress : ''
                  }
                  guardians={orbsNodeStore.guardians}
                  onGuardianSelect={onGuardianSelect}
                  tableTestId={'guardians-table'}
                  committeeMembers={orbsNodeStore.committeeMembers}
                  guardiansToDelegatorsCut={guardianAddressToDelegatorsCut}
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
                <GuardianSelectingWizard
                  closeWizard={showGuardianSelectionModal.setFalse}
                  selectedGuardianAddress={orbsAccountStore.selectedGuardianAddress}
                />
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
        </>
      </BaseLoader>
    </Section>
  );
});
