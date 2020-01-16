import { observable, action, reaction } from 'mobx';

import { IOrbsPOSDataService, IGuardianInfo, IGuardiansService } from 'orbs-pos-data';

export type TGuardianInfoExtended = IGuardianInfo & { address: string };

export interface IGuardiansStoreState {
  guardiansList: TGuardianInfoExtended[];
  totalParticipatingTokens: number;
}

export type TGuardiansStore = IGuardiansStoreState;

export class GuardiansStore implements TGuardiansStore {
  @observable public guardiansList: TGuardianInfoExtended[];
  @observable public totalParticipatingTokens: number;

  constructor(private orbsPOSDataService: IOrbsPOSDataService, private guardiansService: IGuardiansService) {
    this.guardiansList = [];
    this.totalParticipatingTokens = 0;
  }

  async init() {
    try {
      const totalParticipatingTokens = await this.orbsPOSDataService.getTotalParticipatingTokens();
      this.setTotalParticipatingTokens(totalParticipatingTokens);

      const guardiansAddresses = await this.guardiansService.getGuardiansList(0, 100);
      const promises = guardiansAddresses.map(guardianAddress =>
        this.guardiansService.getGuardianInfo(guardianAddress),
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

  @action('setTotalParticipatingTokens')
  private setTotalParticipatingTokens(totalParticipatingTokens: number) {
    this.totalParticipatingTokens = totalParticipatingTokens;
  }
}
