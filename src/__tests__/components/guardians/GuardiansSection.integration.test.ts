/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import { GuardiansSection } from '../../../sections/GuardiansSection';
import {
  GuardiansServiceMock,
  OrbsPOSDataServiceMock,
  OrbsTokenServiceMock,
  StakingServiceMock,
} from 'orbs-pos-data/dist/testkit';
import { GuardiansStore, TGuardianInfoExtended } from '../../../store/GuardiansStore';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { getByTestId as getByTestIdWithContainer } from '@testing-library/dom';
import { CryptoWalletConnectionService } from '../../../services/cryptoWalletConnectionService/CryptoWalletConnectionService';
import { EthereumProviderMock } from '../../mocks/EthereumProviderMock';
import { CryptoWalletConnectionStore } from '../../../store/CryptoWalletConnectionStore';
import { weiOrbsFromFullOrbs } from '../../../cryptoUtils/unitConverter';
import {
  guardianAddressTestId,
  guardianNameTestId,
  guardianRowTestId,
  guardianStakeTestId,
  guardianVotedTestId,
  guardianWebsiteTestId,
} from './guardiansTestUtils';
import { OrbsAccountStore } from '../../../store/OrbsAccountStore';
import { OrbsTokenService } from 'orbs-pos-data';

describe('Guardians Section', () => {
  let orbsPOSDataService: OrbsPOSDataServiceMock;
  let guardianService: GuardiansServiceMock;
  let cryptoWalletConnectionStore: CryptoWalletConnectionStore;
  let orbsAccountStore: OrbsAccountStore;
  let testDriver: ComponentTestDriver;

  const guardian1Address = '0x0874BC1383958e2475dF73dC68C4F09658E23777';
  const guardian2Address = '0xf257EDE1CE68CA4b94e18eae5CB14942CBfF7D1C';
  const guardian3Address = '0xcB6172196BbCf5b4cf9949D7f2e4Ee802EF2b81D';

  const guardian1: TGuardianInfoExtended = {
    address: guardian1Address,
    name: 'Guardian 1',
    website: 'http://www.guardian1.com',
    hasEligibleVote: true,
    voted: true,
    stakePercent: 0.2,
  };

  const guardian2: TGuardianInfoExtended = {
    address: guardian2Address,
    name: 'Guardian 2',
    website: 'http://www.guardian2.com',
    hasEligibleVote: false,
    voted: false,
    stakePercent: 0.1,
  };

  const guardian3: TGuardianInfoExtended = {
    address: guardian3Address,
    name: 'Guardian 3',
    website: 'http://www.guardian3.com',
    hasEligibleVote: false,
    voted: true,
    stakePercent: 0.3,
  };

  beforeEach(async () => {
    const ethereumProviderMock = new EthereumProviderMock();
    const cryptoWalletConnectionService = new CryptoWalletConnectionService(ethereumProviderMock);
    const stakingServiceMock = new StakingServiceMock();
    const orbsTokenServiceMoc = new OrbsTokenServiceMock();

    cryptoWalletConnectionStore = new CryptoWalletConnectionStore(cryptoWalletConnectionService);
    orbsPOSDataService = new OrbsPOSDataServiceMock();
    guardianService = new GuardiansServiceMock();
    orbsAccountStore = new OrbsAccountStore(
      cryptoWalletConnectionStore,
      orbsPOSDataService,
      stakingServiceMock,
      orbsTokenServiceMoc,
      guardianService,
    );

    testDriver = new ComponentTestDriver(GuardiansSection);

    orbsPOSDataService.withTotalParticipatingTokens(weiOrbsFromFullOrbs(1_000_000));
  });

  it('should display all the given guardians', async () => {
    guardianService.withGuardian(guardian1Address, guardian1);
    guardianService.withGuardian(guardian2Address, guardian2);
    guardianService.withGuardian(guardian3Address, guardian3);

    const guardiansStore = new GuardiansStore(cryptoWalletConnectionStore, orbsPOSDataService, guardianService);

    await guardiansStore.init();

    const { getByTestId } = testDriver.withStores({ guardiansStore, orbsAccountStore }).render();

    expect(getByTestId('guardians-table')).toBeDefined();
    expect(getByTestId(guardianRowTestId(guardian1))).toBeDefined();
    expect(getByTestId(guardianRowTestId(guardian2))).toBeDefined();
    expect(getByTestId(guardianRowTestId(guardian3))).toBeDefined();

    expect(getByTestId(guardianNameTestId(guardian1))).toHaveTextContent('Guardian 1');
    expect(getByTestId(guardianNameTestId(guardian2))).toHaveTextContent('Guardian 2');
    expect(getByTestId(guardianNameTestId(guardian3))).toHaveTextContent('Guardian 3');

    expect(getByTestId(guardianAddressTestId(guardian1))).toHaveTextContent(guardian1Address);
    expect(getByTestId(guardianAddressTestId(guardian2))).toHaveTextContent(guardian2Address);
    expect(getByTestId(guardianAddressTestId(guardian3))).toHaveTextContent(guardian3Address);

    expect(getByTestId(guardianWebsiteTestId(guardian1))).toHaveAttribute('href', 'http://www.guardian1.com');
    expect(getByTestId(guardianWebsiteTestId(guardian2))).toHaveAttribute('href', 'http://www.guardian2.com');
    expect(getByTestId(guardianWebsiteTestId(guardian3))).toHaveAttribute('href', 'http://www.guardian3.com');

    expect(getByTestId(guardianStakeTestId(guardian1))).toHaveTextContent('20.00%');
    expect(getByTestId(guardianStakeTestId(guardian2))).toHaveTextContent('10.00%');
    expect(getByTestId(guardianStakeTestId(guardian3))).toHaveTextContent('30.00%');

    expect(getByTestId(guardianVotedTestId(guardian1))).toHaveTextContent('Yes');
    expect(getByTestId(guardianVotedTestId(guardian2))).toHaveTextContent('No');
    expect(getByTestId(guardianVotedTestId(guardian3))).toHaveTextContent('Yes');
  });

  it('should display the total participating tokens', async () => {
    guardianService.withGuardian(guardian1Address, guardian1);
    guardianService.withGuardian(guardian2Address, guardian2);
    guardianService.withGuardian(guardian3Address, guardian3);

    const guardiansStore = new GuardiansStore(cryptoWalletConnectionStore, orbsPOSDataService, guardianService);

    await guardiansStore.init();

    const { getByTestId } = testDriver.withStores({ guardiansStore, orbsAccountStore }).render();
    const guardiansSection = getByTestId('guardians-section');
    const sideTitle = getByTestIdWithContainer(guardiansSection, 'side-title');

    expect(sideTitle).toHaveTextContent('Participating stake: 1,000,000');
  });
});
