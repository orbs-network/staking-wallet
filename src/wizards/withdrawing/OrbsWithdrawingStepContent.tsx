import React, { useCallback, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import { useStateful } from 'react-hanger';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';

export const OrbsWithdrawingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

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
    subMessage.setValue(PLEASE_APPROVE_TX_MESSAGE);

    const promiEvent = orbsAccountStore.withdrawTokens();
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, onPromiEventAction]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_initiate_withdrawing_tx'}>
      <Typography variant={'h5'}>Withdrawing {fullOrbsReadyForWithdrawal} Orbs</Typography>
      <Typography variant={'body1'}>{message.value}</Typography>
      <br />
      <Typography variant={'body2'}>{subMessage.value}</Typography>

      <br />
      <br />

      <Button disabled={disableInputs} onClick={withdrawTokens}>
        Withdraw
      </Button>
    </WizardContent>
  );
});
