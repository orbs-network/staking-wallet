import { RenderResult, within, fireEvent } from '@testing-library/react';

export class BalanceCardDriver {
  constructor(protected renderResults: RenderResult, private balanceCardTestId: string) {}

  public clickOnActionButton() {
    const actionButton = within(this.balanceCardComponent).getByRole('button');
    fireEvent.click(actionButton);
  }

  public get balanceText() {
    const balanceTextComponent = within(this.balanceCardComponent).getByTestId('balance_text');

    return balanceTextComponent.textContent;
  }

  private get balanceCardComponent() {
    return this.renderResults.getByTestId(this.balanceCardTestId);
  }
}