import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useBoolean, useNumber, useStateful } from 'react-hanger';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { TransactionApprovingSubStepContent } from './subSteps/TransactionApprovingSubStepContent';
import { CongratulationsSubStepContent } from './subSteps/CongratulationsSubStepContent';

type TStepState = 'Action' | 'Confirmation' | 'Success';

const REQUIRED_CONFIRMATIONS = 6;

export interface ITransactionCreationStepProps {
  onPromiEventAction(promiEvent: PromiEvent<TransactionReceipt>): void;
  skipToSuccess: () => void;
  disableInputs: boolean;
  txError?: Error;
}

interface IProps<T = {}> {
  // Tx creation sub step
  transactionCreationSubStepContent: React.FC<ITransactionCreationStepProps & T>;

  // Congratulations sub step
  finishedActionName: string;
  moveToNextStepAction: () => void;
  moveToNextStepTitle: string;

  // Extra props for the tx creation step
  propsForTransactionCreationSubStepContent?: object;
}

export const ApprovableWizardStep = React.memo<IProps>(props => {
  const {
    transactionCreationSubStepContent: TransactionCreationSubStepContent,
    finishedActionName,
    moveToNextStepAction,
    moveToNextStepTitle,
    propsForTransactionCreationSubStepContent,
  } = props;

  const stepState = useStateful<TStepState>('Action');

  const unsubscribeFromAllPromiventListeners = useRef<() => void>(null);
  const goToApprovalSubStep = useCallback(() => stepState.setValue('Confirmation'), [stepState]);
  const goToCongratulationSubStep = useCallback(() => {
    if (unsubscribeFromAllPromiventListeners.current) {
      unsubscribeFromAllPromiventListeners.current();
    }
    stepState.setValue('Success');
  }, [stepState, unsubscribeFromAllPromiventListeners]);

  const disableTxCreationInputs = useBoolean(false);
  const txHash = useStateful<string>('');
  const txVerificationsCount = useNumber(-1);
  const txCreatingError = useStateful<Error>(null);

  const txCreationAction = useCallback<(promiEvent: PromiEvent<TransactionReceipt>) => void>(
    promiEvent => {
      disableTxCreationInputs.setTrue();

      unsubscribeFromAllPromiventListeners.current = () => {
        return (promiEvent as any).removeAllListeners();
      };

      promiEvent.on('confirmation', confirmation => {
        txVerificationsCount.setValue(confirmation);

        // DEV_NOTE : By API definition, the 'promivent' will fire up until confirmation number 24.
        if (confirmation >= 10) {
          disableTxCreationInputs.setFalse();
        }
      });
      promiEvent.once('receipt', receipt => {
        txHash.setValue(receipt.transactionHash);
        goToApprovalSubStep();
        disableTxCreationInputs.setFalse();
      });
      promiEvent.on('error', error => {
        txCreatingError.setValue(error);

        (promiEvent as any).removeAllListeners();
        disableTxCreationInputs.setFalse();
      });
    },
    [disableTxCreationInputs, txVerificationsCount, txHash, goToApprovalSubStep, txCreatingError],
  );

  useEffect(() => {
    return () => {
      if (unsubscribeFromAllPromiventListeners.current) {
        unsubscribeFromAllPromiventListeners.current();
      }
    };
  }, []);

  const currentSubStepContent = useMemo(() => {
    switch (stepState.value) {
      case 'Action':
        return (
          <TransactionCreationSubStepContent
            disableInputs={disableTxCreationInputs.value}
            txError={txCreatingError.value}
            onPromiEventAction={txCreationAction}
            skipToSuccess={goToCongratulationSubStep}
            {...propsForTransactionCreationSubStepContent}
          />
        );
      case 'Confirmation':
        return (
          <TransactionApprovingSubStepContent
            requiredConfirmations={REQUIRED_CONFIRMATIONS}
            verificationCount={txVerificationsCount.value}
            txHash={txHash.value}
            onStepFinished={goToCongratulationSubStep}
          />
        );
      case 'Success':
        return (
          <CongratulationsSubStepContent
            finishedActionName={finishedActionName}
            moveToNextStepAction={moveToNextStepAction}
            moveToNextStepTitle={moveToNextStepTitle}
          />
        );
      default:
        throw new Error(`Invalid step state value of ${stepState.value}`);
    }
  }, [
    stepState.value,
    disableTxCreationInputs.value,
    txCreatingError.value,
    txCreationAction,
    propsForTransactionCreationSubStepContent,
    txVerificationsCount.value,
    txHash.value,
    goToCongratulationSubStep,
    finishedActionName,
    moveToNextStepAction,
    moveToNextStepTitle,
  ]);

  return currentSubStepContent;
});
