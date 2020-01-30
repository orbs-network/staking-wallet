import React, { useCallback, useEffect } from 'react';
import { Button, Input, TextField, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { JSON_RPC_ERROR_CODES } from '../../constants/ethereumErrorCodes';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';

const inputTestProps = { 'data-testid': 'wizard_sub_step_select_amount_for_staking' };

export const OrbsWithdrawingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const stakedOrbsNumericalFormat = orbsAccountStore.stakedOrbs; // TODO : O.L : Ensure this number converting is valid.
  const orbsForUnstaking = useNumber(stakedOrbsNumericalFormat, {
    lowerLimit: 0,
    upperLimit: stakedOrbsNumericalFormat,
  });
  const message = useStateful('Select amount of Orbs to unstake');
  const subMessage = useStateful('Press "Unstake" and accept the transaction');

  const errorMessageFromCode = useCallback((errorCode: number) => {
    let errorMessage = '';
    let errorSubMessage = '';

    switch (errorCode) {
      case JSON_RPC_ERROR_CODES.provider.userRejectedRequest:
        errorMessage = 'You have canceled the transaction.';
        errorSubMessage = 'In order to continue, please try again and approve the transaction';
        break;
      default:
        errorMessage = 'An error occurred while trying to send transaction to the staking wallet.';
        errorSubMessage = 'please try again';
        break;
    }

    return {
      errorMessage,
      errorSubMessage,
    };
  }, []);

  // Display the proper error message
  useEffect(() => {
    if (txError) {
      // @ts-ignore (these errors will have code)
      const { errorMessage, errorSubMessage } = errorMessageFromCode(txError.code);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, errorMessageFromCode, message, subMessage]);

  const withdrawTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(
      'Please approve the transaction, we will move to the next stage as soon as the transaction is confirmed',
    );

    const promiEvent = orbsAccountStore.withdrawTokens();
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, orbsForUnstaking.value, onPromiEventAction]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_initiate_withdrawing_tx'}>
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

      <Button disabled={disableInputs} onClick={withdrawTokens}>
        Withdraw
      </Button>
    </WizardContent>
  );
});
