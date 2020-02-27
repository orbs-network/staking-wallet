import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class OrbsAllowanceStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_allowance_tx');
  }

  setAmountForAllowanceAndStaking(allowanceInOrbs: number) {
    fireEvent.change(this.orbsForAllowanceInput, { target: { value: allowanceInOrbs.toString() } });
  }

  clickOnAllow() {
    const setOrbsAllowanceButton = within(this.txCreatingSubStepComponent).getByText('Approve');
    fireEvent.click(setOrbsAllowanceButton);
  }

  public get orbsForAllowanceInput() {
    return within(this.txCreatingSubStepComponent).getByLabelText('Allowance');
  }
}
