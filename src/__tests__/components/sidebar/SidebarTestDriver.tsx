/* eslint-disable @typescript-eslint/no-use-before-define */
import { render } from '@testing-library/react';
import 'jest-expect-message';
import React from 'react';
import { Sidebar, ISidebarProps } from '../../../components/nav/Sidebar';
import { BrowserRouter } from 'react-router-dom';

export class SidebarTestDriver {
  private readonly props: ISidebarProps = null;

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
    return {
      guardiansLink,
      connectWalletLink,
      myWalletLink,
    };
  }

  public connectedToWallet() {
    this.props.isConnectedToWallet = true;
    return this;
  }

  private renderHeader() {
    return render(
      <BrowserRouter>
        <Sidebar {...this.props} />
      </BrowserRouter>,
    );
  }
}
