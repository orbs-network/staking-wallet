/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { IGuardianInfo } from 'orbs-pos-data';
import { ComponentTestDriver } from '../../ComponentTestDriver';
import { Guardians } from '../../../components/Guardians';
import { TGuardiansStore } from '../../../store/GuardiansStore';
import { action, observable } from 'mobx';

describe('Guardians Component', () => {
  let testDriver: ComponentTestDriver;
  let guardiansStore: Partial<TGuardiansStore>;

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

  const guardian4: IGuardianInfo = {
    name: 'Guardian 4',
    website: 'http://www.guardian4.com',
    hasEligibleVote: false,
    voted: true,
    stake: 0.15,
  };

  beforeEach(() => {
    testDriver = new ComponentTestDriver(Guardians);

    guardiansStore = observable.object<Partial<TGuardiansStore>>({
      guardiansList: [],
    });
  });

  it('should display all the given guardians', async () => {
    // guardiansStore.guardiansList = observable([guardian1, guardian2, guardian3]);
    guardiansStore.guardiansList = [guardian1, guardian2, guardian3];

    const { getByTestId } = testDriver.withStores({ guardiansStore }).render();

    // DEV_NOTE : O.L : We need to remember that guardians will be sorted by their stake (descending).
    //            and so, the first one to be displayed will be the one with the most stake.
    const guardiansByExpectedOrder = [guardian3, guardian1, guardian2];

    expect(getByTestId('guardians-table')).toBeDefined();
    expect(getByTestId('guardian-1')).toBeDefined();
    expect(getByTestId('guardian-2')).toBeDefined();
    expect(getByTestId('guardian-3')).toBeDefined();

    expect(getByTestId('guardian-1-name')).toHaveTextContent(guardiansByExpectedOrder[0].name);
    expect(getByTestId('guardian-2-name')).toHaveTextContent(guardiansByExpectedOrder[1].name);
    expect(getByTestId('guardian-3-name')).toHaveTextContent(guardiansByExpectedOrder[2].name);

    expect(getByTestId('guardian-1-website')).toHaveTextContent(guardiansByExpectedOrder[0].website);
    expect(getByTestId('guardian-2-website')).toHaveTextContent(guardiansByExpectedOrder[1].website);
    expect(getByTestId('guardian-3-website')).toHaveTextContent(guardiansByExpectedOrder[2].website);

    expect(getByTestId('guardian-1-stake')).toHaveTextContent((guardiansByExpectedOrder[0].stake * 100).toString());
    expect(getByTestId('guardian-2-stake')).toHaveTextContent((guardiansByExpectedOrder[1].stake * 100).toString());
    expect(getByTestId('guardian-3-stake')).toHaveTextContent((guardiansByExpectedOrder[2].stake * 100).toString());

    expect(getByTestId('guardian-1-voted')).toHaveTextContent(guardiansByExpectedOrder[0].voted.toString());
    expect(getByTestId('guardian-2-voted')).toHaveTextContent(guardiansByExpectedOrder[1].voted.toString());
    expect(getByTestId('guardian-3-voted')).toHaveTextContent(guardiansByExpectedOrder[2].voted.toString());

    // Testing for reaction to observable (this is the 3rd highest stake)
    const addGuardian = action(() => (guardiansStore.guardiansList = [...guardiansByExpectedOrder, guardian4]));
    addGuardian();

    expect(getByTestId('guardian-4')).toBeDefined();
    expect(getByTestId('guardian-3-name')).toHaveTextContent(guardian4.name);
    expect(getByTestId('guardian-3-website')).toHaveTextContent(guardian4.website);
    expect(getByTestId('guardian-3-stake')).toHaveTextContent((guardian4.stake * 100).toString());
    expect(getByTestId('guardian-3-voted')).toHaveTextContent(guardian4.voted.toString());
  });
});
