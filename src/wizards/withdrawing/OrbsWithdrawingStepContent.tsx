import React, { useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useWizardsCommonTranslations } from '../../translations/translationsHooks';

export const OrbsWithdrawingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const fullOrbsReadyForWithdrawal = fullOrbsFromWeiOrbs(orbsAccountStore.orbsInCoolDown);
  const message = useStateful('');
  const subMessage = useStateful('Press "Withdraw" and accept the transaction');

  // Display the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage]);

  const withdrawTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.withdrawTokens();
    onPromiEventAction(promiEvent);
  }, [message, subMessage, wizardsCommonTranslations, orbsAccountStore, onPromiEventAction]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: withdrawTokens,
      title: 'Withdraw',
    }),
    [withdrawTokens],
  );

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={`Withdrawing ${fullOrbsReadyForWithdrawal} Orbs`}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_withdrawing_tx'}
      actionButtonProps={actionButtonProps}
    />
  );
});
