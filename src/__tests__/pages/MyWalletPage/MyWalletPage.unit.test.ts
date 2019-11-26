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
import { fireEvent, waitForElement } from '@testing-library/dom';

const TEST_IDS = {
  activeAddress: 'text-active-address',
  liquidOrbs: 'text-liquid-orbs',
  stakedOrbs: 'text-staked-orbs',
  totalRewards: 'text-total-rewards',

  walletNotConnectedMessage: 'text_wallet-not-connected',

  addressCopiedMessage: 'message-address-was-copied',
};

describe('My Wallet Page', () => {
  let testDriver: ComponentTestDriver;
  let ethereumProviderMock: EthereumProviderMock;

  beforeEach(() => {
    testDriver = new ComponentTestDriver(WalletPageWrapper);

    ethereumProviderMock = new EthereumProviderMock();
  });

  it(`Should show all account data`, async () => {
    const testAddress = '0x0afdafad';
    const liquidOrbs = 500_000;
    const stakedOrbs = 10_000;
    const accumulatedRewards = 7_030;

    ethereumProviderMock.setSelectedAddress(testAddress);

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

  it(`Should copy account address to clipboard + show message`, async () => {
    jest.mock('copy-to-clipboard');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const copy = require('copy-to-clipboard');

    const testAddress = '0x0afdafad';
    ethereumProviderMock.setSelectedAddress(testAddress);

    const ethereumTxService: IEthereumTxService = new EthereumTxService(undefined);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);
    const { getByTestId, queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();

    // TODO : ORL : Uncomment this  (this is commented only to make TDD quicker)
    // await waitForElement(() => queryByTestId(TEST_IDS.addressCopiedMessage));

    expect(queryByTestId(TEST_IDS.addressCopiedMessage)).toBeDefined();
    expect(getByTestId(TEST_IDS.addressCopiedMessage)).toHaveTextContent('Copied Address');

    expect(copy).toBeCalledTimes(1);
    expect(copy).toBeCalledWith(testAddress);
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
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { getByTestId, queryByTestId, queryByText } = testDriver
      .withStores({ cryptoWalletIntegrationStore })
      .render();

    const stakeTokensButton = queryByText('Stake your tokens');
    expect(stakeTokensButton).toBeInTheDocument();

    fireEvent.click(stakeTokensButton);

    expect(window.location.pathname).toBe('/stake-orbs');
  });

  it(`Should have a 'History' button that redirects to 'History' `, async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { getByTestId, queryByTestId, queryByText } = testDriver
      .withStores({ cryptoWalletIntegrationStore })
      .render();

    const rewardHistoryButton = queryByText('history');
    expect(rewardHistoryButton).toBeInTheDocument();

    fireEvent.click(rewardHistoryButton);

    expect(window.location.pathname).toBe('/rewards-history');
  });
});
