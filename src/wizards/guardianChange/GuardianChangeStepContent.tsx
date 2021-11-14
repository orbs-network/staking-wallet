import React, { useCallback, useMemo } from 'react';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
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
import handleApprove from '../helpers/handle-approve';
import { handleGuardianChangeError } from '../helpers/error-handling';
import stakingUtil from '../../utils/stakingUtil';
export interface IGuardianChangeStepContentProps {
  newGuardianAddress: string;
}

export const GuardianChangeStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianChangeStepContentProps) => {
    const { onPromiEventAction, txError, disableInputs, newGuardianAddress, closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const guardianChangingWizardTranslations = useGuardianChangingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const { mainAddress } = useCryptoWalletIntegrationStore();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const changeSelectedGuardian = useCallback(
      () =>
        handleApprove({
          message,
          subMessage,
          promiEvent: orbsAccountStore.delegate(newGuardianAddress),
          isBroadcastingMessage,
          onPromiEventAction,
          reReadStoresData,
          wizardsCommonTranslations,
          errorHandler: handleGuardianChangeError,
          analyticsHandler: analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.guardianChange),
        }),
      [
        isBroadcastingMessage,
        message,
        onPromiEventAction,
        orbsAccountStore,
        reReadStoresData,
        subMessage,
        wizardsCommonTranslations,
        analyticsService,
        newGuardianAddress,
      ],
    );

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
        disableActionButton={stakingUtil.disableGuardianSelection(
          mainAddress,
          newGuardianAddress,
          orbsAccountStore.selectedGuardianAddress,
          orbsAccountStore.isGuardian,
        )}
        onCancelButtonClicked={closeWizard}
        close={closeWizard}
        cancelButtonText={wizardsCommonTranslations('action_close')}
      />
    );
  },
);
