import React, { useCallback } from 'react';
import { Button, Input, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useNumber } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';

interface IProps {
  onStepFinished(): void;
}

export const OrbsStakingStepContent: React.FC<IProps> = (props: IProps) => {
  const { onStepFinished } = props;

  const orbsAccountStore = useOrbsAccountStore();
  const orbsForStaking = useNumber(parseInt(orbsAccountStore.liquidOrbs)); // Start with the maximum amount

  const stakeTokens = useCallback(async () => {
    try {
      const { txVerificationListener } = await orbsAccountStore.stakeOrbs(orbsForStaking.value);

      onStepFinished();
    } catch (e) {
      console.error(e);
    }
  }, [orbsAccountStore, onStepFinished, orbsForStaking]);

  return (
    <WizardContent data-testid={'wizard_step_select_amount_for_stake'}>
      <Typography>Staking your tokens in the smart contract</Typography>
      {/* TODO : O.L : Add a number formatter here to dispaly the sums with proper separation */}
      <Input
        type={'number'}
        value={orbsForStaking.value}
        onChange={e => orbsForStaking.setValue(parseInt(e.target.value))}
        inputProps={{ 'data-testid': 'orbs_amount_for_staking' }}
      />
      <Button onClick={stakeTokens}>STAKE</Button>
    </WizardContent>
  );
};
