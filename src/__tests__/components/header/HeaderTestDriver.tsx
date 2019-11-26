/* eslint-disable @typescript-eslint/no-use-before-define */
import { render } from '@testing-library/react';
import 'jest-expect-message';
import React from 'react';
import { Header, IHeaderProps } from '../../../components/Header';
import { BrowserRouter } from 'react-router-dom';

export class HeaderTestDriver {
  private readonly props: IHeaderProps = null;

  constructor() {
    this.props = {
      isConnectedToWallet: false,
    };
  }

  public render() {
    const renderResult = this.renderHeader();
    const { queryByTestId } = renderResult;
    const guardiansLink = queryByTestId('menuLink-guardians');
    const connectWalletLink = queryByTestId('menuLink-connectWallet');
    const myWalletLink = queryByTestId('menuLink-myWallet');
    const stakeOrbsLink = queryByTestId('menuLink-stakeOrbs');
    return {
      guardiansLink,
      connectWalletLink,
      myWalletLink,
      stakeOrbsLink,
    };
  }

  public connectedToWallet() {
    this.props.isConnectedToWallet = true;
    return this;
  }

  private renderHeader() {
    return render(
      <BrowserRouter>
        <Header {...this.props} />
      </BrowserRouter>,
    );
  }
}
