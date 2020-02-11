import React, { useCallback, useEffect, useMemo } from 'react';
import { useStateful } from 'react-hanger';
import { useGuardiansStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardiansTable } from '../../components/GuardiansTable';
import { TGuardianInfoExtended } from '../../store/GuardiansStore';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';
import { BaseStepContent } from '../approvableWizardStep/BaseStepContent';

export const GuardianSelectionStepContent = observer((props: ITransactionCreationStepProps) => {
  const { onPromiEventAction, txError, disableInputs } = props;

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

  const guardianSelectionContent = useMemo(() => {
    return (
      <GuardiansTable
        guardianSelectionMode={'Select'}
        guardians={guardiansStore.guardiansList}
        onGuardianSelect={selectGuardian}
        tableTestId={'guardian_selection_sub_step_guardians_table'}
      />
    );
  }, [guardiansStore.guardiansList, selectGuardian]);

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={'Select your guardian'}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_guardian_selection_tx'}
      innerContent={guardianSelectionContent}
    />
  );
});
