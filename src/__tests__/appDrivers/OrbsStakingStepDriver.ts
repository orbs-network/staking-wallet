import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class OrbsStakingStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_staking_tx');
  }

  setAmountForStaking(allowanceInOrbs: number) {
    fireEvent.change(this.orbsForAllowanceInput, { target: { value: allowanceInOrbs.toString() } });
  }

  clickOnStake() {
    const orbsStakingActionButton = within(this.txCreatingSubStepComponent).getByText('Stake');
    fireEvent.click(orbsStakingActionButton);
  }

  public get orbsForAllowanceInput() {
    return within(this.txCreatingSubStepComponent).getByLabelText('Staking');
  }
}
