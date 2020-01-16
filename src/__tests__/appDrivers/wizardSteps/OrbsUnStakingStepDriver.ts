import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class OrbsUnstakingStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_unstaking_tx');
  }

  setAmountForStaking(allowanceInOrbs: number) {
    fireEvent.change(this.orbsForUnstakingInput, { target: { value: allowanceInOrbs.toString() } });
  }

  clickOnUnStake() {
    const orbsStakingActionButton = within(this.txCreatingSubStepComponent).getByText('Unstake');
    fireEvent.click(orbsStakingActionButton);
  }

  public get orbsForUnstakingInput() {
    return within(this.txCreatingSubStepComponent).getByLabelText('Unstaking');
  }
}
