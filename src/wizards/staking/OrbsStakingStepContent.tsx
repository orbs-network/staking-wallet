import React, { useCallback, useEffect } from 'react';
import { Button, Input, TextField, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { JSON_RPC_ERROR_CODES } from '../../constants/ethereumErrorCodes';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';

const inputProps = { readOnly: true };

export const OrbsStakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const stakingContractAllowanceAsNumber = parseInt(orbsAccountStore.stakingContractAllowance); // TODO : O.L : Ensure this number converting is valid.
  const orbsForStaking = useNumber(stakingContractAllowanceAsNumber, {
    lowerLimit: 0,
    upperLimit: stakingContractAllowanceAsNumber,
  });
  const message = useStateful('Select amount of Orbs to stake');
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
    if (txError) {
      // @ts-ignore (these errors will have code)
      const { errorMessage, errorSubMessage } = errorMessageFromCode(txError.code);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, errorMessageFromCode, message, subMessage]);

  const stakeTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(
      'Please approve the transaction, we will move to the next stage as soon as the transaction is confirmed',
    );

    const promiEvent = orbsAccountStore.stakeTokens(orbsForStaking.value);
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, orbsForStaking.value, onPromiEventAction]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_initiate_staking_tx'}>
      <Typography>In this step you will stake {orbsForStaking.value} Orbs </Typography>
      <Typography variant={'caption'}>{message.value}</Typography>
      <br />
      <Typography variant={'caption'}>{subMessage.value}</Typography>

      <br />
      <br />

      <Button disabled={disableInputs} onClick={stakeTokens}>
        Stake
      </Button>
    </WizardContent>
  );
});
