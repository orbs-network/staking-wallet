import React, { useCallback, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useStateful } from 'react-hanger';
import { useGuardiansStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardiansTable } from '../../components/GuardiansTable';
import { TGuardianInfoExtended } from '../../store/GuardiansStore';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';

export const GuardianSelectionStepContent = observer((props: ITransactionCreationStepProps) => {
  const { onPromiEventAction, txError } = props;

  const guardiansStore = useGuardiansStore();

  // Start and limit by allowance
  const message = useStateful('Select a guardian');
  const subMessage = useStateful('Press "Select" and accept the transaction');

  // Display the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage]);

  const selectGuardian = useCallback(
    (guardian: TGuardianInfoExtended) => {
      message.setValue('');
      subMessage.setValue(PLEASE_APPROVE_TX_MESSAGE);

      const promiEvent = guardiansStore.selectGuardian(guardian.address);
      onPromiEventAction(promiEvent);
    },
    [guardiansStore, message, onPromiEventAction, subMessage],
  );

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_initiate_guardian_selection_tx'}>
      <Typography variant={'h5'}>Select your guardian</Typography>
      <Typography variant={'body1'}>{message.value}</Typography>
      <br />
      <Typography variant={'body2'}>{subMessage.value}</Typography>

      <br />
      <br />

      <GuardiansTable guardians={guardiansStore.guardiansList} onGuardianSelect={selectGuardian} />
    </WizardContent>
  );
});
