import React, { useCallback, useEffect } from 'react';
import { Button, Input, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { JSON_RPC_ERROR_CODES } from '../../constants/ethereumErrorCodes';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';

const inputTestProps = { 'data-testid': 'orbs_amount_for_staking' };

export const OrbsAllowanceStepContent: React.FC<ITransactionCreationStepProps<number>> = React.memo(props => {
  const { disableInputs, orbsTxCreatingAction, stakingError } = props;

  const orbsAccountStore = useOrbsAccountStore();
  const orbsAllowance = useNumber(parseInt(orbsAccountStore.liquidOrbs)); // Start with the maximum amount
  const message = useStateful('Select amount of Orbs to allow');
  const subMessage = useStateful('Press "Stake" and accept the transaction');

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
    if (stakingError) {
      // @ts-ignore (these errors will have code)
      const { errorMessage, errorSubMessage } = errorMessageFromCode(stakingError.code);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [stakingError, errorMessageFromCode, message, subMessage]);

  const stakeTokens = useCallback(async () => {
    message.setValue('');
    subMessage.setValue(
      'Please approve the transaction, we will move to the next stage as soon as the transaction is confirmed',
    );

    orbsTxCreatingAction(orbsAllowance.value);
  }, [message, subMessage, orbsTxCreatingAction, orbsAllowance.value]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_step_select_amount_for_stake'}>
      <Typography>Approve the smart contract to use youtr Orbs</Typography>
      <Typography variant={'caption'}>{message.value}</Typography>
      <br />
      <Typography variant={'caption'}>{subMessage.value}</Typography>

      <br />
      <br />

      {/* TODO : O.L : Add a number formatter here to display the sums with proper separation */}
      <Input
        type={'number'}
        value={orbsAllowance.value}
        onChange={e => orbsAllowance.setValue(parseInt(e.target.value))}
        disabled={disableInputs}
        inputProps={inputTestProps}
      />
      <Button disabled={disableInputs} onClick={stakeTokens}>
        Allow
      </Button>
    </WizardContent>
  );
});
