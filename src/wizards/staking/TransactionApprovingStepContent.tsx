import React, { useCallback, useEffect } from 'react';
import { Button, Input, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber, useBoolean, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { JSON_RPC_ERROR_CODES } from '../../constants/ethereumErrorCodes';
import { debug } from 'webpack';
import { TransactionVerificationListener } from '../../transactions/TransactionVerificationListener';

interface IProps {
  txHash: string;
  transactionVerificationListener: TransactionVerificationListener;
  onStepFinished(): void;
}

const MIN_TX_VERIFICATIONS = 6;

export const TransactionApprovingStepContent: React.FC<IProps> = (props: IProps) => {
  const { onStepFinished, transactionVerificationListener, txHash } = props;
  const message = useStateful('Waiting to receive enough confirmations');
  const subMessage = useStateful('');

  useEffect(() => {
    transactionVerificationListener.subscribeToTxConfirmation((confirmationNumber, receipt) => {
      subMessage.setValue(`Current transaction verification : ${confirmationNumber}/${MIN_TX_VERIFICATIONS}`);

      console.log('Confiramtion:' , confirmationNumber);

      if (confirmationNumber >= MIN_TX_VERIFICATIONS) {
        onStepFinished();
      }
    });

    return () => {
      console.log('Clearing subscriptions');
      transactionVerificationListener.clearAllSubscriptions();
    };
  }, [transactionVerificationListener, onStepFinished, subMessage]);

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
      <Button onClick={onStepFinished}>Proceed</Button>
    </WizardContent>
  );
};
