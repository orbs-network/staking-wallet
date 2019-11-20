/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import {
  ICryptoWalletIntegrationStoreState,
  TCryptoWalletIntegrationStore,
} from '../../../store/CryptoWalletIntegrationStore';
import { Header } from '../../../components/Header';
import { observable } from 'mobx';

describe('Header Component', () => {
  let cryptoWalletIntegrationStore: TCryptoWalletIntegrationStore;
  let testDriver: ComponentTestDriver;

  beforeEach(() => {
    cryptoWalletIntegrationStore = observable.object<ICryptoWalletIntegrationStoreState>({
      isConnectedToWallet: false,
    });

    testDriver = new ComponentTestDriver(Header);
  });

  it('Should display "my wallet" when a connected to wallet and "Connect Wallet" when not + reacting to store', async () => {
    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    // Display 'My Wallet'
    cryptoWalletIntegrationStore.isConnectedToWallet = true;
    expect(queryByTestId('menuLink-myWallet')).toBeDefined();
    expect(queryByTestId('menuLink-connectWallet')).toBeNull();
    expect(getByTestId('menuLink-myWallet')).toHaveTextContent('My Wallet');

    // Display 'Connect Wallet'
    cryptoWalletIntegrationStore.isConnectedToWallet = false;
    expect(queryByTestId('menuLink-connectWallet')).toBeDefined();
    expect(queryByTestId('menuLink-myWallet')).toBeNull();
    expect(getByTestId('menuLink-connectWallet')).toHaveTextContent('Connect Wallet');
  });
});
