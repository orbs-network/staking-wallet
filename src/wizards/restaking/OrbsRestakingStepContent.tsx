import React, { useCallback, useMemo } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useRestakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';
import handleApprove from '../helpers/handle-approve';
import { handleRestakingError } from '../helpers/error-handling';
import { formatStringAsNumber } from '../../utils/stringUtils';
export const OrbsRestakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const restakingWizardTranslations = useRestakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();
  const analyticsService = useAnalyticsService();


  // Start and limit by allowance
  const fullOrbsForRestaking = fullOrbsFromWeiOrbsString(orbsAccountStore.orbsInCoolDown);
  const { message, subMessage, isBroadcastingMessage } = useWizardState(
    '',
    restakingWizardTranslations('restakingSubStep_subMessage_pressRestakeAndApprove'),
    false,
  );

  // Handle error by displaying the proper error message
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

  const restakeTokens = useCallback(
    () =>
      handleApprove({
        message,
        subMessage,
        promiEvent: orbsAccountStore.restakeTokens(),
        isBroadcastingMessage,
        onPromiEventAction,
        wizardsCommonTranslations,
        errorHandler: handleRestakingError,
        analyticsHandler: analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.restaking),
      }),
    [
      isBroadcastingMessage,
      message,
      onPromiEventAction,
      orbsAccountStore,
      subMessage,
      wizardsCommonTranslations,
      analyticsService,
    ],
  );

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: restakeTokens,
      title: restakingWizardTranslations('restakingSubStep_action_restake'),
    }),
    [restakeTokens, restakingWizardTranslations],
  );

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={restakingWizardTranslations('restakingSubStep_stepTitle', {
        orbsForRestaking: formatStringAsNumber(fullOrbsForRestaking, true),
      })}
      infoTitle={restakingWizardTranslations('restakingSubStep_stepExplanation')}
      disableInputs={disableInputs}
      isLoading={isBroadcastingMessage.value}
      contentTestId={'wizard_sub_step_initiate_restaking_tx'}
      actionButtonProps={actionButtonProps}
      addCancelButton
      close={closeWizard}
      onCancelButtonClicked={closeWizard}
      cancelButtonText={wizardsCommonTranslations('action_close')}
    />
  );
});
