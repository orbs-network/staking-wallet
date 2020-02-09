import React, { useEffect, useMemo } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { WizardContent } from '../../../components/wizards/WizardContent';
import { useStateful, useBoolean } from 'react-hanger';
import { BaseStepContent } from '../BaseStepContent';

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
    subMessage.setValue(`Got ${verificationCount} verifications out of recommended ${requiredConfirmations}`);
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

    return (
      <>
        {actionContent}
        <Typography>
          You can always check the transaction status at {/* eslint-disable-next-line react/jsx-no-target-blank */}
          <a href={`https://etherscan.com/tx/${txHash}`} rel={'noopener noreferrer'} target={'_blank'}>
            Etherscan
          </a>{' '}
        </Typography>
      </>
    );
  }, [allowToProceedValue, onStepFinished, txHash]);

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={'Approving your transaction'}
      disableInputs={false}
      contentTestId={'wizard_sub_step_wait_for_tx_confirmation'}
      innerContent={transactionApprovementContent}
    />
  );
};
