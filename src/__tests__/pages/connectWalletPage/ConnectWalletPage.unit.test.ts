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
import { ConnectWalletPage } from '../../../pages/ConnectWalletPage';

const TEST_IDS = {
  connectMetamask: 'actionButton-connectMetamask',
  installMetamask: 'actionButton-installMetamask',
  alreadyConnected: 'text-alreadyConnectedToMetamask',
};

describe('Connect wallet page', () => {
  let cryptoWalletIntegrationStore: Partial<TCryptoWalletIntegrationStore>;
  let testDriver: ComponentTestDriver;

  beforeEach(() => {
    cryptoWalletIntegrationStore = observable.object<Partial<ICryptoWalletIntegrationStoreState>>({
      hasEthereumProvider: false,
      hasWalletPermissions: false,
      isConnectedToWallet: false,
    });

    testDriver = new ComponentTestDriver(ConnectWalletPage);
  });

  it(`Should differentiate between 'install metamask' and 'connect metamask' + mobx connection`, async () => {
    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    // Has no ethereum provider - should offer to install metamask
    cryptoWalletIntegrationStore.hasEthereumProvider = false;
    expect(queryByTestId(TEST_IDS.installMetamask)).toBeDefined();
    expect(queryByTestId(TEST_IDS.connectMetamask)).toBeNull();
    expect(getByTestId(TEST_IDS.installMetamask)).toHaveTextContent('Install Metamask');

    // Has ethereum provider but no wallet permissions - should offer to install metamask
    cryptoWalletIntegrationStore.hasEthereumProvider = true;
    cryptoWalletIntegrationStore.hasWalletPermissions = false;
    expect(queryByTestId(TEST_IDS.connectMetamask)).toBeDefined();
    expect(queryByTestId(TEST_IDS.installMetamask)).toBeNull();
    expect(getByTestId(TEST_IDS.connectMetamask)).toHaveTextContent('Connect your metamask');
  });

  it(`Should show a 'already connected' message and not action buttons if it has wallet connection`, async () => {
    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    cryptoWalletIntegrationStore.isConnectedToWallet = true;

    expect(queryByTestId(TEST_IDS.alreadyConnected)).toBeDefined();
    expect(queryByTestId(TEST_IDS.installMetamask)).toBeNull();
    expect(queryByTestId(TEST_IDS.connectMetamask)).toBeNull();

    expect(getByTestId(TEST_IDS.alreadyConnected)).toHaveTextContent('Already connected');
  });
});
