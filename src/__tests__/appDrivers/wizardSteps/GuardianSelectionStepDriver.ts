import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class GuardianSelectionStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_guardian_selection_tx');
  }

  public selectGuardian(guardianAddress: string) {
    const guardianSelectionActionButton = this.getGuardianSelectionActionButton(guardianAddress);

    fireEvent.click(guardianSelectionActionButton);
  }

  private getGuardianSelectionActionButton(guardianAddress: string) {
    return within(this.txCreatingSubStepComponent).getByTestId(`guardian-${guardianAddress}-select-action`);
  }
}
