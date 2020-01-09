import React, { useCallback, useMemo, useRef } from 'react';
import { useBoolean, useNumber, useStateful } from 'react-hanger';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { TransactionApprovingSubStepContent } from './subSteps/TransactionApprovingSubStepContent';
import { CongratulationsSubStepContent } from './subSteps/CongratulationsSubStepContent';

type TStepState = 'Action' | 'Approving' | 'Success';

const REQUIRED_CONFIRMATIONS = 6;

export interface ITransactionCreationStepProps<T> {
  orbsTxCreatingAction(txCreatingParam: T): void;
  disableInputs: boolean;
  stakingError?: Error;
}

interface IProps<T> {
  // Tx creation sub step
  transactionCreationSubStepContent: React.FC<ITransactionCreationStepProps<T>>;
  txCreatingAction(txCreatingParam: T): Promise<{ txPromivent: PromiEvent<TransactionReceipt> }>;

  // Congratulations sub step
  finishedActionName: string;
  moveToNextStepAction: () => void;
  moveToNextStepTitle: string;
}

//TODO : O.L : FUTURE : See how we can wrap this generic function with 'React.Memo'
//  note: although everything here use hooks, so the performance does not get penalized
export function ApprovableWizardStep<T>(props: IProps<T>): React.ReactElement {
  const {
    transactionCreationSubStepContent: TransactionCreationSubStepContent,
    txCreatingAction,
    finishedActionName,
    moveToNextStepAction,
    moveToNextStepTitle,
  } = props;

  const stepState = useStateful<TStepState>('Action');

  const unsubscribeFromAllPromiventListeners = useRef<() => void>(null);
  const goToApprovalSubStep = useCallback(() => stepState.setValue('Approving'), [stepState]);
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

  const txCreationAction = useCallback<(txCreationParam: T) => Promise<void>>(
    async txCreationParam => {
      disableTxCreationInputs.setTrue();

      const { txPromivent } = await txCreatingAction(txCreationParam);

      unsubscribeFromAllPromiventListeners.current = () => {
        // @ts-ignore
        return txPromivent.removeAllListeners();
      };

      txPromivent.on('confirmation', confirmation => {
        txVerificationsCount.setValue(confirmation);

        // DEV_NOTE : By API definition, the 'promivent' will fire up until confirmation number 24.
        if (confirmation >= 10) {
          disableTxCreationInputs.setFalse();
        }
      });
      txPromivent.once('receipt', receipt => {
        txHash.setValue(receipt.transactionHash);
        goToApprovalSubStep();
        disableTxCreationInputs.setFalse();
      });
      txPromivent.on('error', error => {
        txCreatingError.setValue(error);

        // @ts-ignore
        txPromivent.removeAllListeners();
        disableTxCreationInputs.setFalse();
      });
    },
    [disableTxCreationInputs, txCreatingAction, txVerificationsCount, txHash, goToApprovalSubStep, txCreatingError],
  );

  const currentSubStepContent = useMemo(() => {
    switch (stepState.value) {
      case 'Action':
        return (
          <TransactionCreationSubStepContent
            disableInputs={disableTxCreationInputs.value}
            stakingError={txCreatingError.value}
            orbsTxCreatingAction={txCreationAction}
          />
        );
      case 'Approving':
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
    txVerificationsCount.value,
    txHash.value,
    goToCongratulationSubStep,
    finishedActionName,
    moveToNextStepAction,
    moveToNextStepTitle,
  ]);

  return currentSubStepContent;
}
