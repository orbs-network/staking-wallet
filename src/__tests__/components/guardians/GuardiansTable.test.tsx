/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { GuardiansTable } from '../../../components/GuardiansTable';
import { TGuardianInfoExtended } from '../../../store/GuardiansStore';
import { ComponentTestDriver } from '../../ComponentTestDriver';

describe('Guardians Table Component', () => {
  let testDriver: ComponentTestDriver;

  const guardian1: TGuardianInfoExtended = {
    address: '0x1111111111111111111111111111111111111111',
    name: 'Guardian 1',
    website: 'http://www.guardian1.com',
    hasEligibleVote: true,
    voted: true,
    stake: 0.2,
  };

  const guardian2: TGuardianInfoExtended = {
    address: '0x2222222222222222222222222222222222222222',
    name: 'Guardian 2',
    website: 'http://www.guardian2.com',
    hasEligibleVote: false,
    voted: false,
    stake: 0.1,
  };

  const guardian3: TGuardianInfoExtended = {
    address: '0x3333333333333333333333333333333333333333',
    name: 'Guardian 3',
    website: 'http://www.guardian3.com',
    hasEligibleVote: false,
    voted: true,
    stake: 0.3,
  };

  const guardian4: TGuardianInfoExtended = {
    address: '0x4444444444444444444444444444444444444444',
    name: 'Guardian 4',
    website: 'http://www.guardian4.com',
    hasEligibleVote: false,
    voted: true,
    stake: 0.01,
  };

  beforeEach(() => {
    testDriver = new ComponentTestDriver(GuardiansTable);
  });

  it('should display all the given guardians', async () => {
    const guardians = [guardian1, guardian2, guardian3, guardian4];

    const { getByTestId } = testDriver.withProps({ guardians, totalParticipatingTokens: 1_000_000 }).render();

    expect(getByTestId('guardians-table')).toBeDefined();
    expect(getByTestId('guardian-1')).toBeDefined();
    expect(getByTestId('guardian-2')).toBeDefined();
    expect(getByTestId('guardian-3')).toBeDefined();
    expect(getByTestId('guardian-4')).toBeDefined();

    expect(getByTestId('guardian-1-name')).toHaveTextContent('Guardian 3');
    expect(getByTestId('guardian-2-name')).toHaveTextContent('Guardian 1');
    expect(getByTestId('guardian-3-name')).toHaveTextContent('Guardian 2');
    expect(getByTestId('guardian-4-name')).toHaveTextContent('Guardian 4');

    expect(getByTestId('guardian-1-address')).toHaveTextContent('0x3333333333333333333333333333333333333333');
    expect(getByTestId('guardian-2-address')).toHaveTextContent('0x1111111111111111111111111111111111111111');
    expect(getByTestId('guardian-3-address')).toHaveTextContent('0x2222222222222222222222222222222222222222');
    expect(getByTestId('guardian-4-address')).toHaveTextContent('0x4444444444444444444444444444444444444444');

    expect(getByTestId('guardian-1-website')).toHaveAttribute('href', 'http://www.guardian3.com');
    expect(getByTestId('guardian-2-website')).toHaveAttribute('href', 'http://www.guardian1.com');
    expect(getByTestId('guardian-3-website')).toHaveAttribute('href', 'http://www.guardian2.com');
    expect(getByTestId('guardian-4-website')).toHaveAttribute('href', 'http://www.guardian4.com');

    expect(getByTestId('guardian-1-stake')).toHaveTextContent('30.00%');
    expect(getByTestId('guardian-2-stake')).toHaveTextContent('20.00%');
    expect(getByTestId('guardian-3-stake')).toHaveTextContent('10.00%');
    expect(getByTestId('guardian-4-stake')).toHaveTextContent('1.00%');

    expect(getByTestId('guardian-1-voted')).toHaveTextContent('Yes');
    expect(getByTestId('guardian-2-voted')).toHaveTextContent('Yes');
    expect(getByTestId('guardian-3-voted')).toHaveTextContent('No');
    expect(getByTestId('guardian-4-voted')).toHaveTextContent('Yes');
  });

  it('should have an external link to the guardians website', async () => {
    const guardians = [
      {
        address: '0x123',
        name: 'Guardian',
        website: 'www.guardian.com',
        hasEligibleVote: true,
        voted: true,
        stake: 1,
      },
    ];

    const { getByTestId } = testDriver.withProps({ guardians, totalParticipatingTokens: 1_000_000 }).render();

    expect(getByTestId('guardian-1-website')).toHaveAttribute('href', 'http://www.guardian.com');
    expect(getByTestId('guardian-1-website')).toHaveAttribute('target', '_blank');
  });

  it('should display the "Select" guardian table', async () => {
    const guardians = [guardian1, guardian2, guardian3, guardian4];

    const { getByTestId } = testDriver
      .withProps({ guardians, totalParticipatingTokens: 1_000_000, onGuardianSelect: () => {} })
      .render();

    expect(getByTestId('guardians-table')).toBeDefined();
    expect(getByTestId('guardian-1')).toBeDefined();
    expect(getByTestId('guardian-1-select-button')).toHaveTextContent('Select');
  });

  it('should NOT display the "Select" guardian table', async () => {
    const guardians = [guardian1, guardian2, guardian3, guardian4];

    const { getByTestId, queryByTestId } = testDriver
      .withProps({ guardians, totalParticipatingTokens: 1_000_000 })
      .render();

    expect(getByTestId('guardians-table')).toBeDefined();
    expect(getByTestId('guardian-1')).toBeDefined();
    expect(queryByTestId('guardian-1-select-button')).toBeNull();
  });

  it('should call onGuardianSelect when a guardian was selected', async () => {
    const guardians = [guardian1, guardian2, guardian3, guardian4];
    const spy = jest.fn();

    const { getByTestId } = testDriver
      .withProps({ guardians, totalParticipatingTokens: 1_000_000, onGuardianSelect: spy })
      .render();

    const selectButton = getByTestId('guardian-1-select-button');
    selectButton.click();
    expect(spy).toHaveBeenCalledWith(guardian3); // guardian3 is the first guardian
  });
});
