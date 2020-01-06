import { observable, action, reaction } from 'mobx';

import { IOrbsPOSDataService, IGuardianInfo } from 'orbs-pos-data';

export interface IGuardiansStoreState {
  guardiansAddresses: string[];
  guardiansList: IGuardianInfo[];
}

export const defaultPosStoreState: IGuardiansStoreState = {
  guardiansAddresses: [],
  guardiansList: [],
};

export type TGuardiansStore = IGuardiansStoreState;

export class GuardiansStore implements TGuardiansStore {
  @observable public guardiansAddresses: string[];
  @observable public guardiansList: IGuardianInfo[];

  constructor(private orbsPOSDataService: IOrbsPOSDataService) {
    this.guardiansAddresses = [];
    this.guardiansList = [];

    const reactionOne = reaction(
      () => this.guardiansAddresses,
      async guardiansAddresses => {
        const promises = guardiansAddresses.map(guardianAddress =>
          this.orbsPOSDataService.getGuardianInfo(guardianAddress),
        );
        this.setGuardiansList(await Promise.all(promises));
      },
    );
  }

  async init() {
    try {
      const guardiansAddresses = await this.orbsPOSDataService.getGuardiansList(0, 100);
      console.log('guardiansAddresses', guardiansAddresses);
      this.setGuardiansAddresses(guardiansAddresses);
    } catch (e) {
      console.log(e);
    }
  }

  @action('setGuardiansAddresses')
  private setGuardiansAddresses(addresses: string[]) {
    this.guardiansAddresses = addresses;
  }

  @action('setGuardiansList')
  private setGuardiansList(guardians: IGuardianInfo[]) {
    this.guardiansList = guardians;
  }
}
