import React, { useEffect, useMemo } from 'react';
import { Button, Link, TextField, Theme, Typography } from '@material-ui/core';
import { WizardContent } from '../../../components/wizards/WizardContent';
import { useStateful, useBoolean } from 'react-hanger';
import { BaseStepContent } from '../BaseStepContent';
import styled from 'styled-components';

interface IProps {
  txHash: string;
  verificationCount: number;
  onStepFinished(): void;
  requiredConfirmations: number;
}

export const TransactionApprovingSubStepContent: React.FC<IProps> = (props: IProps) => {
  const { onStepFinished, txHash, verificationCount, requiredConfirmations } = props;

  const allowToProceed = useBoolean(false);
  const message = useStateful('Waiting to receive enough confirmations');
  const subMessage = useStateful('');

  // Update the verification count text
  useEffect(() => {
    // TODO : O.L : FUTURE : Handle plurality
    subMessage.setValue(`Got ${verificationCount} conformations out of recommended ${requiredConfirmations}`);
  }, [verificationCount, requiredConfirmations, subMessage]);

  // Should allow the user to proceed ?
  useEffect(() => {
    if (verificationCount >= requiredConfirmations) {
      allowToProceed.setTrue();
    }
  }, [verificationCount, requiredConfirmations, allowToProceed]);

  const allowToProceedValue = allowToProceed.value;
  const transactionApprovementContent = useMemo(() => {
    let actionContent = null;
    if (allowToProceedValue) {
      actionContent = (
        <Button variant={'outlined'} onClick={onStepFinished}>
          Proceed
        </Button>
      );
    } else {
      actionContent = <Typography variant={'caption'}>This might take a few moments... </Typography>;
    }

    return actionContent;
  }, [allowToProceedValue, onStepFinished]);

  const titleFc = useMemo(() => {
    const titleMessage = verificationCount >= 1 ? 'Transaction Confirmed' : 'Transaction Pending';

    return () => (
      <Link href={`https://etherscan.com/tx/${txHash}`} rel={'noopener noreferrer'} target={'_blank'}>
        {titleMessage}
      </Link>
    );
  }, [txHash, verificationCount]);

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={titleFc}
      disableInputs={false}
      contentTestId={'wizard_sub_step_wait_for_tx_confirmation'}
      innerContent={transactionApprovementContent}
    />
  );
};
