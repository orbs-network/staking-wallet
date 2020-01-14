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
    const setOrbsAllowanceButton = within(this.orbsAllowanceSubStep).getByText('Allow');
    fireEvent.click(setOrbsAllowanceButton);
  }

  public get orbsForAllowanceInput() {
    return within(this.orbsAllowanceSubStep).getByLabelText('Allowance');
  }

  private get orbsAllowanceSubStep() {
    const { getByTestId } = this.renderResults;

    return getByTestId('wizard_sub_step_select_amount_for_allowance');
  }
}
