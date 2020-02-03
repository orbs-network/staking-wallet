import React, { useCallback, useEffect } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';

export const OrbsUntakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const stakedOrbsNumericalFormat = fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs);
  const orbsForUnstaking = useNumber(stakedOrbsNumericalFormat, {
    lowerLimit: 0,
    upperLimit: stakedOrbsNumericalFormat,
  });
  const message = useStateful('Select amount of Orbs to unstake');
  const subMessage = useStateful('Press "Unstake" and accept the transaction');

  // Display the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage]);

  const unstakeTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(PLEASE_APPROVE_TX_MESSAGE);

    const promiEvent = orbsAccountStore.unstakeTokens(weiOrbsFromFullOrbs(orbsForUnstaking.value));
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, orbsForUnstaking.value, onPromiEventAction]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_initiate_unstaking_tx'}>
      <Typography>Unstaking your tokens</Typography>
      <Typography variant={'caption'}>{message.value}</Typography>
      <br />
      <Typography variant={'caption'}>{subMessage.value}</Typography>

      <br />
      <br />

      {/* TODO : O.L : Limit the maximum value to the value of the allowance */}
      {/* TODO : O.L : Add a number formatter here to display the sums with proper separation */}
      {/* https://material-ui.com/components/text-fields/#FormattedInputs.tsx  */}
      <TextField
        id={'orbsUntaking'}
        label={'Unstaking'}
        type={'number'}
        value={orbsForUnstaking.value}
        onChange={e => orbsForUnstaking.setValue(parseInt(e.target.value))}
      />

      <Button disabled={disableInputs} onClick={unstakeTokens}>
        Unstake
      </Button>
    </WizardContent>
  );
});
