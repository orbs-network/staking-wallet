import React, { useCallback, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useStateful } from 'react-hanger';
import { useGuardiansStore } from '../../store/storeHooks';
import { JSON_RPC_ERROR_CODES } from '../../constants/ethereumErrorCodes';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardiansTable } from '../../components/GuardiansTable';
import { TGuardianInfoExtended } from '../../store/GuardiansStore';

export const GuardianSelectionStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const guardiansStore = useGuardiansStore();

  // Start and limit by allowance
  const message = useStateful('Select a guardian');
  const subMessage = useStateful('Press "Select" and accept the transaction');

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

  const selectGuardian = useCallback(
    (guardian: TGuardianInfoExtended) => {
      message.setValue('');
      subMessage.setValue(
        'Please approve the transaction, we will move to the next stage as soon as the transaction is confirmed',
      );

      const promiEvent = guardiansStore.selectGuardian(guardian.address);
      onPromiEventAction(promiEvent);
    },
    [guardiansStore, message, onPromiEventAction, subMessage],
  );

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_initiate_guardian_selection_tx'}>
      <Typography>Select your guardian</Typography>
      <Typography variant={'caption'}>{message.value}</Typography>
      <br />
      <Typography variant={'caption'}>{subMessage.value}</Typography>

      <br />
      <br />

      <GuardiansTable guardians={guardiansStore.guardiansList} onGuardianSelect={selectGuardian} />
    </WizardContent>
  );
});
