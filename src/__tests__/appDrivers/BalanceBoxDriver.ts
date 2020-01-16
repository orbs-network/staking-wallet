import { RenderResult, within, fireEvent } from '@testing-library/react';

export class BalanceBoxDriver {
  constructor(protected renderResults: RenderResult, private balanceBoxTestId: string) {}

  public clickOnActionButton() {
    const actionButton = within(this.balanceBoxComponent).getByRole('button');

    fireEvent.click(actionButton);
  }

  public get balanceText() {
    const balanceTextComponent = within(this.balanceBoxComponent).getByTestId('balance_text');

    return balanceTextComponent.textContent;
  }

  private get balanceBoxComponent() {
    return this.renderResults.getByTestId(this.balanceBoxTestId);
  }
}