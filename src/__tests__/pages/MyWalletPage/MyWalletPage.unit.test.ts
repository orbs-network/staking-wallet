/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { EthereumProviderMock } from '../../mocks/EthereumProviderMock';
import { WalletPageWrapper } from '../../../pages/WalletPageWrapper';
import { IEthereumTxService } from '../../../services/ethereumTxService/IEthereumTxService';
import { EthereumTxService } from '../../../services/ethereumTxService/EthereumTxService';
import { CryptoWalletIntegrationStore } from '../../../store/CryptoWalletIntegrationStore';

const TEST_IDS = {
  activeAddress: 'text-active-address',
  liquidOrbs: 'text-liquid-orbs',
  stakedOrbs: 'text-staked-orbs',
  totalRewards: 'text-total-rewards',

  walletNotConnectedMessage: 'text_wallet-not-connected',
};

describe('My Wallet Page', () => {
  let testDriver: ComponentTestDriver;
  let ethereumProviderMock: EthereumProviderMock;

  beforeEach(() => {
    testDriver = new ComponentTestDriver(WalletPageWrapper);

    ethereumProviderMock = new EthereumProviderMock();
  });

  it(`Should show all account data`, async () => {
    const testAddress = '';
    const liquidOrbs = 500_000;
    const stakedOrbs = 10_000;
    const accumulatedRewards = 7_030;

    ethereumProviderMock.setSelectedAddress('0x0afdafad');

    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    expect(queryByTestId(TEST_IDS.activeAddress)).toBeDefined();
    expect(queryByTestId(TEST_IDS.liquidOrbs)).toBeDefined();
    expect(queryByTestId(TEST_IDS.stakedOrbs)).toBeDefined();
    expect(queryByTestId(TEST_IDS.totalRewards)).toBeDefined();

    expect(getByTestId(TEST_IDS.activeAddress)).toHaveTextContent(testAddress);
    expect(getByTestId(TEST_IDS.liquidOrbs)).toHaveTextContent(`${liquidOrbs}`);
    expect(getByTestId(TEST_IDS.stakedOrbs)).toHaveTextContent(`${stakedOrbs}`);
    expect(getByTestId(TEST_IDS.totalRewards)).toHaveTextContent(`${accumulatedRewards}`);
  });

  it.skip(`Should show an error message if wallet is not connected`, async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(undefined);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);
    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    expect(queryByTestId(TEST_IDS.walletNotConnectedMessage)).toBeDefined();
    expect(getByTestId(TEST_IDS.walletNotConnectedMessage)).toHaveTextContent('Wallet not connected');
  });
});
