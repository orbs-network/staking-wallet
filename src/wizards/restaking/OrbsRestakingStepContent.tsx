import React, { useCallback, useEffect, useMemo } from 'react';
import { useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useRestakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';

export const OrbsRestakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const restakingWizardTranslations = useRestakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const fullOrbsForRestaking = fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs);
  const message = useStateful('');
  const subMessage = useStateful(restakingWizardTranslations('restakingSubStep_subMessage_pressRestakeAndApprove'));

  // Display the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage]);

  const restakeTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.restakeTokens();
    onPromiEventAction(promiEvent);
  }, [message, subMessage, wizardsCommonTranslations, orbsAccountStore, onPromiEventAction]);

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
      title={restakingWizardTranslations('restakingSubStep_stepTitle', { orbsForRestaking: fullOrbsForRestaking })}
      infoTitle={restakingWizardTranslations('restakingSubStep_stepExplanation')}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_restaking_tx'}
      actionButtonProps={actionButtonProps}
    />
  );
});
