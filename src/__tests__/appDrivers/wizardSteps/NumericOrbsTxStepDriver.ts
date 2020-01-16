import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class NumericOrbsTxStepDriver extends ApprovableStepDriver {
  constructor(
    renderResults: RenderResult,
    txCreatingSubStepTestId: string,
    private inputLabel: string,
    private actionButtonTitle: string,
  ) {
    super(renderResults, txCreatingSubStepTestId);
  }

  setInputAmount(amountInOrbs: number) {
    fireEvent.change(this.orbsAmountInput, { target: { value: amountInOrbs.toString() } });
  }

  clickOnActionButton() {
    const orbsStakingActionButton = within(this.txCreatingSubStepComponent).getByText(this.actionButtonTitle);
    fireEvent.click(orbsStakingActionButton);
  }

  public get orbsAmountInput() {
    return within(this.txCreatingSubStepComponent).getByLabelText(this.inputLabel);
  }
}
