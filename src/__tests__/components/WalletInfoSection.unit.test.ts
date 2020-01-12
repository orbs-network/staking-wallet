/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import copyMock from 'copy-to-clipboard';
import { WalletInfoSection } from '../../sections/WalletInfoSection';
import { EthereumTxService } from '../../services/ethereumTxService/EthereumTxService';
import { IEthereumTxService } from '../../services/ethereumTxService/IEthereumTxService';
import { CryptoWalletIntegrationStore } from '../../store/CryptoWalletIntegrationStore';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';

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

describe('Wallet Info Section', () => {
  let testDriver: ComponentTestDriver;
  let ethereumProviderMock: EthereumProviderMock;
  let cryptoWalletIntegrationStore: CryptoWalletIntegrationStore;

  const testAddress = '0x0afdafad';

  // Fresh mock for 'copy-tp-clipboard'
  beforeEach(() => {
    (copyMock as jest.Mock).mockReset();
  });

  beforeEach(() => {
    testDriver = new ComponentTestDriver(WalletInfoSection);

    ethereumProviderMock = new EthereumProviderMock();
    // Any test case expects a connected wallet
    ethereumProviderMock.setSelectedAddress(testAddress);

    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);
  });

  it(`Should display the account info`, async () => {
    // Dev_Note : Wait for the store to and get the connected address.
    const { getByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();
    expect(getByTestId(TEST_IDS.activeAddress)).toHaveTextContent(testAddress);
  });

  it(`Should copy account address to clipboard + show message`, async () => {
    const { getByTestId, queryByTestId, queryByText } = testDriver
      .withStores({ cryptoWalletIntegrationStore })
      .render();

    const copyAddressButton = queryByText('Copy');
    expect(copyAddressButton).toBeInTheDocument();

    fireEvent.click(copyAddressButton);

    expect(queryByTestId(TEST_IDS.addressCopiedMessage)).toBeDefined();
    expect(getByTestId(TEST_IDS.addressCopiedMessage)).toHaveTextContent('Copied Address !');
    expect(getByTestId(TEST_IDS.activeAddress)).toHaveTextContent(testAddress);

    expect(copyMock).toBeCalledTimes(1);
    expect(copyMock).toBeCalledWith(testAddress);
  });

  // TODO : ORL : Not sure yet how to test this TDD
  it.skip(`Should create a valid QR code for the address`, async () => {
    return true;
  });
});
