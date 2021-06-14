import React, { useCallback, useEffect, useMemo } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useRestakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { handleNumberAsStringToDisplay } from '../../utils/numberUtils';
import constants from '../../constants/constants';
import errorMonitoring from '../../services/error-monitoring';

export const OrbsRestakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const restakingWizardTranslations = useRestakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();
  const analyticsService = useAnalyticsService();

  const reReadStoresData = useReReadAllStoresData();

  // Start and limit by allowance
  const fullOrbsForRestaking = fullOrbsFromWeiOrbsString(orbsAccountStore.orbsInCoolDown);
  const { message, subMessage, isBroadcastingMessage } = useWizardState(
    '',
    restakingWizardTranslations('restakingSubStep_subMessage_pressRestakeAndApprove'),
    false,
  );

  // Handle error by displaying the proper error message
  useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

  const restakeTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.restakeTokens();

    // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
    promiEvent.on('transactionHash', (txHash) => {
      subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
      isBroadcastingMessage.setTrue();
    });

    promiEvent.on('error', (error: Error) => {
      const { errorMessages, captureException } = errorMonitoring;
      const customMsg = errorMessages.stakingError('restaking', error.message);
      captureException(error, 'restaking', customMsg);
    });

    onPromiEventAction(promiEvent, () => {
      analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.restaking);
      reReadStoresData();
    });
  }, [
    message,
    subMessage,
    wizardsCommonTranslations,
    orbsAccountStore,
    onPromiEventAction,
    isBroadcastingMessage,
    analyticsService,
    reReadStoresData,
  ]);

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
        orbsForRestaking: handleNumberAsStringToDisplay(
          fullOrbsForRestaking,
          constants.numbersDecimalToDisplayLimit,
          true,
        ),
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
