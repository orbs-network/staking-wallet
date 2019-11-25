/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { WalletPageWrapper } from '../../../pages/WalletPageWrapper';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { CryptoWalletIntegrationStore } from '../../../store/CryptoWalletIntegrationStore';
import { EthereumProviderMock } from '../../mocks/EthereumProviderMock';
import { IEthereumTxService } from '../../../services/ethereumTxService/IEthereumTxService';
import { EthereumTxService } from '../../../services/ethereumTxService/EthereumTxService';

describe.only('Wallet Page Wrapper Component', () => {
  let testDriver: ComponentTestDriver;
  let ethereumProviderMock: EthereumProviderMock;

  beforeEach(() => {
    testDriver = new ComponentTestDriver(WalletPageWrapper);

    ethereumProviderMock = new EthereumProviderMock();
  });

  it('Should ask the user to connect metamask when the wallet (Metamask) is not connected', async () => {
    const ethereumTxService: IEthereumTxService = new EthereumTxService(undefined);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();
    expect(queryByTestId('page-connect-to-wallet')).toBeInTheDocument();
    expect(queryByTestId('page-my-wallet')).not.toBeInTheDocument();
  });

  it('Should show the user wallet when connected', async () => {
    ethereumProviderMock.selectedAddress = '0x0afdafad'; // Mocking a connected wallet
    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    const cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);

    const { queryByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore }).render();
    expect(queryByTestId('page-connect-to-wallet')).not.toBeInTheDocument();
    expect(queryByTestId('page-my-wallet')).toBeInTheDocument();
  });
});
