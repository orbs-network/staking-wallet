/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { wait } from '@testing-library/react';
import { App } from '../../App';
import { EthereumTxService } from '../../services/ethereumTxService/EthereumTxService';
import { IEthereumTxService } from '../../services/ethereumTxService/IEthereumTxService';
import { CryptoWalletIntegrationStore } from '../../store/CryptoWalletIntegrationStore';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';
import { IEthereumProvider } from '../../services/ethereumTxService/IEthereumProvider';

describe('Wallet connection', () => {
  let appTestDriver: ComponentTestDriver;

  beforeEach(() => {
    appTestDriver = new ComponentTestDriver(App);
  });

  it('Should show "Install Metamask" button when metamask is not installed', async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(undefined);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { queryByTestId } = appTestDriver.withStores({ cryptoWalletIntegrationStore }).render();

    expect(queryByTestId('install-metamask-button')).toBeInTheDocument();
  });

  it('Should offer to connect wallet when Metamask is installed but not connected, and after connection is approved, display the "My Wallet" page', async () => {
    const ethereumProviderMock: IEthereumProvider = new EthereumProviderMock();
    ethereumProviderMock.selectedAddress = undefined;
    ethereumProviderMock.enable = async () => null; // Approves the connect request

    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { queryByTestId } = appTestDriver.withStores({ cryptoWalletIntegrationStore }).render();

    // Ensure we start with the 'Connect wallet page'
    expect(queryByTestId('page-connect-to-wallet')).toBeInTheDocument();

    // Ensure 'connect button' is displayed + Click.
    const connectButton = queryByTestId('connect-to-metamask-button');
    expect(connectButton).toBeInTheDocument();
    connectButton.click();

    // Wait a tick to allow async actions to have effects on the UI.
    await wait();
    expect(queryByTestId('page-my-wallet')).toBeInTheDocument();
    expect(queryByTestId('page-connect-to-wallet')).not.toBeInTheDocument();
  });

  it('Should offer to connect wallet when Metamask is installed but not connected and after connection is NOT approved, stay in the "Connect wallet page"', async () => {
    const ethereumProviderMock: IEthereumProvider = new EthereumProviderMock();
    ethereumProviderMock.selectedAddress = undefined;

    // ethereumProviderMock.enable = async () => null; // Approves the connect request

    ethereumProviderMock.enable = async () => {
      throw new Error('Test error');
    }; // Approves the connect request

    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { queryByTestId } = appTestDriver.withStores({ cryptoWalletIntegrationStore }).render();

    // Ensure we start with the 'Connect wallet page'
    expect(queryByTestId('page-connect-to-wallet')).toBeInTheDocument();

    // Ensure 'connect button' is displayed + Click.
    const connectButton = queryByTestId('connect-to-metamask-button');
    expect(connectButton).toBeInTheDocument();
    connectButton.click();

    // Wait a tick to allow async actions to have effects on the UI.
    await wait();
    expect(queryByTestId('page-my-wallet')).not.toBeInTheDocument();
    expect(queryByTestId('page-connect-to-wallet')).toBeInTheDocument();
  });

  // it.skip('Should have an ethereum provider, but no user approval to connect wallet , and should offer to connect wallet', async () => {
  //   // DEV_NOTE: O.L:  We mimic an 'ethereum' provider on the 'window' object, we should consider passing this as a dependency.
  //   // @ts-ignore
  //   window.ethereum = {
  //     selectedAddress: null,
  //   };

  //   const ethereumTxService: IEthereumTxService = new EthereumTxService();
  //   const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

  //   const renderResults = appTestDriver.withStores({ cryptoWalletIntegrationStore }).render();

  //   const {
  //     expectRegularLinksToExist,
  //     expectMyWalletLinksToNotExist,
  //     expectConnectWalletLinkToExist,
  //   } = headerTestDriver.buildTestFunctionsFromRenderResults(renderResults);

  //   // Display 'Connect Wallet'
  //   expectRegularLinksToExist();
  //   expectMyWalletLinksToNotExist();
  //   expectConnectWalletLinkToExist();
  // });

  // it('Should have an ethereum provider, and should display "My Wallet" link', async () => {
  //   // DEV_NOTE: O.L:  We mimic an 'ethereum' provider on the 'window' object, we should consider passing this as a dependency.
  //   // @ts-ignore
  //   window.ethereum = {
  //     selectedAddress: '0xanyAddress',
  //   };

  //   const ethereumTxService: IEthereumTxService = new EthereumTxService();
  //   const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

  //   const renderResults = appTestDriver.withStores({ cryptoWalletIntegrationStore }).render();

  //   const {
  //     expectRegularLinksToExist,
  //     expectMyWalletLinksToExist,
  //     expectConnectWalletLinkToNotExist,
  //   } = headerTestDriver.buildTestFunctionsFromRenderResults(renderResults);

  //   // Display 'My Wallet'
  //   expectRegularLinksToExist();
  //   expectMyWalletLinksToExist();
  //   expectConnectWalletLinkToNotExist();
  // });
});
