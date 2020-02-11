import { RenderResult, within, fireEvent } from '@testing-library/react';
import {
  guardianRowTestIdFromAddress,
  selectActionButtonTestId,
  selectActionButtonTestIdFromAddress,
} from '../components/guardians/guardiansTestUtils';
import { TGuardianInfoExtended } from '../../store/GuardiansStore';

export class GuardiansTableDriver {
  constructor(protected renderResults: RenderResult, private guardiansTableTestId: string) {}

  public clickOnActionButtonForGuardian(guardianAddress: string) {
    const actionButton = this.getGuardianActionButton(guardianAddress);
    fireEvent.click(actionButton);
  }

  public isGuardianSelected(guardianAddress: string): boolean {
    const actionButton = this.getGuardianActionButton(guardianAddress);
    const selectedGuardianIcon = within(actionButton).queryByTestId('selected-guardian-icon');

    const guardianIsSelected = !!selectedGuardianIcon || actionButton.innerText === 'Selected';

    return guardianIsSelected;
  }

  private get guardiansTableComponent() {
    return this.renderResults.getByTestId(this.guardiansTableTestId);
  }

  private getGuardianRow(address: string) {
    return within(this.guardiansTableComponent).getByTestId(guardianRowTestIdFromAddress(address));
  }

  private getGuardianActionButton(guardianAddress: string) {
    const actionButtonTestId = selectActionButtonTestIdFromAddress(guardianAddress);
    return within(this.getGuardianRow(guardianAddress)).queryByTestId(actionButtonTestId);
  }
}
