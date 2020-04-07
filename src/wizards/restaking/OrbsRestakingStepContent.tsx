import React, { useCallback, useEffect, useMemo } from 'react';
import { useBoolean, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useRestakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';

export const OrbsRestakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const restakingWizardTranslations = useRestakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const fullOrbsForRestaking = fullOrbsFromWeiOrbs(orbsAccountStore.orbsInCoolDown);
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

    onPromiEventAction(promiEvent);
  }, [message, subMessage, wizardsCommonTranslations, orbsAccountStore, onPromiEventAction, isBroadcastingMessage]);

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
        orbsForRestaking: fullOrbsForRestaking.toLocaleString(),
      })}
      infoTitle={restakingWizardTranslations('restakingSubStep_stepExplanation')}
      disableInputs={disableInputs}
      isLoading={isBroadcastingMessage.value}
      contentTestId={'wizard_sub_step_initiate_restaking_tx'}
      actionButtonProps={actionButtonProps}
      addCancelButton
      onCancelButtonClicked={closeWizard}
    />
  );
});
