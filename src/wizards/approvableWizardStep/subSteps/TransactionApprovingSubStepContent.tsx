import React, { useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { WizardContent } from '../../../components/wizards/WizardContent';
import { useStateful, useBoolean } from 'react-hanger';

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

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_step_wait_for_staking_confirmation'}>
      <Typography>Approving your transaction</Typography>
      <Typography variant={'caption'}>{message.value}</Typography>
      <br />
      <Typography variant={'caption'}>{subMessage.value}</Typography>

      <div data-testid={'transaction_pending_indicator'}></div>
      {!allowToProceed.value && <Typography variant={'caption'}>This might take a few moments... </Typography>}
      {allowToProceed.value && (
        <Button variant={'outlined'} onClick={onStepFinished}>
          Proceed
        </Button>
      )}

      <br />

      <Typography>
        You can always check the transaction status at {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <a href={`https://etherscan.com/tx/${txHash}`} rel={'noopener noreferrer'} target={'_blank'}>
          Ether Scan
        </a>{' '}
      </Typography>
    </WizardContent>
  );
};
