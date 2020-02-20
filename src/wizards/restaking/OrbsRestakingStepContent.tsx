import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';

export const OrbsRestakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const fullOrbsForRestaking = fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs);
  const message = useStateful('');
  const subMessage = useStateful('Press "Restake" and accept the transaction');

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
    subMessage.setValue(PLEASE_APPROVE_TX_MESSAGE);

    const promiEvent = orbsAccountStore.restakeTokens();
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, onPromiEventAction]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: restakeTokens,
      title: 'Restake',
    }),
    [restakeTokens],
  );

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={`Restaking ${fullOrbsForRestaking} ORBS`}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_restaking_tx'}
      actionButtonProps={actionButtonProps}
    />
  );
});
