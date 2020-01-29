import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class OrbsWithdrawingStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_withdrawing_tx');
  }

  clickOnWithdraw() {
    const orbsStakingActionButton = within(this.txCreatingSubStepComponent).getByText('Withdraw');
    fireEvent.click(orbsStakingActionButton);
  }
}
