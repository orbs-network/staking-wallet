import React, { useCallback, useMemo } from 'react';
import { useStateful } from 'react-hanger';
import { PromiEvent, TransactionReceipt } from 'web3-core';

type TStepState = 'Action' | 'Approving' | 'Success';

export interface ITransactionCreationStepProps {
  onTxStarted(pe: PromiEvent<TransactionReceipt>, errorHandler: (e: Error) => void): void;
}

interface IProps {
  transactionCreationStepContent: any;
}

export const ApprovableWizardStep: React.FC<IProps> = props => {
  const { transactionCreationStepContent: TransactionCreationStepContent } = props;

  const stepState = useStateful<TStepState>('Action');

  const onTxStarted = useCallback(() => {
    console.log('Tx started');
  }, []);

  const currentContent = useMemo(() => {
    switch (stepState.value) {
      case 'Action':
        return <TransactionCreationStepContent onTxStarted={onTxStarted} />;
      case 'Approving':
        return <div>Approving</div>;
      case 'Success':
        return <div>Approving</div>;
      default:
        throw new Error(`Invalid step state value of ${stepState.value}`);
    }
  }, [TransactionCreationStepContent, onTxStarted, stepState.value]);

  return currentContent;
};