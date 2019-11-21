/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { CryptoWalletIntegrationStore } from '../../../store/CryptoWalletIntegrationStore';
import { Header } from '../../../components/Header';
import { IEthereumTxService } from '../../../services/ethereumTxService/IEthereumTxService';
import { EthereumTxService } from '../../../services/ethereumTxService/EthereumTxService';
import { App } from '../../../App';
import { HeaderTestDriver, IHeaderCustomDriver } from './HeaderTestDriver';

describe('Header Component', () => {
  let appTestDriver: ComponentTestDriver;
  let headerTestDriver: IHeaderCustomDriver;

  beforeEach(() => {
    appTestDriver = new ComponentTestDriver(App);
    headerTestDriver = new HeaderTestDriver();
  });

  it('Should not have an ethereum provider, and should offer to connect wallet', async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService();
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const renderResults = appTestDriver.withStores({ cryptoWalletIntegrationStore }).render();

    const {
      expectRegularLinksToExist,
      expectMyWalletLinksToNotExist,
      expectConnectWalletLinkToExist,
    } = headerTestDriver.buildTestFunctionsFromRenderResults(renderResults);

    // Display 'Connect Wallet'
    expectRegularLinksToExist();
    expectMyWalletLinksToNotExist();
    expectConnectWalletLinkToExist();
  });

  it('Should have an ethereum provider, but no user approval to connect wallet , and should offer to connect wallet', async () => {
    // DEV_NOTE: O.L:  We mimic an 'ethereum' provider on the 'window' object, we should consider passing this as a dependency.
    // @ts-ignore
    window.ethereum = {
      selectedAddress: null,
    };

    const ethereumTxService: IEthereumTxService = new EthereumTxService();
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const renderResults = appTestDriver.withStores({ cryptoWalletIntegrationStore }).render();

    const {
      expectRegularLinksToExist,
      expectMyWalletLinksToNotExist,
      expectConnectWalletLinkToExist,
    } = headerTestDriver.buildTestFunctionsFromRenderResults(renderResults);

    // Display 'Connect Wallet'
    expectRegularLinksToExist();
    expectMyWalletLinksToNotExist();
    expectConnectWalletLinkToExist();
  });

  it('Should have an ethereum provider, and should display "My Wallet" link', async () => {
    // DEV_NOTE: O.L:  We mimic an 'ethereum' provider on the 'window' object, we should consider passing this as a dependency.
    // @ts-ignore
    window.ethereum = {
      selectedAddress: '0xanyAddress',
    };

    const ethereumTxService: IEthereumTxService = new EthereumTxService();
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const renderResults = appTestDriver.withStores({ cryptoWalletIntegrationStore }).render();

    const {
      expectRegularLinksToExist,
      expectMyWalletLinksToExist,
      expectConnectWalletLinkToNotExist,
    } = headerTestDriver.buildTestFunctionsFromRenderResults(renderResults);

    // Display 'My Wallet'
    expectRegularLinksToExist();
    expectMyWalletLinksToExist();
    expectConnectWalletLinkToNotExist();
  });
});
