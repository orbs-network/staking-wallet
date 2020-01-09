import { observable, action, reaction } from 'mobx';

import { IOrbsPOSDataService, IGuardianInfo } from 'orbs-pos-data';

export type TGuardianInfoExtended = IGuardianInfo & { address: string };

export interface IGuardiansStoreState {
  guardiansList: TGuardianInfoExtended[];
}

export const defaultPosStoreState: IGuardiansStoreState = {
  guardiansList: [],
};

export type TGuardiansStore = IGuardiansStoreState;

export class GuardiansStore implements TGuardiansStore {
  @observable public guardiansList: TGuardianInfoExtended[];

  constructor(private orbsPOSDataService: IOrbsPOSDataService) {
    this.guardiansList = [];
  }

  async init() {
    try {
      const guardiansAddresses = await this.orbsPOSDataService.getGuardiansList(0, 100);
      const promises = guardiansAddresses.map(guardianAddress =>
        this.orbsPOSDataService.getGuardianInfo(guardianAddress),
      );
      const guardiansInfo = await Promise.all(promises);
      const guardiansInfoExtended = guardiansInfo.map((g, idx) => ({ ...g, address: guardiansAddresses[idx] }));
      this.setGuardiansList(guardiansInfoExtended);
    } catch (e) {
      console.log(e);
    }
  }

  @action('setGuardiansList')
  private setGuardiansList(guardians: TGuardianInfoExtended[]) {
    this.guardiansList = guardians;
  }
}
