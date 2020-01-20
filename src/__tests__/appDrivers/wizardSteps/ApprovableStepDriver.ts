import { RenderResult, within, fireEvent } from '@testing-library/react';

export class ApprovableStepDriver {
  constructor(protected renderResults: RenderResult, private txCreatingSubStepTestId: string) {}

  public get txConfirmationLinkHref() {
    return within(this.txConformationSubStepComponent)
      .getByRole('link')
      .getAttribute('href');
  }

  clickOnProceedAfterTxVerified(): void {
    fireEvent.click(this.queryProceedButton);
  }

  public get queryProceedButton() {
    return within(this.txConformationSubStepComponent).queryByRole('button');
  }

  clickOnFinishApprovableStep(): void {
    const finishButton = within(this.congratulationsSubStepComponent).getByRole('button');
    fireEvent.click(finishButton);
  }

  public get txCreatingSubStepComponent() {
    const { getByTestId } = this.renderResults;

    return getByTestId(this.txCreatingSubStepTestId);
  }

  public get txConformationSubStepComponent() {
    const { getByTestId } = this.renderResults;

    const subStep = getByTestId('wizard_sub_step_wait_for_tx_confirmation');

    return subStep;
  }

  public get congratulationsSubStepComponent() {
    const { getByTestId } = this.renderResults;

    return getByTestId('wizard_sub_step_congratulations');
  }
}
