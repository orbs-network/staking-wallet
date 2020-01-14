import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class OrbsAllowanceStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults);
  }

  setAmountForAllowance(allowanceInOrbs: number) {
    fireEvent.change(this.orbsForAllowanceInput, { target: { value: allowanceInOrbs.toString() } });
  }

  clickOnAllow() {
    const setOrbsAllowanceButton = within(this.orbsAllowanceSubStepComponent).getByText('Allow');
    fireEvent.click(setOrbsAllowanceButton);
  }

  public get orbsForAllowanceInput() {
    return within(this.orbsAllowanceSubStepComponent).getByLabelText('Allowance');
  }

  public get orbsAllowanceSubStepComponent() {
    const { getByTestId } = this.renderResults;

    return getByTestId('wizard_sub_step_select_amount_for_allowance');
  }
}
