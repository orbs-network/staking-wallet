import React, { useCallback } from 'react';
import { Button, Input, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber, useBoolean, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { JSON_RPC_ERROR_CODES } from '../../constants/ethereumErrorCodes';

interface IProps {
  onStepFinished(): void;
}

const inputTestProps = { 'data-testid': 'orbs_amount_for_staking' };

export const OrbsStakingStepContent: React.FC<IProps> = (props: IProps) => {
  const { onStepFinished } = props;

  const orbsAccountStore = useOrbsAccountStore();
  const orbsForStaking = useNumber(parseInt(orbsAccountStore.liquidOrbs)); // Start with the maximum amount
  const inputsActive = useBoolean(true);
  const message = useStateful('Select amount of Orbs to stake');
  const subMessage = useStateful('Press "Stake" and accept the transaction');

  const errorMessageFromCode = useCallback((errorCode: number) => {
    let errorMessage = '';
    let errorSubMessage = '';

    switch (errorCode) {
      case JSON_RPC_ERROR_CODES.provider.userRejectedRequest:
        errorMessage = 'You have canceled the transaction.';
        errorSubMessage = 'In order to continue, please try again and approve the transaction';
        break;
      default:
        errorMessage = 'An error occurred while trying to send transaction to the staking wallet.';
        errorSubMessage = 'please try again';
        break;
    }

    return {
      errorMessage,
      errorSubMessage,
    };
  }, []);

  const stakeTokens = useCallback(async () => {
    inputsActive.setFalse();
    message.setValue('');
    subMessage.setValue('Please confirm transaction');

    try {
      const { txVerificationListener } = await orbsAccountStore.stakeOrbs(orbsForStaking.value);

      onStepFinished();
    } catch (e) {
      console.error(e);

      const { errorMessage, errorSubMessage } = errorMessageFromCode(e.code);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }

    inputsActive.setTrue();
  }, [inputsActive, subMessage, message, orbsAccountStore, orbsForStaking.value, onStepFinished, errorMessageFromCode]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_step_select_amount_for_stake'}>
      <Typography>Staking your tokens in the smart contract</Typography>
      <Typography variant={'caption'}>{message.value}</Typography>
      <br />
      <Typography variant={'caption'}>{subMessage.value}</Typography>

      <br />
      <br />

      {/* TODO : O.L : Add a number formatter here to display the sums with proper separation */}
      <Input
        type={'number'}
        value={orbsForStaking.value}
        onChange={e => orbsForStaking.setValue(parseInt(e.target.value))}
        disabled={!inputsActive.value}
        inputProps={inputTestProps}
      />
      <Button disabled={!inputsActive.value} onClick={stakeTokens}>
        STAKE
      </Button>
    </WizardContent>
  );
};
