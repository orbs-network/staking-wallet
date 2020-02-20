import React, { useCallback, useEffect, useMemo } from 'react';
import { TextField } from '@material-ui/core';
import { useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';

export const OrbsAllowanceStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by liquid orbs
  const liquidOrbsAsNumber = fullOrbsFromWeiOrbs(orbsAccountStore.liquidOrbs);
  const orbsAllowance = useNumber(liquidOrbsAsNumber, { lowerLimit: 0, upperLimit: liquidOrbsAsNumber });
  const message = useStateful('Select the amount of ORBS you would like to stake');
  const subMessage = useStateful('');

  // Calculate the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage]);

  const setTokenAllowanceForStakingContract = useCallback(() => {
    message.setValue('');
    subMessage.setValue(PLEASE_APPROVE_TX_MESSAGE);

    const promiEvent = orbsAccountStore.setAllowanceForStakingContract(weiOrbsFromFullOrbs(orbsAllowance.value));
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, orbsAllowance.value, onPromiEventAction]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: setTokenAllowanceForStakingContract,
      title: 'Approve',
    }),
    [setTokenAllowanceForStakingContract],
  );

  // TODO : O.L : Add a number formatter here to display the sums with proper separation
  //  https://material-ui.com/components/text-fields/#FormattedInputs.tsx
  const allowanceInput = useMemo(() => {
    return (
      <TextField
        id={'orbsAllowance'}
        label={'Allowance'}
        type={'number'}
        value={orbsAllowance.value}
        onChange={e => orbsAllowance.setValue(parseInt(e.target.value))}
      />
    );
  }, [orbsAllowance]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={'Approve the staking contract to use your Orbs'}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_allowance_tx'}
      actionButtonProps={actionButtonProps}
      innerContent={allowanceInput}
    />
  );
});
