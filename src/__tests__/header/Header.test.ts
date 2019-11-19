/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
// import '@testing-library/jest-dom/extend-expect';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { mock, when } from 'ts-mockito';
import { ICryptoWalletIntegrationStoreState } from '../../store/CryptoWalletIntegrationStore';
import { Header } from '../../components/Header';

describe('Header Component', () => {
  let mockedCryptoWalletIntegrationStore = mock<ICryptoWalletIntegrationStoreState>();
  let testDriver: ComponentTestDriver;

  beforeEach(() => {
    mockedCryptoWalletIntegrationStore = mock<ICryptoWalletIntegrationStoreState>();
    testDriver = new ComponentTestDriver(Header);
  });

  it('Should display "my wallet" when a metamask-ethereum provider exists', async () => {
    when(mockedCryptoWalletIntegrationStore.isConnectedToWallet).thenReturn(true);

    const { getByTestId } = testDriver
      .withStores({ cryptoWalletIntegrationStore: mockedCryptoWalletIntegrationStore })
      .render();

    expect(getByTestId('menuLink-myWallet')).toBeDefined();
    expect(getByTestId('menuLink-connectWallet')).not.toBeDefined();

    // await wait(() => getByTestId('guardians-table'));
    // expect(getByTestId('guardians-table')).toBeDefined();
    // expect(getByTestId('guardian-1')).toBeDefined();
    // expect(getByTestId('guardian-2')).toBeDefined();
    // expect(getByTestId('guardian-3')).toBeDefined();
    //
    // expect(getByTestId('guardian-1-name')).toHaveTextContent('Guardian 1');
    // expect(getByTestId('guardian-2-name')).toHaveTextContent('Guardian 2');
    // expect(getByTestId('guardian-3-name')).toHaveTextContent('Guardian 3');
    //
    // expect(getByTestId('guardian-1-website')).toHaveTextContent('http://www.guardian1.com');
    // expect(getByTestId('guardian-2-website')).toHaveTextContent('http://www.guardian2.com');
    // expect(getByTestId('guardian-3-website')).toHaveTextContent('http://www.guardian3.com');
    //
    // expect(getByTestId('guardian-1-stake')).toHaveTextContent('10.00%');
    // expect(getByTestId('guardian-2-stake')).toHaveTextContent('20.00%');
    // expect(getByTestId('guardian-3-stake')).toHaveTextContent('30.00%');
    //
    // expect(getByTestId('guardian-1-voted')).toHaveTextContent('true');
    // expect(getByTestId('guardian-2-voted')).toHaveTextContent('false');
    // expect(getByTestId('guardian-3-voted')).toHaveTextContent('true');
  });
});
