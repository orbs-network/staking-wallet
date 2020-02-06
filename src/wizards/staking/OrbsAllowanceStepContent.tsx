import React, { useCallback, useEffect } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';

export const OrbsAllowanceStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by liquid orbs
  const liquidOrbsAsNumber = fullOrbsFromWeiOrbs(orbsAccountStore.liquidOrbs);
  const orbsAllowance = useNumber(liquidOrbsAsNumber, { lowerLimit: 0, upperLimit: liquidOrbsAsNumber });
  const message = useStateful('Select amount of Orbs to allow');
  const subMessage = useStateful('Press "Stake" and accept the transaction');

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

    const promiEvent = orbsAccountStore.setAllowanceForStakingContract(weiOrbsFromFullOrbs(orbsAllowance.value));
    onPromiEventAction(promiEvent);
  }, [message, subMessage, orbsAccountStore, orbsAllowance.value, onPromiEventAction]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_initiate_allowance_tx'}>
      <Typography variant={'h5'}>Approve the smart contract to use your Orbs</Typography>
      <Typography variant={'body1'}>{message.value}</Typography>
      <br />
      <Typography variant={'body2'}>{subMessage.value}</Typography>

      <br />
      <br />

      {/* TODO : O.L : Add a number formatter here to display the sums with proper separation */}
      {/* https://material-ui.com/components/text-fields/#FormattedInputs.tsx  */}
      <TextField
        id={'orbsAllowance'}
        label={'Allowance'}
        type={'number'}
        value={orbsAllowance.value}
        onChange={e => orbsAllowance.setValue(parseInt(e.target.value))}
      />

      <Button disabled={disableInputs} onClick={stakeTokens}>
        Allow
      </Button>
    </WizardContent>
  );
});
