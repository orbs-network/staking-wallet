/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { render } from '@testing-library/react';
import { Provider } from 'mobx-react';
import { IOrbsPOSDataService } from 'orbs-pos-data';
import { OrbsPOSDataServiceMock } from 'orbs-pos-data/dist/testkit';
import React from 'react';
import { Guardians } from '../components/Guardians';

export class GuardiansListDriver {
  private orbsPOSDataService: IOrbsPOSDataService;

  withPODDataService(orbsPOSDataService: IOrbsPOSDataService): this {
    this.orbsPOSDataService = orbsPOSDataService;
    return this;
  }

  public render() {
    const orbsPOSDataService = this.orbsPOSDataService || new OrbsPOSDataServiceMock();

    return render(
      <Provider orbsPOSDataService={orbsPOSDataService}>
        <Guardians />
      </Provider>,
    );
  }
}
