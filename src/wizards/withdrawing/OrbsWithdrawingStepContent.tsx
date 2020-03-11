import React, { useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useWithdrawingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';

export const OrbsWithdrawingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const withdrawingWizardTranslations = useWithdrawingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const fullOrbsReadyForWithdrawal = fullOrbsFromWeiOrbs(orbsAccountStore.orbsInCoolDown);
  const message = useStateful('');
  const subMessage = useStateful(
    withdrawingWizardTranslations('withdrawingSubStep_subMessage_pressWithdrawAndApprove'),
  );

  // Display the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError, wizardsCommonTranslations);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage, wizardsCommonTranslations]);

  const withdrawTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.withdrawTokens();
    onPromiEventAction(promiEvent);
  }, [message, subMessage, wizardsCommonTranslations, orbsAccountStore, onPromiEventAction]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: withdrawTokens,
      title: withdrawingWizardTranslations('withdrawingSubStep_action_withdraw'),
    }),
    [withdrawTokens, withdrawingWizardTranslations],
  );

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={withdrawingWizardTranslations('withdrawingSubStep_stepTitle', {
        orbsForWithdrawal: fullOrbsReadyForWithdrawal,
      })}
      infoTitle={withdrawingWizardTranslations('withdrawingSubStep_stepExplanation')}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_withdrawing_tx'}
      actionButtonProps={actionButtonProps}
      addCancelButton
      onCancelButtonClicked={closeWizard}
    />
  );
});
