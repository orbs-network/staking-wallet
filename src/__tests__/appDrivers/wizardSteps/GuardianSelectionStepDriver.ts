import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';
import { GuardiansTableDriver } from '../GuardiansTableDriver';

export class GuardianSelectionStepDriver extends ApprovableStepDriver {
  private guardianTableDriver: GuardiansTableDriver;

  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_guardian_selection_tx');
    this.guardianTableDriver = new GuardiansTableDriver(renderResults, 'guardian_selection_sub_step_guardians_table');
  }

  public selectGuardian(guardianAddress: string) {
    return this.guardianTableDriver.clickOnActionButtonForGuardian(guardianAddress);
  }

  private getGuardianSelectionActionButton(guardianAddress: string) {
    return within(this.txCreatingSubStepComponent).getByTestId(`guardian-${guardianAddress}-select-action`);
  }
}
