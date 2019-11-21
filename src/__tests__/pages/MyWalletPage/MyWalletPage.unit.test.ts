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
  activeAddress: 'text_activeAddress',
  liquidOrbs: 'text_liquidOrbs',
  stakedOrbs: 'text_stakedOrbs',
  totalRewards: 'text_totalRewards',

  walletNotConnectedMessage: 'text_walletNotConnected',
};

describe('Header Component', () => {
  let cryptoWalletIntegrationStore: Partial<TCryptoWalletIntegrationStore>;
  let testDriver: ComponentTestDriver;

  beforeEach(() => {
    cryptoWalletIntegrationStore = observable.object<Partial<ICryptoWalletIntegrationStoreState>>({});

    testDriver = new ComponentTestDriver(ConnectWalletPage);
  });

  it(`Should show all account data`, async () => {
    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    expect(queryByTestId(TEST_IDS.activeAddress)).toBeDefined();
    expect(queryByTestId(TEST_IDS.liquidOrbs)).toBeDefined();
    expect(queryByTestId(TEST_IDS.stakedOrbs)).toBeDefined();
    expect(queryByTestId(TEST_IDS.totalRewards)).toBeDefined();

    expect(getByTestId(TEST_IDS.activeAddress)).toHaveTextContent('');
    expect(getByTestId(TEST_IDS.liquidOrbs)).toHaveTextContent('');
    expect(getByTestId(TEST_IDS.stakedOrbs)).toHaveTextContent('');
    expect(getByTestId(TEST_IDS.totalRewards)).toHaveTextContent('');
  });

  it(`Should show an error message if wallet is not connected`, async () => {
    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    expect(queryByTestId(TEST_IDS.walletNotConnectedMessage)).toBeDefined();
    expect(getByTestId(TEST_IDS.walletNotConnectedMessage)).toHaveTextContent('Wallet not connected');
  });
});
