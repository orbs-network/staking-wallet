/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { IGuardianInfo } from 'orbs-pos-data';
import { GuardiansSection } from '../../../sections/GuardiansSection';
import { GuardiansServiceMock, OrbsPOSDataServiceMock } from 'orbs-pos-data/dist/testkit';
import { GuardiansStore } from '../../../store/GuardiansStore';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { getByTestId as getByTestIdWithContainer } from '@testing-library/dom';

describe('Guardians Section', () => {
  let orbsPOSDataService: OrbsPOSDataServiceMock;
  let guardianService: GuardiansServiceMock;
  let testDriver: ComponentTestDriver;

  const guardian1Address = '0x0874BC1383958e2475dF73dC68C4F09658E23777';
  const guardian2Address = '0xf257EDE1CE68CA4b94e18eae5CB14942CBfF7D1C';
  const guardian3Address = '0xcB6172196BbCf5b4cf9949D7f2e4Ee802EF2b81D';

  const guardian1: IGuardianInfo = {
    name: 'Guardian 1',
    website: 'http://www.guardian1.com',
    hasEligibleVote: true,
    voted: true,
    stake: 0.2,
  };

  const guardian2: IGuardianInfo = {
    name: 'Guardian 2',
    website: 'http://www.guardian2.com',
    hasEligibleVote: false,
    voted: false,
    stake: 0.1,
  };

  const guardian3: IGuardianInfo = {
    name: 'Guardian 3',
    website: 'http://www.guardian3.com',
    hasEligibleVote: false,
    voted: true,
    stake: 0.3,
  };

  beforeEach(() => {
    testDriver = new ComponentTestDriver(GuardiansSection);
    orbsPOSDataService = new OrbsPOSDataServiceMock();
    guardianService = new GuardiansServiceMock();
  });

  it('should display all the given guardians', async () => {
    guardianService.withGuardian(guardian1Address, guardian1);
    guardianService.withGuardian(guardian2Address, guardian2);
    guardianService.withGuardian(guardian3Address, guardian3);

    const guardiansStore = new GuardiansStore(orbsPOSDataService, guardianService);

    await guardiansStore.init();

    const { getByTestId } = testDriver.withStores({ guardiansStore }).render();

    expect(getByTestId('guardians-table')).toBeDefined();
    expect(getByTestId('guardian-1')).toBeDefined();
    expect(getByTestId('guardian-2')).toBeDefined();
    expect(getByTestId('guardian-3')).toBeDefined();

    expect(getByTestId('guardian-1-name')).toHaveTextContent('Guardian 3');
    expect(getByTestId('guardian-2-name')).toHaveTextContent('Guardian 1');
    expect(getByTestId('guardian-3-name')).toHaveTextContent('Guardian 2');

    expect(getByTestId('guardian-1-address')).toHaveTextContent(guardian3Address);
    expect(getByTestId('guardian-2-address')).toHaveTextContent(guardian1Address);
    expect(getByTestId('guardian-3-address')).toHaveTextContent(guardian2Address);

    expect(getByTestId('guardian-1-website')).toHaveAttribute('href', 'http://www.guardian3.com');
    expect(getByTestId('guardian-2-website')).toHaveAttribute('href', 'http://www.guardian1.com');
    expect(getByTestId('guardian-3-website')).toHaveAttribute('href', 'http://www.guardian2.com');

    expect(getByTestId('guardian-1-stake')).toHaveTextContent('30.00%');
    expect(getByTestId('guardian-2-stake')).toHaveTextContent('20.00%');
    expect(getByTestId('guardian-3-stake')).toHaveTextContent('10.00%');

    expect(getByTestId('guardian-1-voted')).toHaveTextContent('Yes');
    expect(getByTestId('guardian-2-voted')).toHaveTextContent('Yes');
    expect(getByTestId('guardian-3-voted')).toHaveTextContent('No');
  });

  it('should display the total participating tokens', async () => {
    orbsPOSDataService.withTotalParticipatingTokens(BigInt(1_000_000));
    guardianService.withGuardian(guardian1Address, guardian1);
    guardianService.withGuardian(guardian2Address, guardian2);
    guardianService.withGuardian(guardian3Address, guardian3);

    const guardiansStore = new GuardiansStore(orbsPOSDataService, guardianService);

    await guardiansStore.init();

    const { getByTestId } = testDriver.withStores({ guardiansStore }).render();
    const guardiansSection = getByTestId('guardians-section');
    const sideTitle = getByTestIdWithContainer(guardiansSection, 'side-title');

    expect(sideTitle).toHaveTextContent('Participating stake: 1,000,000');
  });
});
