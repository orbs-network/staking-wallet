/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
// import '@testing-library/jest-dom/extend-expect';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { mock, when } from 'ts-mockito';
import { ICryptoWalletIntegrationStoreState } from '../../../store/CryptoWalletIntegrationStore';
import { Header } from '../../../components/Header';
import { observable } from 'mobx';

describe('Header Component', () => {
  let mockedCryptoWalletIntegrationStore = mock<ICryptoWalletIntegrationStoreState>();
  let testDriver: ComponentTestDriver;

  beforeEach(() => {
    mockedCryptoWalletIntegrationStore = observable.object<ICryptoWalletIntegrationStoreState>({
      isConnectedToWallet: false,
    });

    testDriver = new ComponentTestDriver(Header);
  });

  it('Should display "my wallet" when a metamask-ethereum provider exists', async () => {
    when(mockedCryptoWalletIntegrationStore.isConnectedToWallet).thenReturn(true);

    const { getByTestId } = testDriver
      .withStores({ cryptoWalletIntegrationStore: mockedCryptoWalletIntegrationStore })
      .render();

    expect(getByTestId('menuLink-myWallet')).toBeDefined();
    expect(getByTestId('menuLink-connectWallet')).not.toBeDefined();
  });
});
