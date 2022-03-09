import React, { useCallback, useContext, useMemo } from 'react';
import {
  useCryptoWalletIntegrationStore,
  useOrbsAccountStore,
  useOrbsNodeStore,
  useReReadAllStoresData,
} from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { MobXProviderContext, observer } from 'mobx-react';
import GuardiansTable from '../../components/GuardiansTable/GuardiansTable';
import { BaseStepContent } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { Grid } from '@material-ui/core';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService, useGuardiansDelegatorsCut, useStakingRewardsService } from '../../services/ServicesHooks';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import handleApprove from '../helpers/handle-approve';
import { handleGuardianSelectionError } from '../helpers/error-handling';
export interface IGuardianSelectionStepContentProps {
  selectedGuardianAddress: string;
}

export const GuardianSelectionStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianSelectionStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, selectedGuardianAddress } = props;
    const { chainId } = useContext(MobXProviderContext);

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const orbsNodeStore = useOrbsNodeStore();
    const analyticsService = useAnalyticsService();
    const { mainAddress } = useCryptoWalletIntegrationStore();

    const stakingRewardsService = useStakingRewardsService();

    const guardianAddressToDelegatorsCut = useGuardiansDelegatorsCut(orbsNodeStore.guardians, stakingRewardsService);

    // Start and limit by allowance
    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      orbsAccountStore.isGuardian
        ? stakingWizardTranslations('guardianSelectionSubStep_message_youAreAGuardian')
        : stakingWizardTranslations('guardianSelectionSubStep_message_selectGuardian'),
      orbsAccountStore.isGuardian
        ? stakingWizardTranslations('guardianSelectionSubStep_subMessage_mustUnregisterBeforeDelegation')
        : stakingWizardTranslations('guardianSelectionSubStep_subMessage_pressSelectAndApprove'),
      false,
    );

    // Handle error by displaying the proper error message
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const selectGuardian = useCallback(
      (guardian: Guardian) => {
        message.setValue('');
        subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

        // No need to re-select an already selected guardian
        if (guardian.EthAddress.toLowerCase() === selectedGuardianAddress.toLowerCase()) {
          skipToSuccess();
        } else {
          handleApprove({
            message,
            subMessage,
            promiEvent: orbsAccountStore.delegate(guardian.EthAddress),
            isBroadcastingMessage,
            onPromiEventAction,
            wizardsCommonTranslations,
            errorHandler: handleGuardianSelectionError,
            analyticsHandler: analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.guardianChange),
          });
        }
      },
      [
        message,
        subMessage,
        wizardsCommonTranslations,
        selectedGuardianAddress,
        skipToSuccess,
        orbsAccountStore,
        onPromiEventAction,
        isBroadcastingMessage,
        analyticsService,
      ],
    );

    const guardianSelectionContent = useMemo(() => {
      return (
        <Grid container item style={{ marginLeft: '1em', marginRight: '1em' }}>
          <GuardiansTable
            minSelfStakePercentMille={orbsNodeStore.minSelfStakePercentMille}
            selectedChain={chainId}
            mainAddress={mainAddress}
            isGuardian={orbsAccountStore.isGuardian}
            guardianSelectionMode={'Select'}
            allChainsGuardians={orbsNodeStore.allChainsGuardians}
            onGuardianSelect={selectGuardian}
            selectedGuardian={selectedGuardianAddress}
            tableTestId={'guardian_selection_sub_step_guardians_table'}
            committeeMembers={orbsNodeStore.committeeMembers}
            guardiansToDelegatorsCut={guardianAddressToDelegatorsCut}
            densePadding
            disableSelection={disableInputs}
          />
        </Grid>
      );
    }, [
      orbsNodeStore.minSelfStakePercentMille,
      orbsNodeStore.allChainsGuardians,
      orbsNodeStore.committeeMembers,
      chainId,
      mainAddress,
      orbsAccountStore.isGuardian,
      selectGuardian,
      selectedGuardianAddress,
      guardianAddressToDelegatorsCut,
      disableInputs,
    ]);

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={stakingWizardTranslations('guardianSelectionSubStep_stepTitle')}
        infoTitle={stakingWizardTranslations('guardianSelectionSubStep_stepExplanation')}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_guardian_selection_tx'}
        innerContent={guardianSelectionContent}
      />
    );
  },
);
