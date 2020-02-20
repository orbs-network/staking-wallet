import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class OrbsStakingStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_staking_tx');
  }

  clickOnStake() {
    const orbsStakingActionButton = within(this.txCreatingSubStepComponent).getByText('Stake');
    fireEvent.click(orbsStakingActionButton);
  }
}
