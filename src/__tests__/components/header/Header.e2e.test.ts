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

describe('Header Component', () => {
  let testDriver: ComponentTestDriver;

  beforeEach(() => {
    testDriver = new ComponentTestDriver(Header);
  });

  it('Should not have an ethereum provider, and should offer to connect wallet', async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService();
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    // Display 'Connect Wallet'
    expect(queryByTestId('menuLink-connectWallet')).toBeDefined();
    expect(queryByTestId('menuLink-myWallet')).toBeNull();
    expect(getByTestId('menuLink-connectWallet')).toHaveTextContent('Connect Wallet');
  });

  it('Should have an ethereum provider, but no user approval to connect wallet , and should offer to connect wallet', async () => {
    // DEV_NOTE: O.L:  We mimic an 'ethereum' provider on the 'window' object, we should consider passing this as a dependency.
    // @ts-ignore
    window.ethereum = {
      selectedAddress: null,
    };

    const ethereumTxService: IEthereumTxService = new EthereumTxService();
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    // Display 'Connect Wallet'
    expect(queryByTestId('menuLink-connectWallet')).toBeDefined();
    expect(queryByTestId('menuLink-myWallet')).toBeNull();
    expect(getByTestId('menuLink-connectWallet')).toHaveTextContent('Connect Wallet');
  });

  it('Should have an ethereum provider, and should display "My Wallet" link', async () => {
    // DEV_NOTE: O.L:  We mimic an 'ethereum' provider on the 'window' object, we should consider passing this as a dependency.
    // @ts-ignore
    window.ethereum = {
      selectedAddress: '0xanyAddress',
    };

    const ethereumTxService: IEthereumTxService = new EthereumTxService();
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    // Display 'My Wallet'
    expect(queryByTestId('menuLink-myWallet')).toBeDefined();
    expect(queryByTestId('menuLink-connectWallet')).toBeNull();
    expect(getByTestId('menuLink-myWallet')).toHaveTextContent('My Wallet');
  });
});
