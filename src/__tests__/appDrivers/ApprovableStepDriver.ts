import { RenderResult, within, fireEvent } from '@testing-library/react';

export interface IApprovableStepDriver {
  // Tx Approval sub step
  clickOnProceedAfterTxVerified(): void;
}

export class ApprovableStepDriver implements IApprovableStepDriver {
  constructor(protected renderResults: RenderResult) {
  }

  clickOnProceedAfterTxVerified(): void {
    const proceedButton = within(this.txConformationSubStep).getByText('Proceed');
    fireEvent.click(proceedButton);
  }

  clickOnFinishApprovableStep(): void {
    const finishButton = within(this.congratulationsSubStep).getByRole('button');
    fireEvent.click(finishButton);
  }

  protected get txConformationSubStep() {
    const { getByTestId } = this.renderResults;

    const subStep = getByTestId('wizard_sub_step_wait_for_tx_confirmation');

    return subStep;
  }

  protected get congratulationsSubStep() {
    const { getByTestId } = this.renderResults;

    return getByTestId('wizard_sub_step_congratulations');
  }
}