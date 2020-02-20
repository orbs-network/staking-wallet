import { ApprovableStepDriver } from './ApprovableStepDriver';
import { fireEvent, RenderResult, within } from '@testing-library/react';

export class OrbsRestakingStepDriver extends ApprovableStepDriver {
  constructor(renderResults: RenderResult) {
    super(renderResults, 'wizard_sub_step_initiate_restaking_tx');
  }

  clickOnWRestake() {
    const orbsStakingActionButton = within(this.txCreatingSubStepComponent).getByText('Restake');
    fireEvent.click(orbsStakingActionButton);
  }
}
