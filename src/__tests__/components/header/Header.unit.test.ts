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
import { HeaderTestDriver, IHeaderCustomDriver } from './HeaderTestDriver';

describe('Header Component', () => {
  let headerTestDriver: IHeaderCustomDriver = new HeaderTestDriver();

  beforeEach(() => {
    headerTestDriver = new HeaderTestDriver();
  });

  it('Should display regular links + only "my wallet" and "stake orbs" when connected to a wallet', async () => {
    headerTestDriver.setIsConnectedToWalletProp(true);

    const {
      expectRegularLinksToExist,
      expectMyWalletLinksToExist,
      expectConnectWalletLinkToNotExist,
    } = headerTestDriver.renderSpecificDriver();

    expectRegularLinksToExist();
    expectMyWalletLinksToExist();
    expectConnectWalletLinkToNotExist();
  });

  // it.skip('Should display regular links + only "Connect to wallet" when not connected to a wallet', async () => {
  //   const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();
  //
  //   // Display 'Connect Wallet'
  //   cryptoWalletIntegrationStore.isConnectedToWallet = false;
  //   expect(queryByTestId('menuLink-connectWallet')).toBeDefined();
  //   expect(queryByTestId('menuLink-myWallet')).toBeNull();
  //   expect(queryByTestId('menuLink-stakeOrbs')).toBeNull();
  //
  //   expect(getByTestId('menuLink-connectWallet')).toHaveTextContent('Connect Wallet');
  // });
  //
  // it.skip('Should display "my wallet" when a connected to wallet and "Connect Wallet" when not + reacting to store', async () => {
  //   const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();
  //
  //   // Display 'My Wallet', 'Stake Orbs'
  //   cryptoWalletIntegrationStore.isConnectedToWallet = true;
  //   expect(queryByTestId('menuLink-myWallet')).toBeDefined();
  //   expect(queryByTestId('menuLink-stakeOrbs')).toBeDefined();
  //   expect(queryByTestId('menuLink-connectWallet')).toBeNull();
  //   expect(getByTestId('menuLink-myWallet')).toHaveTextContent('My Wallet');
  //   expect(getByTestId('menuLink-stakeOrbs')).toHaveTextContent('Stake ORBS');
  //
  //   // Display 'Connect Wallet'
  //   cryptoWalletIntegrationStore.isConnectedToWallet = false;
  //   expect(queryByTestId('menuLink-connectWallet')).toBeDefined();
  //   expect(queryByTestId('menuLink-myWallet')).toBeNull();
  //   expect(queryByTestId('menuLink-stakeOrbs')).toBeNull();
  //   expect(getByTestId('menuLink-connectWallet')).toHaveTextContent('Connect Wallet');
  // });
});
