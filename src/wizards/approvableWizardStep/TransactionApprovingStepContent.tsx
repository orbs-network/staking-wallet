import React, { useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useStateful, useBoolean } from 'react-hanger';

interface IProps {
  txHash: string;
  verificationCount: number;
  onStepFinished(): void;
  requiredConfirmations: number;
}

export const TransactionApprovingStepContent: React.FC<IProps> = (props: IProps) => {
  const { onStepFinished, txHash, verificationCount, requiredConfirmations } = props;

  const allowToProceed = useBoolean(false);
  const message = useStateful('Waiting to receive enough confirmations');
  const subMessage = useStateful('');

  useEffect(() => {
    subMessage.setValue(`Got ${verificationCount} verifications out of recommended ${requiredConfirmations}`);
  }, [verificationCount, requiredConfirmations, subMessage]);

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
      <Typography>
        Link to{' '}
        <a href={`https://etherscan.com/tx/${txHash}`} target={'_blank'} rel={'noopener noreferrer'}>
          Ether Scan
        </a>{' '}
      </Typography>
      <Typography variant={'caption'}>Wait a few seconds... </Typography>

      {allowToProceed.value && <Button onClick={onStepFinished}>Proceed</Button>}
    </WizardContent>
  );
};
