import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useBoolean, useNumber, useStateful } from 'react-hanger';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { TransactionApprovingSubStepContent } from './subSteps/TransactionApprovingSubStepContent';
import { CongratulationsSubStepContent } from './subSteps/CongratulationsSubStepContent';

type TStepState = 'Action' | 'Confirmation' | 'Success';

const REQUIRED_CONFIRMATIONS = 7;

export interface ITransactionCreationStepProps {
  onPromiEventAction(promiEvent: PromiEvent<TransactionReceipt>): void;
  skipToSuccess: () => void;
  disableInputs: boolean;
  closeWizard?: () => void;
  txError?: Error;
}

interface IProps<T = {}> {
  // Tx creation sub step
  transactionCreationSubStepContent: React.FC<ITransactionCreationStepProps & T>;

  // Congratulations sub step
  displayCongratulationsSubStep: boolean;
  finishedActionName: string;
  moveToNextStepAction: () => void;
  moveToNextStepTitle: string;

  // Wizard interaction
  closeWizard: () => void;

  // Extra props for the tx creation step
  propsForTransactionCreationSubStepContent?: object;
}

export const ApprovableWizardStep = React.memo<IProps>((props) => {
  const {
    transactionCreationSubStepContent: TransactionCreationSubStepContent,
    displayCongratulationsSubStep,
    finishedActionName,
    moveToNextStepAction,
    moveToNextStepTitle,
    propsForTransactionCreationSubStepContent,
    closeWizard,
  } = props;

  const stepState = useStateful<TStepState>('Action');

  const unsubscribeFromAllPromiventListenersRef = useRef<() => void>(null);
  const goToApprovalSubStep = useCallback(() => stepState.setValue('Confirmation'), [stepState]);
  const goToCongratulationSubStep = useCallback(() => stepState.setValue('Success'), [stepState]);

  const unsubscribeFromAllPromiventListeners = useCallback(() => {
    if (unsubscribeFromAllPromiventListenersRef.current) {
      unsubscribeFromAllPromiventListenersRef.current();
    }
  }, [unsubscribeFromAllPromiventListenersRef]);

  const onTransactionApprovingSubStepFinished = useCallback(() => {
    // First, unsubscribe
    unsubscribeFromAllPromiventListeners();

    // Do we want to display the congratulations sub step ?
    if (displayCongratulationsSubStep) {
      goToCongratulationSubStep();
    } else {
      moveToNextStepAction();
    }
  }, [
    unsubscribeFromAllPromiventListeners,
    goToCongratulationSubStep,
    moveToNextStepAction,
    displayCongratulationsSubStep,
  ]);

  const disableTxCreationInputs = useBoolean(false);
  const txHash = useStateful<string>('');
  const txConfirmationsCount = useNumber(-1);
  const txCreatingError = useStateful<Error>(null);

  const txCreationAction = useCallback<(promiEvent: PromiEvent<TransactionReceipt>) => void>(
    (promiEvent) => {
      disableTxCreationInputs.setTrue();

      unsubscribeFromAllPromiventListenersRef.current = () => {
        return (promiEvent as any).removeAllListeners();
      };

      promiEvent.on('confirmation', (confirmation) => {
        txConfirmationsCount.setValue(confirmation);

        // DEV_NOTE : By API definition, the 'promivent' will fire up until confirmation number 24.
        if (confirmation >= 10) {
          disableTxCreationInputs.setFalse();
        }
      });
      promiEvent.once('receipt', (receipt) => {
        txHash.setValue(receipt.transactionHash);
        goToApprovalSubStep();
        disableTxCreationInputs.setFalse();
      });
      promiEvent.on('error', (error) => {
        txCreatingError.setValue(error);

        (promiEvent as any).removeAllListeners();
        disableTxCreationInputs.setFalse();
      });
    },
    [disableTxCreationInputs, txConfirmationsCount, txHash, goToApprovalSubStep, txCreatingError],
  );

  useEffect(() => {
    return () => {
      if (unsubscribeFromAllPromiventListenersRef.current) {
        unsubscribeFromAllPromiventListenersRef.current();
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
            closeWizard={closeWizard}
            {...propsForTransactionCreationSubStepContent}
          />
        );
      case 'Confirmation':
        return (
          <TransactionApprovingSubStepContent
            requiredConfirmations={REQUIRED_CONFIRMATIONS}
            confirmationsCount={txConfirmationsCount.value}
            txHash={txHash.value}
            onStepFinished={onTransactionApprovingSubStepFinished}
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
    txConfirmationsCount.value,
    txHash.value,
    goToCongratulationSubStep,
    finishedActionName,
    moveToNextStepAction,
    moveToNextStepTitle,
    closeWizard,
    onTransactionApprovingSubStepFinished,
  ]);

  return currentSubStepContent;
});
