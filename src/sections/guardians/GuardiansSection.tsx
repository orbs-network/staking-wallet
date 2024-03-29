import React, { useCallback, useContext, useState } from 'react';
import { useBoolean } from 'react-hanger';
import { Grid } from '@material-ui/core';
import { ReactComponent as ShielIcon } from '../../../assets/shield.svg';
import { MobXProviderContext, observer } from 'mobx-react';
import { Section } from '../../components/structure/Section';
import { SectionHeader } from '../../components/structure/SectionHeader';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore, useOrbsNodeStore } from '../../store/storeHooks';
import GuardiansTable from '../../components/GuardiansTable/GuardiansTable';
import { GuardianChangingWizard } from '../../wizards/guardianChange/GuardianChangingWizard';
import {
  useAlertsTranslations,
  useCommonsTranslations,
  useSectionsTitlesTranslations,
} from '../../translations/translationsHooks';
import { CommonDivider } from '../../components/base/CommonDivider';
import { CommonDialog } from '../../components/modal/CommonDialog';
import { MyGuardianDisplay } from './MyGuardianDisplay';
import { GuardianSelectingWizard } from '../../wizards/guardianSelection/GuardianSelectingWizard';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import { useGuardiansDelegatorsCut, useStakingRewardsService } from '../../services/ServicesHooks';
import BaseLoader from '../../components/loaders/index';
import ErrorFallback from '../../components/errors/index';
import CustomLoaders from '../../components/loaders/loader-components/index';
import StakingInformation from './staking-information/index';
import CustomSnackbar from '../../components/snackbar/custom-snackbar';

const handleIsLoading = (
  isConnected: boolean | undefined,
  orbsNodeStoreLoaded: boolean,
  orbsAccountStoreLoaded: boolean,
) => {
  if (isConnected) {
    return !orbsNodeStoreLoaded || !orbsAccountStoreLoaded;
  }
  return !orbsNodeStoreLoaded;
};

const handleIsError = (
  isConnected: boolean | undefined,
  orbsNodeStoreError: boolean,
  orbsAccountStoreError: boolean,
) => {
  if (isConnected) {
    return orbsNodeStoreError || orbsAccountStoreError;
  }

  return orbsNodeStoreError;
};

export const GuardiansSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const { isConnectedToWallet, mainAddress } = useCryptoWalletIntegrationStore();
  const { chainId } = useContext(MobXProviderContext);

  const alertsTranslations = useAlertsTranslations();
  const commonsTranslations = useCommonsTranslations();
  const orbsNodeStore = useOrbsNodeStore();
  const orbsAccountStore = useOrbsAccountStore();
  const showGuardianChangingModal = useBoolean(false);
  const showGuardianSelectionModal = useBoolean(false);
  const showSnackbarMessage = useBoolean(false);

  const stakingRewardsService = useStakingRewardsService();
  const guardianAddressToDelegatorsCut = useGuardiansDelegatorsCut(orbsNodeStore.guardians, stakingRewardsService);

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
  const isLoading = handleIsLoading(isConnectedToWallet, orbsNodeStore.doneLoading, orbsAccountStore.doneLoading);
  const isErrorOnLoading = handleIsError(
    isConnectedToWallet,
    orbsNodeStore.errorLoading,
    orbsAccountStore.errorLoading,
  );
  const committeeStakeByChain = orbsNodeStore.committeeEffectiveStakeByChain;

  return (
    <Section data-testid='guardians-section'>
      <SectionHeader
        sideComponent={
          <StakingInformation
            isLoading={isLoading}
            totalStake={orbsAccountStore.totalSystemStakedTokens}
            totalStakeByChain={orbsAccountStore.totalStakeByChain}
            committeeStakeByChain={committeeStakeByChain}
          />
        }
        title={sectionTitlesTranslations('allGuardians')}
        icon={ShielIcon}
        bottomPadding
      />
     
      <ErrorFallback isError={isErrorOnLoading} errorText={commonsTranslations('loadingFailed')}>
        <BaseLoader isLoading={isLoading} hideContent LoaderComponent={CustomLoaders.GuardiansSection}>
          <>
            {orbsAccountStore.participatingInStaking && (
              <MyGuardianDisplay openGuardianSelectionWizard={showGuardianSelectionModal.setTrue} />
            )}
            <Grid item xs={12}>
              <GuardiansTable
                minSelfStakePercentMille={orbsNodeStore.minSelfStakePercentMille}
                selectedChain={chainId}
                mainAddress={mainAddress}
                allChainsGuardians={orbsNodeStore.allChainsGuardians}
                isGuardian={orbsAccountStore.isGuardian}
                guardianSelectionMode={'Change'}
                selectedGuardian={orbsAccountStore.hasSelectedGuardian ? orbsAccountStore.selectedGuardianAddress : ''}
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
            <CustomSnackbar
              vertical='bottom'
              horizontal='left'
              show={showSnackbarMessage.value}
              autoHideDuration={1500}
              hide={showSnackbarMessage.setFalse}
              variant='warning'
              message={alertsTranslations('guardianAlreadySelected')}
              data-testid={'message-guardian-already-selected'}
            />
          </>
        </BaseLoader>
      </ErrorFallback>
    </Section>
  );
});
