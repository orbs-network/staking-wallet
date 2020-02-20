/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import { waitForElement } from '@testing-library/react';
import { App } from '../../App';
import { CryptoWalletConnectionService } from '../../services/cryptoWalletConnectionService/CryptoWalletConnectionService';
import { ICryptoWalletConnectionService } from '../../services/cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { CryptoWalletConnectionStore } from '../../store/CryptoWalletConnectionStore';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';
import { GuardiansStore } from '../../store/GuardiansStore';
import {
  OrbsPOSDataServiceMock,
  StakingServiceMock,
  OrbsTokenServiceMock,
  GuardiansServiceMock,
} from 'orbs-pos-data/dist/testkit';
import { OrbsAccountStore } from '../../store/OrbsAccountStore';

describe('Wallet connection', () => {
  let appTestDriver: ComponentTestDriver;
  let ethereumProviderMock: EthereumProviderMock;
  let guardiansStore: GuardiansStore;
  let orbsAccountStore: OrbsAccountStore;
  let cryptoWalletIntegrationStore: CryptoWalletConnectionStore;

  beforeEach(() => {
    ethereumProviderMock = new EthereumProviderMock();
    const cryptoWalletConnectionService: ICryptoWalletConnectionService = new CryptoWalletConnectionService(
      ethereumProviderMock,
    );
    const orbsPOSDataServiceMock = new OrbsPOSDataServiceMock();
    const guardiansServiceMock = new GuardiansServiceMock();
    const stakingServiceMock = new StakingServiceMock();
    const orbsTokenService = new OrbsTokenServiceMock();

    cryptoWalletIntegrationStore = new CryptoWalletConnectionStore(cryptoWalletConnectionService);
    guardiansStore = new GuardiansStore(cryptoWalletIntegrationStore, orbsPOSDataServiceMock, guardiansServiceMock);
    orbsAccountStore = new OrbsAccountStore(
      cryptoWalletIntegrationStore,
      orbsPOSDataServiceMock,
      stakingServiceMock,
      orbsTokenService,
      guardiansServiceMock,
    );

    appTestDriver = new ComponentTestDriver(App);
  });

  it('Should show "Install Metamask" button when metamask is not installed', async () => {
    const cryptoWalletConnectionService: ICryptoWalletConnectionService = new CryptoWalletConnectionService(undefined);
    const cryptoWalletIntegrationStore = new CryptoWalletConnectionStore(cryptoWalletConnectionService);
    const { queryByTestId } = appTestDriver
      .withStores({ orbsAccountStore, cryptoWalletIntegrationStore, guardiansStore })
      .render();

    expect(queryByTestId('button-install-metamask')).toBeInTheDocument();
  });

  it('Should offer to connect wallet when Metamask is installed but not connected, and after connection is approved, display the "My Wallet" page', async () => {
    const { queryByTestId } = appTestDriver
      .withStores({ orbsAccountStore, cryptoWalletIntegrationStore, guardiansStore })
      .render();

    // Ensure we start with the 'Connect wallet page'
    expect(queryByTestId('connect-to-wallet-section')).toBeInTheDocument();

    // Ensure 'connect button' is displayed + Click.
    const connectButton = queryByTestId('button-connect-metamask');
    expect(connectButton).toBeInTheDocument();
    connectButton.click();

    await waitForElement(() => queryByTestId('wallet-information-sections'));

    expect(queryByTestId('wallet-information-sections')).toBeInTheDocument();
    expect(queryByTestId('connect-to-wallet-section')).not.toBeInTheDocument();
  });

  it('Should offer to connect wallet when Metamask is installed but not connected and after connection is NOT approved, stay in the "Connect wallet page"', async () => {
    ethereumProviderMock.rejectNextEnable();

    const { queryByTestId } = appTestDriver
      .withStores({ orbsAccountStore, cryptoWalletIntegrationStore, guardiansStore })
      .render();

    // Ensure we start with the 'Connect wallet page'
    expect(queryByTestId('connect-to-wallet-section')).toBeInTheDocument();
    expect(queryByTestId('text-connection-was-not-approved')).not.toBeInTheDocument();

    // Ensure 'connect button' is displayed + Click.
    const connectButton = queryByTestId('button-connect-metamask');
    expect(connectButton).toBeInTheDocument();
    connectButton.click();

    await waitForElement(() => queryByTestId('text-connection-was-not-approved'));

    expect(queryByTestId('wallet-information-sections')).not.toBeInTheDocument();
    expect(queryByTestId('connect-to-wallet-section')).toBeInTheDocument();
  });
});
