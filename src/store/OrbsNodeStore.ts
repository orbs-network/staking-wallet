// DEV_NOTE : This store will keep all data that is read from an orbs node.

import { IOrbsNodeService } from '../services/v2/orbsNodeService/IOrbsNodeService';
import { action, computed, observable } from 'mobx';
import { Guardian, Model } from '../services/v2/orbsNodeService/model';
import { ICommitteeMemberData } from '../services/v2/orbsNodeService/OrbsNodeTypes';

export class OrbsNodeStore {
  @observable public doneLoading = false;
  @observable public errorLoading = false;
  @observable public model: Model = new Model();
  @observable public committeeMembers: ICommitteeMemberData[] = [];

  @computed public get committeeGuardians(): Guardian[] {
    return Object.values(this.model.CommitteeNodes);
  }

  @computed public get nonCommitteeGuardians(): Guardian[] {
    return Object.values(this.model.StandByNodes);
  }

  @computed public get guardians(): Guardian[] {
    return [...this.committeeGuardians, ...this.nonCommitteeGuardians];
  }

  /**
   * Returns all addresses in lower case.
   */
  @computed public get guardiansAddresses(): string[] {
    return this.guardians.map((guardian) => guardian.EthAddress.toLowerCase());
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

  @computed public get currentGuardiansAnnualRewardsInterest(): number {
    const committeeStake = this.committeeEffectiveStake;

    // TODO : ORL : Fix this calculation after speaking with Oded
    const maxInterestForGuardians = 12;
    const percentageFromMax = (80_000_000 / committeeStake) * 100;

    const rewardsInterest = Math.min(maxInterestForGuardians, percentageFromMax);

    return rewardsInterest;
  }

  @computed public get currentDelegatorsAnnualRewardsInterest(): number {
    const ratioFromGuardians = 2 / 3;
    const currentInterest = ratioFromGuardians * this.currentGuardiansAnnualRewardsInterest;

    return +currentInterest.toFixed(2);
  }

  constructor(private orbsNodeService: IOrbsNodeService) {
    this.readAllData();
  }

  private async readAllData() {
    this.setDoneLoading(false);
    this.setErrorLoading(false);
    try {
      const isDefaulNodeAtSync = await this.orbsNodeService.checkIfDefaultNodeIsInSync();

      const { model, committeeMembers } = await this.orbsNodeService.readAndProcessModel();
      this.setModel(model);
      this.setCommitteeMemberData(committeeMembers);
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

  @action('setCommitteeMemberData')
  private setCommitteeMemberData(committeeMembers: ICommitteeMemberData[]) {
    this.committeeMembers = committeeMembers;
  }
}
