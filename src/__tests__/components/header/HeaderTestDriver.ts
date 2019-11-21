/* eslint-disable @typescript-eslint/no-use-before-define */
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { Header, IHeaderProps } from '../../../components/Header';
import { RenderResult } from '@testing-library/react';

import 'jest-expect-message';
import { ICustomTestDriver } from '../../TestDriver';

interface IHeaderDriverTestFunctions {
  expectRegularLinksToExist: () => void;
  expectMyWalletLinksToExist: () => void;
  expectMyWalletLinksToNotExist: () => void;
  expectConnectWalletLinkToExist: () => void;
  expectConnectWalletLinkToNotExist: () => void;
}

export interface IHeaderCustomDriver extends ICustomTestDriver<IHeaderDriverTestFunctions> {
  setIsConnectedToWalletProp: (isConnected: boolean) => void;
}

const REGULAR_LINKS_TEST_IDS = ['menuLink-home', 'menuLink-guardians', 'menuLink-about'];

const WALLET_LINKS_TEST_IDS = ['menuLink-myWallet', 'menuLink-stakeOrbs'];

const CONNECT_WALLET_TEST_IDS = ['menuLink-connectWallet'];

export class HeaderTestDriver extends ComponentTestDriver<IHeaderProps> implements IHeaderCustomDriver {
  private readonly props: IHeaderProps = null;

  constructor() {
    super(Header);

    this.props = {
      isConnectedToWallet: false,
    };
  }

  public setIsConnectedToWalletProp(isConnected: boolean) {
    this.props.isConnectedToWallet = isConnected;
  }

  public buildTestFunctionsFromRenderResults(renderResult) {
    const driverTestFunctions: IHeaderDriverTestFunctions = {
      expectRegularLinksToExist: buildExpectToExist(renderResult, REGULAR_LINKS_TEST_IDS),

      expectMyWalletLinksToExist: buildExpectToExist(renderResult, WALLET_LINKS_TEST_IDS),
      expectMyWalletLinksToNotExist: buildExpectToNotExist(renderResult, WALLET_LINKS_TEST_IDS),

      expectConnectWalletLinkToExist: buildExpectToExist(renderResult, CONNECT_WALLET_TEST_IDS),
      expectConnectWalletLinkToNotExist: buildExpectToNotExist(renderResult, CONNECT_WALLET_TEST_IDS),
    };

    return driverTestFunctions;
  }

  public renderSpecificDriver(): { renderResult: RenderResult } & IHeaderDriverTestFunctions {
    super.withProps(this.props);
    const renderResult = super.render();

    const driverTestFunctions = this.buildTestFunctionsFromRenderResults(renderResult);

    return {
      renderResult,
      ...driverTestFunctions,
    };
  }
}

function buildExpectToExist({ queryByTestId }, testIds: string[]): () => void {
  return () => {
    for (const testId of testIds) {
      expect(queryByTestId(testId), `'${testId}' should not exist in the dom`).toBeDefined();
    }
  };
}

function buildExpectToNotExist({ queryByTestId }, testIds: string[]): () => void {
  return () => {
    for (const testId of testIds) {
      expect(queryByTestId(testId), `'${testId}' should not exist in the dom`).toBeNull();
    }
  };
}
