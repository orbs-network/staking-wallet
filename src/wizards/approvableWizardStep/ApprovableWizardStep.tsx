import React, { useCallback, useMemo } from 'react';
import { useBoolean, useNumber, useStateful } from 'react-hanger';
import { PromiEvent, TransactionReceipt } from 'web3-core';

type TStepState = 'Action' | 'Approving' | 'Success';

export interface ITransactionCreationStepProps {
  orbsTxCreatingAction(amountInOrbs: number): void;
  disableInputs: boolean;
  stakingError?: Error;
}

interface IProps {
  transactionCreationStepContent: any;

  orbsStakingAction(amount: number): Promise<{ txPromivent: PromiEvent<TransactionReceipt> }>;
}

export const ApprovableWizardStep: React.FC<IProps> = props => {
  const { transactionCreationStepContent: TransactionCreationStepContent, orbsStakingAction } = props;

  const stepState = useStateful<TStepState>('Action');

  const goToApprovalStep = useCallback(() => stepState.setValue('Approving'), [stepState]);

  const disableOrbsStakingInputs = useBoolean(false);
  const orbsStakingTx = useStateful<string>('');
  const orbsStakingTxVerificationCount = useNumber(-1);
  const orbsStakingError = useStateful<Error>(null);

  const txCreationAction = useCallback(
    async (orbsToStake: number) => {
      disableOrbsStakingInputs.setTrue();

      const { txPromivent } = await orbsStakingAction(orbsToStake);

      txPromivent.on('confirmation', confirmation => {
        orbsStakingTxVerificationCount.setValue(confirmation);

        if (confirmation >= 10) {
          // @ts-ignore
          pe.removeAllListeners();
          disableOrbsStakingInputs.setFalse();
        }
      });
      txPromivent.once('receipt', receipt => {
        orbsStakingTx.setValue(receipt.transactionHash);
        goToApprovalStep();
        disableOrbsStakingInputs.setFalse();
      });
      txPromivent.on('error', error => {
        orbsStakingError.setValue(error);

        // @ts-ignore
        txPromivent.removeAllListeners();
        disableOrbsStakingInputs.setFalse();
      });
    },
    [
      disableOrbsStakingInputs,
      orbsStakingAction,
      orbsStakingTxVerificationCount,
      orbsStakingTx,
      goToApprovalStep,
      orbsStakingError,
    ],
  );

  const currentContent = useMemo(() => {
    switch (stepState.value) {
      case 'Action':
        return (
          <TransactionCreationStepContent
            disableInputs={disableOrbsStakingInputs.value}
            stakingError={orbsStakingError.value}
            orbsTxCreatingAction={txCreationAction}
          />
        );
      case 'Approving':
        return <div>Approving</div>;
      case 'Success':
        return <div>Approving</div>;
      default:
        throw new Error(`Invalid step state value of ${stepState.value}`);
    }
  }, [disableOrbsStakingInputs.value, orbsStakingError.value, stepState.value, txCreationAction]);

  return currentContent;
};
