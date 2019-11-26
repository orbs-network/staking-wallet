/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { ConnectWalletPage } from '../../../pages/ConnectWalletPage';
import { EthereumProviderMock } from '../../mocks/EthereumProviderMock';
import { IEthereumTxService } from '../../../services/ethereumTxService/IEthereumTxService';
import { EthereumTxService } from '../../../services/ethereumTxService/EthereumTxService';
import { CryptoWalletIntegrationStore } from '../../../store/CryptoWalletIntegrationStore';
import { fireEvent, waitForElement, RenderResult } from '@testing-library/react';
import { IEthereumProvider } from '../../../services/ethereumTxService/IEthereumProvider';

const TEST_IDS = {
  connectMetamask: 'button-connect-metamask',
  installMetamask: 'button-install-metamask',

  pleaseRefreshPageMessage: 'text-pleaseRefresh',
  connectionWasNotApprovedMessage: 'text-connection-was-not-approved',
  alreadyConnected: 'text-alreadyConnectedToMetamask',
};

function renderWithMock(testDriver: ComponentTestDriver, ethereumProvider: IEthereumProvider): RenderResult {
  const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProvider);
  const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

  return testDriver.withStores({ cryptoWalletIntegrationStore }).render();
}

describe('Connect wallet page', () => {
  let testDriver: ComponentTestDriver;
  let ethereumProviderMock: EthereumProviderMock;

  beforeEach(() => {
    testDriver = new ComponentTestDriver(ConnectWalletPage);

    ethereumProviderMock = new EthereumProviderMock();
  });

  it(`Should display 'install metamask' button when there is no ethereum provider that opens an 'install metamask' tab`, async () => {
    const { getByTestId, queryByTestId } = renderWithMock(testDriver, undefined);

    window.open = jest.fn();

    // Has no ethereum provider - should offer to install metamask
    expect(queryByTestId(TEST_IDS.installMetamask)).toBeDefined();
    expect(queryByTestId(TEST_IDS.connectMetamask)).toBeNull();
    expect(getByTestId(TEST_IDS.installMetamask)).toHaveTextContent('Install Metamask');

    fireEvent.click(getByTestId(TEST_IDS.installMetamask));
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toBeCalledWith('https://metamask.io/', '_blank');
  });

  it(`Should display a 'please refresh page' message after user clicks on 'install metamask' `, async () => {
    const { getByTestId, queryByTestId } = renderWithMock(testDriver, undefined);

    expect(queryByTestId(TEST_IDS.installMetamask)).toBeDefined();
    fireEvent.click(getByTestId(TEST_IDS.installMetamask));

    await waitForElement(() => queryByTestId(TEST_IDS.pleaseRefreshPageMessage));

    expect(queryByTestId(TEST_IDS.pleaseRefreshPageMessage)).toBeInTheDocument();
    expect(queryByTestId(TEST_IDS.pleaseRefreshPageMessage)).toHaveTextContent(
      'Please refresh this page after installing Metamask',
    );
  });

  it(`Should display 'connect metamask' button when there is an ethereum provider but it is not connected that triggers a wallet-connect request`, async () => {
    ethereumProviderMock.setSelectedAddress(undefined);
    ethereumProviderMock.acceptNextEnable();

    const spy = jest.spyOn(ethereumProviderMock, 'enable');

    const { getByTestId, queryByTestId } = renderWithMock(testDriver, ethereumProviderMock);

    // Has ethereum provider but no wallet permissions - should offer to install metamask
    expect(queryByTestId(TEST_IDS.connectMetamask)).toBeDefined();
    expect(queryByTestId(TEST_IDS.installMetamask)).toBeNull();
    expect(getByTestId(TEST_IDS.connectMetamask)).toHaveTextContent('Connect your metamask');

    fireEvent.click(getByTestId(TEST_IDS.connectMetamask));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it(`Should display an error if user declined metamask connection.`, async () => {
    ethereumProviderMock.setSelectedAddress(undefined);
    ethereumProviderMock.rejectNextEnable();

    const { getByTestId, queryByTestId } = renderWithMock(testDriver, ethereumProviderMock);

    // Has ethereum provider but no wallet permissions - should offer to install metamask
    expect(queryByTestId(TEST_IDS.connectMetamask)).toBeDefined();
    fireEvent.click(getByTestId(TEST_IDS.connectMetamask));

    await waitForElement(() => queryByTestId(TEST_IDS.connectionWasNotApprovedMessage));
    expect(queryByTestId(TEST_IDS.connectionWasNotApprovedMessage)).toBeInTheDocument();
    expect(queryByTestId(TEST_IDS.connectionWasNotApprovedMessage)).toHaveTextContent(
      'Please approve',
    );
  });
});
