/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { waitForDomChange } from '@testing-library/react';
import {
  GuardiansServiceMock,
  OrbsPOSDataServiceMock,
  OrbsTokenServiceMock,
  StakingServiceMock,
} from 'orbs-pos-data/dist/testkit';
import { BalancesSection } from '../../sections/BalancesSection';
import { CryptoWalletConnectionService } from '../../services/cryptoWalletConnectionService/CryptoWalletConnectionService';
import { ICryptoWalletConnectionService } from '../../services/cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { CryptoWalletConnectionStore } from '../../store/CryptoWalletConnectionStore';
import { OrbsAccountStore } from '../../store/OrbsAccountStore';
import { ComponentTestDriver } from '../ComponentTestDriver';
import { EthereumProviderMock } from '../mocks/EthereumProviderMock';
import { BalanceCardDriver } from '../appDrivers/BalanceCardDriver';
import { weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';

describe('Balances Section', () => {
  let testDriver: ComponentTestDriver;
  let orbsPOSDataServiceMock: OrbsPOSDataServiceMock;
  let stakingService: StakingServiceMock;
  let orbsTokenService: OrbsTokenServiceMock;
  let guardiansServiceMock: GuardiansServiceMock;
  let cryptoWalletIntegrationStore: CryptoWalletConnectionStore;
  let orbsAccountStore: OrbsAccountStore;

  const testAddress = '0x0afdafad';

  beforeEach(() => {
    testDriver = new ComponentTestDriver(BalancesSection);

    const ethereumProviderMock = new EthereumProviderMock();
    ethereumProviderMock.setSelectedAddress(testAddress);
    orbsPOSDataServiceMock = new OrbsPOSDataServiceMock();

    const cryptoWalletConnectionService: ICryptoWalletConnectionService = new CryptoWalletConnectionService(
      ethereumProviderMock,
    );
    stakingService = new StakingServiceMock();
    orbsTokenService = new OrbsTokenServiceMock();
    guardiansServiceMock = new GuardiansServiceMock();
    cryptoWalletIntegrationStore = new CryptoWalletConnectionStore(cryptoWalletConnectionService);
  });

  it(`Should show all account data from initial data + react to changes`, async () => {
    const initialUnstakedOrbs = 4000;
    const initialStakedOrbs = 15000;
    const initialCooldownOrbs = 8000;

    // Set initial data
    orbsPOSDataServiceMock.withORBSBalance(testAddress, weiOrbsFromFullOrbs(initialUnstakedOrbs));
    stakingService.withStakeBalance(testAddress, weiOrbsFromFullOrbs(initialStakedOrbs));
    stakingService.withUnstakeStatus(testAddress, {
      cooldownAmount: weiOrbsFromFullOrbs(initialCooldownOrbs),
      cooldownEndTime: 0, // Does not matter for the amounts test
    });

    orbsAccountStore = new OrbsAccountStore(
      cryptoWalletIntegrationStore,
      orbsPOSDataServiceMock,
      stakingService,
      orbsTokenService,
      guardiansServiceMock,
    );

    const renderResults = testDriver.withStores({ cryptoWalletIntegrationStore, orbsAccountStore }).render();
    const liquidOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_liquid_orbs');
    const stakedOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_staked_orbs');
    const cooldownOrbsBalanceCard = new BalanceCardDriver(renderResults, 'balance_card_cool_down_orbs');

    // Wait for the DOM to update with the store data for the first time
    await waitForDomChange();

    expect(liquidOrbsBalanceCard.balanceText).toBe('4,000');
    expect(stakedOrbsBalanceCard.balanceText).toBe('15,000');
    expect(cooldownOrbsBalanceCard.balanceText).toBe('8,000');

    // Ensure proper values after unstake
    await stakingService.unstake(weiOrbsFromFullOrbs(5000));
    expect(stakedOrbsBalanceCard.balanceText).toBe('10,000');
    expect(cooldownOrbsBalanceCard.balanceText).toBe('13,000');

    // Ensure proper values after stake
    // DEV_NOTE : For now we need to manually fire the 'orbs balance change' event.
    await stakingService.stake(weiOrbsFromFullOrbs(3000));
    orbsPOSDataServiceMock.fireORBSBalanceChange(weiOrbsFromFullOrbs(1000));
    expect(liquidOrbsBalanceCard.balanceText).toBe('1,000');
    expect(stakedOrbsBalanceCard.balanceText).toBe('13,000');
  });
});
