import React, { useCallback, useMemo } from 'react';
import { useBoolean, useNumber, useStateful } from 'react-hanger';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { TransactionApprovingSubStepContent } from './TransactionApprovingSubStepContent';

type TStepState = 'Action' | 'Approving' | 'Success';

export interface ITransactionCreationStepProps {
  orbsTxCreatingAction(amountInOrbs: number): void;
  disableInputs: boolean;
  stakingError?: Error;
}

interface IProps {
  transactionCreationSubStepContent: any;

  orbsStakingAction(amount: number): Promise<{ txPromivent: PromiEvent<TransactionReceipt> }>;
}

export const ApprovableWizardStep: React.FC<IProps> = props => {
  const { transactionCreationSubStepContent: TransactionCreationSubStepContent, orbsStakingAction } = props;

  const stepState = useStateful<TStepState>('Action');

  const goToApprovalSubStep = useCallback(() => stepState.setValue('Approving'), [stepState]);
  const goToCongratulationSubStep = useCallback(() => stepState.setValue('Approving'), [stepState]);

  const disableTxCreationInputs = useBoolean(false);
  const txHash = useStateful<string>('');
  const txVerificationsCount = useNumber(-1);
  const txCreatingError = useStateful<Error>(null);

  const txCreationAction = useCallback(
    async (orbsToStake: number) => {
      disableTxCreationInputs.setTrue();

      const { txPromivent } = await orbsStakingAction(orbsToStake);

      txPromivent.on('confirmation', confirmation => {
        txVerificationsCount.setValue(confirmation);

        if (confirmation >= 10) {
          // @ts-ignore
          pe.removeAllListeners();
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
    [
      disableTxCreationInputs,
      orbsStakingAction,
      txVerificationsCount,
      txHash,
      goToApprovalSubStep,
      txCreatingError,
    ],
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
            requiredConfirmations={6}
            verificationCount={txVerificationsCount.value}
            txHash={txHash.value}
            onStepFinished={goToCongratulationSubStep}
          />
        );
      case 'Success':
        return <div>Approving</div>;
      default:
        throw new Error(`Invalid step state value of ${stepState.value}`);
    }
  }, [
    disableTxCreationInputs.value,
    goToCongratulationSubStep,
    txCreatingError.value,
    txHash.value,
    txVerificationsCount.value,
    stepState.value,
    txCreationAction,
  ]);

  return currentSubStepContent;
};
