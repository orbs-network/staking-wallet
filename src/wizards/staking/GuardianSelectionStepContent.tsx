import React, { useCallback, useEffect } from 'react';
import { Button, Input, TextField, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber, useStateful } from 'react-hanger';
import { useGuardiansStore, useOrbsAccountStore } from '../../store/storeHooks';
import { JSON_RPC_ERROR_CODES } from '../../constants/ethereumErrorCodes';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardiansTable } from '../../components/GuardiansTable';

const inputTestProps = { 'data-testid': 'wizard_sub_step_select_amount_for_staking' };

export const GuardianSelectionStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const guardiansStore = useGuardiansStore();
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

    const promiEvent = orbsAccountStore.stakeOrbs(orbsForStaking.value);
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, orbsForStaking.value, onPromiEventAction]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_initiate_guardian_selection_tx'}>
      <Typography>Select your guardian</Typography>
      <Typography variant={'caption'}>{message.value}</Typography>
      <br />
      <Typography variant={'caption'}>{subMessage.value}</Typography>

      <br />
      <br />

      <GuardiansTable guardians={guardiansStore.guardiansList} />
    </WizardContent>
  );
});
