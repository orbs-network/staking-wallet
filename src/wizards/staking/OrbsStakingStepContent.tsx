import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';

export const OrbsStakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const orbsForStaking = orbsAccountStore.stakingContractAllowance;
  const fullOrbsForStaking = fullOrbsFromWeiOrbs(orbsForStaking);
  const message = useStateful('');
  const subMessage = useStateful('');

  // Display the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage]);

  const stakeTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(PLEASE_APPROVE_TX_MESSAGE);

    const promiEvent = orbsAccountStore.stakeTokens(orbsForStaking);
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, orbsForStaking, onPromiEventAction]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: stakeTokens,
      title: 'Stake',
    }),
    [stakeTokens],
  );

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={`In this step you will stake ${fullOrbsForStaking.toLocaleString()} ORBS`}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_staking_tx'}
      actionButtonProps={actionButtonProps}
    />
  );
});
