import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class GuardianChangeStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_guardian_change_tx');
  }

  public clickOnChangeGuardian() {
    const button = this.guardianChangeButton;
    fireEvent.click(button);
  }

  private get guardianChangeButton() {
    return within(this.txCreatingSubStepComponent).getByText('Change');
  }
}
