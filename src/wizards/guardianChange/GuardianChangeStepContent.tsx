import React, { useCallback, useMemo } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useTranslation } from 'react-i18next';
import {
  useGuardianChangingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';

export interface IGuardianChangeStepContentProps {
  newGuardianAddress: string;
}

export const GuardianChangeStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianChangeStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, newGuardianAddress, closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const guardianChangingWizardTranslations = useGuardianChangingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const [t] = useTranslation();
    const analyticsService = useAnalyticsService();

    const reReadStoresData = useReReadAllStoresData();

    // TODO : ORL : TRANSLATIONS

    // Start and limit by allowance
    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      orbsAccountStore.isGuardian
        ? 'You are a registered Guardian'
        : guardianChangingWizardTranslations('guardianSelectionSubStep_message_changeGuardian', { newGuardianAddress }),
      orbsAccountStore.isGuardian
        ? 'You must unregister before delegating to another Guardian'
        : guardianChangingWizardTranslations('guardianSelectionSubStep_subMessage_pressChangeAndApprove'),
      false,
    );

    // Handle error by displaying the proper error message
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const changeSelectedGuardian = useCallback(() => {
      message.setValue('');
      subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

      const promiEvent = orbsAccountStore.delegate(newGuardianAddress);

      // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
      promiEvent.on('transactionHash', (txHash) => {
        subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
        isBroadcastingMessage.setTrue();
      });

      onPromiEventAction(promiEvent, () => {
        analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.guardianChange);
        reReadStoresData();
      });
    }, [
      message,
      subMessage,
      wizardsCommonTranslations,
      orbsAccountStore,
      newGuardianAddress,
      onPromiEventAction,
      isBroadcastingMessage,
      analyticsService,
      reReadStoresData,
    ]);

    const changeGuardianActionButtonProps = useMemo<IActionButtonProps>(() => {
      return {
        title: guardianChangingWizardTranslations('guardianSelectionSubStep_action_change'),
        onClick: changeSelectedGuardian,
      };
    }, [changeSelectedGuardian, guardianChangingWizardTranslations]);

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={guardianChangingWizardTranslations('guardianSelectionSubStep_stepTitle')}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_guardian_change_tx'}
        innerContent={null}
        actionButtonProps={changeGuardianActionButtonProps}
        addCancelButton
        disableActionButton={orbsAccountStore.isGuardian}
        onCancelButtonClicked={closeWizard}
        close={closeWizard}
        cancelButtonText={wizardsCommonTranslations('action_close')}
      />
    );
  },
);
