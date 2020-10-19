import React, { useCallback, useEffect, useMemo } from 'react';
import { useOrbsAccountStore, useOrbsNodeStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardiansTable } from '../../components/GuardiansTable/GuardiansTable';
import { BaseStepContent } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { Grid } from '@material-ui/core';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService, useGuardiansDelegatorsCut, useStakingRewardsService } from '../../services/ServicesHooks';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';

export interface IGuardianSelectionStepContentProps {
  selectedGuardianAddress: string;
}

export const GuardianSelectionStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianSelectionStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, selectedGuardianAddress } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const orbsNodeStore = useOrbsNodeStore();
    const analyticsService = useAnalyticsService();

    const reReadStoresData = useReReadAllStoresData();

    const stakingRewardsService = useStakingRewardsService();
    const guardianAddressToDelegatorsCut = useGuardiansDelegatorsCut(orbsNodeStore.guardians, stakingRewardsService);

    // Start and limit by allowance
    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      stakingWizardTranslations('guardianSelectionSubStep_message_selectGuardian'),
      stakingWizardTranslations('guardianSelectionSubStep_subMessage_pressSelectAndApprove'),
      false,
    );

    // Handle error by displaying the proper error message
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const selectGuardian = useCallback(
      (guardian: Guardian) => {
        message.setValue('');
        subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

        // No need to re-select an already selected guardian
        if (guardian.EthAddress === selectedGuardianAddress) {
          skipToSuccess();
        } else {
          const promiEvent = orbsAccountStore.delegate(guardian.EthAddress);

          // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
          promiEvent.on('transactionHash', (txHash) => {
            subMessage.setValue(
              wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'),
            );
            isBroadcastingMessage.setTrue();
          });

          onPromiEventAction(promiEvent, () => {
            analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.guardianChange);
            reReadStoresData();
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
        reReadStoresData,
      ],
    );

    const guardianSelectionContent = useMemo(() => {
      return (
        <Grid container item style={{ marginLeft: '1em', marginRight: '1em' }}>
          <GuardiansTable
            guardians={orbsNodeStore.guardians}
            guardianSelectionMode={'Select'}
            onGuardianSelect={selectGuardian}
            selectedGuardian={selectedGuardianAddress}
            tableTestId={'guardian_selection_sub_step_guardians_table'}
            committeeMembers={orbsNodeStore.committeeMembers}
            guardiansToDelegatorsCut={guardianAddressToDelegatorsCut}
            densePadding
          />
        </Grid>
      );
    }, [
      guardianAddressToDelegatorsCut,
      orbsNodeStore.committeeMembers,
      orbsNodeStore.guardians,
      selectGuardian,
      selectedGuardianAddress,
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
