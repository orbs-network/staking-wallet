// DEV_NOTE : This store will keep all data that is read from an orbs node.

import { IOrbsNodeService } from '../services/v2/orbsNodeService/IOrbsNodeService';
import { action, computed, observable } from 'mobx';
import { Guardian, Model } from '../services/v2/orbsNodeService/model';

export class OrbsNodeStore {
  @observable public doneLoading = false;
  @observable public errorLoading = false;
  @observable public model: Model = new Model();

  @computed public get committeeGuardians(): Guardian[] {
    return Object.values(this.model.CommitteeNodes);
  }

  @computed public get nonCommitteeGuardians(): Guardian[] {
    return Object.values(this.model.StandByNodes);
  }

  @computed public get guardians(): Guardian[] {
    return [...this.committeeGuardians, ...this.nonCommitteeGuardians];
  }

  @computed public get committeeEffectiveStake(): number {
    const committeeEffectiveStake = this.committeeGuardians.reduce((sum, committeeGuardian) => {
      return sum + committeeGuardian.EffectiveStake;
    }, 0);

    return committeeEffectiveStake;
  }

  @computed public get totalStake(): number {
    const totalStake = this.guardians.reduce((sum, committeeGuardian) => {
      return sum + committeeGuardian.EffectiveStake;
    }, 0);

    return totalStake;
  }

  constructor(private orbsNodeService: IOrbsNodeService) {
    this.readAllData();
  }

  private async readAllData() {
    this.setDoneLoading(false);
    this.setErrorLoading(false);
    try {
      const model = await this.orbsNodeService.readAndProcessModel();
      this.setModel(model);
      this.setDoneLoading(true);
    } catch (e) {
      this.setErrorLoading(true);
    }
  }

  // ****  Observables setter actions ****
  @action('setDoneLoading')
  private setDoneLoading(doneLoading: boolean) {
    this.doneLoading = doneLoading;
  }

  @action('setErrorLoading')
  private setErrorLoading(errorLoading: boolean) {
    this.errorLoading = errorLoading;
  }

  @action('setModel')
  private setModel(model: Model) {
    this.model = model;
  }
}
