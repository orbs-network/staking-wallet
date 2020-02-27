import React, { useEffect, useMemo } from 'react';
import { Button, Link, Typography } from '@material-ui/core';
import { useStateful, useBoolean } from 'react-hanger';
import { BaseStepContent } from '../BaseStepContent';
import { useApprovableWizardStepTranslations } from '../../../translations/translationsHooks';

interface IProps {
  txHash: string;
  confirmationsCount: number;
  onStepFinished(): void;
  requiredConfirmations: number;
}

export const TransactionApprovingSubStepContent: React.FC<IProps> = (props: IProps) => {
  const { onStepFinished, txHash, confirmationsCount, requiredConfirmations } = props;

  const approvableWizardStepTranslations = useApprovableWizardStepTranslations();
  const allowToProceed = useBoolean(false);
  const message = useStateful(approvableWizardStepTranslations('waitingToReceiveEnoughConfirmations'));
  const subMessage = useStateful('');

  // Update the verification count text
  useEffect(() => {
    subMessage.setValue(
      approvableWizardStepTranslations('gotXConfirmationsOutOfRecommendedY', {
        count: confirmationsCount,
        recommended: requiredConfirmations,
      }),
    );
  }, [approvableWizardStepTranslations, confirmationsCount, requiredConfirmations, subMessage]);

  // Should allow the user to proceed ?
  useEffect(() => {
    if (confirmationsCount >= requiredConfirmations) {
      allowToProceed.setTrue();
    }
  }, [confirmationsCount, requiredConfirmations, allowToProceed]);

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
      actionContent = (
        <Typography variant={'caption'}>{approvableWizardStepTranslations('thisMightTakeAFewMoments')}</Typography>
      );
    }

    return actionContent;
  }, [allowToProceedValue, approvableWizardStepTranslations, onStepFinished]);

  const titleFc = useMemo(() => {
    const titleMessage =
      confirmationsCount >= 1
        ? approvableWizardStepTranslations('txConfirmed')
        : approvableWizardStepTranslations('txPending');

    return () => (
      <Link href={`https://etherscan.com/tx/${txHash}`} rel={'noopener noreferrer'} target={'_blank'}>
        {titleMessage}
      </Link>
    );
  }, [approvableWizardStepTranslations, txHash, confirmationsCount]);

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
