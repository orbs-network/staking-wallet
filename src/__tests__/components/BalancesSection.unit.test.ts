/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { OrbsPOSDataServiceMock, OrbsTokenServiceMock, StakingServiceMock } from 'orbs-pos-data/dist/testkit';
import { BalancesSection } from '../../sections/BalancesSection';
import { EthereumTxService } from '../../services/ethereumTxService/EthereumTxService';
import { IEthereumTxService } from '../../services/ethereumTxService/IEthereumTxService';
import { CryptoWalletIntegrationStore } from '../../store/CryptoWalletIntegrationStore';
import { OrbsAccountStore } from '../../store/OrbsAccountStore';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';

describe('Balances Section', () => {
  let testDriver: ComponentTestDriver;
  let orbsPOSDataServiceMock: OrbsPOSDataServiceMock;
  let cryptoWalletIntegrationStore: CryptoWalletIntegrationStore;
  let orbsAccountStore: OrbsAccountStore;

  const testAddress = '0x0afdafad';

  beforeEach(() => {
    testDriver = new ComponentTestDriver(BalancesSection);

    const ethereumProviderMock = new EthereumProviderMock();
    ethereumProviderMock.setSelectedAddress(testAddress);
    orbsPOSDataServiceMock = new OrbsPOSDataServiceMock();

    const ethereumTxService: IEthereumTxService = new EthereumTxService(ethereumProviderMock);
    const stakingService = new StakingServiceMock();
    const orbsTokenService = new OrbsTokenServiceMock();
    cryptoWalletIntegrationStore = new CryptoWalletIntegrationStore(ethereumTxService);
    orbsAccountStore = new OrbsAccountStore(
      cryptoWalletIntegrationStore,
      orbsPOSDataServiceMock,
      stakingService,
      orbsTokenService,
    );
  });

  it(`Should show all account data`, async () => {
    const { getByTestId } = testDriver.withStores({ cryptoWalletIntegrationStore, orbsAccountStore }).render();
    expect(getByTestId('amount_liquid_orbs')).toHaveTextContent('0');

    orbsPOSDataServiceMock.fireORBSBalanceChange('500000');
    expect(getByTestId('amount_liquid_orbs')).toHaveTextContent('500,000');

    // TODO: implement withStakedORBS and withORBSInCooldown on orbsPOSDataServiceMock
    // expect(getByTestId('amount_staked_orbs')).toHaveTextContent('10,000');
    // expect(getByTestId('amount_cool_down_orbs')).toHaveTextContent('7,030');
  });
});
