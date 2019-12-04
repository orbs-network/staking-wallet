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
import { waitForElement, wait } from '@testing-library/dom';
import { OrbsPOSDataServiceMock } from 'orbs-pos-data/dist/testkit';
import { OrbsAccountStore } from '../../../store/OrbsAccountStore';
import { fireEvent } from '@testing-library/react';

const TEST_IDS = {
  activeAddress: 'text-active-address',
  liquidOrbs: 'text-liquid-orbs',
  stakedOrbs: 'text-staked-orbs',
  totalRewards: 'text-total-rewards',

  walletNotConnectedMessage: 'text_wallet-not-connected',

  addressCopiedMessage: 'message-address-was-copied',
};

// DEV_NOTE : The node_modules mock should occur outside of the 'describe' in order to take effect
jest.mock('copy-to-clipboard', () => jest.fn());
import copyMock from 'copy-to-clipboard';
import { DeepPartial } from 'utility-types';
import { IStores } from '../../../store/stores';

describe('My Wallet Page', () => {
  let storesForTests: DeepPartial<IStores> = {};
  let testDriver: ComponentTestDriver;
  let ethereumProviderMock: EthereumProviderMock;
  let orbsPOSDataServiceMock: OrbsPOSDataServiceMock;

  const testAddress = '0x0afdafad';

  // Fresh mock for 'copy-tp-clipboard'
  beforeEach(() => {
    (copyMock as jest.Mock).mockReset();
  });

  // Refresh test driver and other mocks
  beforeEach(() => {
    // Dev_Note : This store is not part of the tests, so we mock it with an empty object.
    storesForTests = {
      orbsAccountStore: {},
    };

    testDriver = new ComponentTestDriver(WalletPageWrapper);

    ethereumProviderMock = new EthereumProviderMock();

    orbsPOSDataServiceMock = new OrbsPOSDataServiceMock();

    // Any test case expects a connected wallet
    ethereumProviderMock.setSelectedAddress(testAddress);
  });

  it(`Should show all account data`, async () => {
    const liquidOrbs = 500_000;
    const stakedOrbs = 10_000;
    const accumulatedRewards = 7_030;

    orbsPOSDataServiceMock.withORBSBalance(testAddress, BigInt(liquidOrbs));

    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);
    storesForTests.cryptoWalletIntegrationStore = cryptoWalletIntegrationStore;
    storesForTests.orbsAccountStore = new OrbsAccountStore(cryptoWalletIntegrationStore, orbsPOSDataServiceMock);

    // Dev_Note : Wait for the store to and get the connected address.
    await wait(() => expect(storesForTests.cryptoWalletIntegrationStore.mainAddress).toBeDefined());

    const { getByTestId, queryByTestId } = testDriver.withStores(storesForTests).render();
    expect(queryByTestId(TEST_IDS.activeAddress)).toBeDefined();
    expect(queryByTestId(TEST_IDS.liquidOrbs)).toBeDefined();
    expect(queryByTestId(TEST_IDS.stakedOrbs)).toBeDefined();
    expect(queryByTestId(TEST_IDS.totalRewards)).toBeDefined();

    expect(getByTestId(TEST_IDS.activeAddress)).toHaveTextContent(testAddress);
    expect(getByTestId(TEST_IDS.liquidOrbs)).toHaveTextContent(`${liquidOrbs}`);
    expect(getByTestId(TEST_IDS.stakedOrbs)).toHaveTextContent(`${stakedOrbs}`);
    expect(getByTestId(TEST_IDS.totalRewards)).toHaveTextContent(`${accumulatedRewards}`);
  });

  it(`Should copy account address to clipboard + show message`, async () => {
    const testAddress = '0x0afdafad';
    ethereumProviderMock.setSelectedAddress(testAddress);

    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    storesForTests.cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);
    const { getByTestId, queryByTestId, queryByText } = testDriver.withStores(storesForTests).render();

    const copyAddressButton = queryByText('Copy');
    expect(copyAddressButton).toBeInTheDocument();

    // Dev_Note : Wait for the store to and get the connected address.
    await wait(() => expect(storesForTests.cryptoWalletIntegrationStore.mainAddress).toBeDefined());

    fireEvent.click(copyAddressButton);

    await waitForElement(() => queryByTestId(TEST_IDS.addressCopiedMessage));

    expect(queryByTestId(TEST_IDS.addressCopiedMessage)).toBeDefined();
    expect(getByTestId(TEST_IDS.addressCopiedMessage)).toHaveTextContent('Copied Address !');
    expect(getByTestId(TEST_IDS.activeAddress)).toHaveTextContent(testAddress);

    expect(copyMock).toBeCalledTimes(1);
    expect(copyMock).toBeCalledWith(testAddress);
  });

  // TODO : ORL : We need to decide where to save the user's email.
  it.skip(`Should allow setting of email`, async () => {
    return true;
  });

  // TODO : ORL : Not sure yet how to test this TDD
  it.skip(`Should create a valid QR code for the address`, async () => {
    return true;
  });

  // TODO : ORL : Not sure yet how to test this TDD
  it.skip(`Should create a valid QR code for the address`, async () => {
    return true;
  });

  // TODO : ORL : This does not seem to be currently available functionality via ethereum/metamask
  //  We need to decide what to do with this feature.
  it.skip(`Should have a 'logout' button that logs out`, async () => {
    return true;
  });

  it(`Should have a 'stake orbs' button that redirects to 'Stake Orbs' `, async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    storesForTests.cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { getByTestId, queryByTestId, queryByText } = testDriver.withStores(storesForTests).render();

    const stakeTokensButton = queryByText('Stake Your Tokens');
    expect(stakeTokensButton).toBeInTheDocument();

    fireEvent.click(stakeTokensButton);

    expect(window.location.pathname).toBe('/stake');
  });

  it(`Should have a 'History' button that redirects to 'History' `, async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    storesForTests.cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { queryByText } = testDriver.withStores(storesForTests).render();

    const rewardHistoryButton = queryByText('history');
    expect(rewardHistoryButton).toBeInTheDocument();

    fireEvent.click(rewardHistoryButton);

    expect(window.location.pathname).toBe('/rewards-history');
  });
});
