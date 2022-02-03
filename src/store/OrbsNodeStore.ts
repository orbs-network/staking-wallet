import { IElectionsService } from '@orbs-network/contracts-js';
// DEV_NOTE : This store will keep all data that is read from an orbs node.

import { IOrbsNodeService } from '../services/v2/orbsNodeService/IOrbsNodeService';
import { action, computed, observable, toJS } from 'mobx';
import { Guardian } from '../services/v2/orbsNodeService/systemState';
import {
  ICommitteeMemberData,
  IGuardiansDictionary,
  IReadAndProcessResults,
} from '../services/v2/orbsNodeService/OrbsNodeTypes';
import errorMonitoring from '../services/error-monitoring';
import _ from 'lodash';
import { ICommitteeEffectiveStakeByChain } from '../services/v2/orbsNodeService/nodeResponseProcessing/RootNodeData';

export class OrbsNodeStore {
  @observable public doneLoading = false;
  @observable public errorLoading = false;
  @observable public guardians: Guardian[] = [];
  @observable public committeeMembers: ICommitteeMemberData[] = [];
  @observable public committeeGuardians: Guardian[] = [];
  @observable public committeeEffectiveStakeByChain: ICommitteeEffectiveStakeByChain;
  @observable public committeeEffectiveStake = 0;

  @observable public minSelfStakePercentMille = 0;
  public allChainsGuardians: { [key: string]: IGuardiansDictionary };

  /**
   * Returns all addresses in lower case.
   */
  @computed public get guardiansAddresses(): string[] {
    return this.guardians.map((guardian) => guardian.EthAddress.toLowerCase());
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

  constructor(private orbsNodeService: IOrbsNodeService, private electionsService: IElectionsService) {
    this.readAllData();
  }

  // ****  Data reading ****

  private async readAllData() {
    this.setDoneLoading(false);
    this.setErrorLoading(false);
    try {
      await this.getSettings();
      await this.findReadAndSetNodeData();
      this.setDoneLoading(true);
    } catch (e) {
      const { captureException, sections } = errorMonitoring;
      captureException(e, sections.accountStore, 'error in function: readAllData');
      this.setErrorLoading(true);
    }
  }

  private async findReadAndSetNodeData() {
    const {
      allNetworksGuardians,
      committeeMembers,
      committeeGuardians,
      groupedGuardiansByNetwork,
      committeEffectiveStakes,
      selectedChain,
    } = await this.readDataFromFirstSyncedNode();

    this.setAllChainsGuardians(groupedGuardiansByNetwork);
    this.setCommitteeMemberData(committeeMembers);
    this.setCommitteeGuardians(committeeGuardians);
    this.setGuardians(allNetworksGuardians);
    this.setCommitteeEffectiveStake(committeEffectiveStakes[selectedChain]);
    this.setCommitteeEffectiveStakeByChain(committeEffectiveStakes);
  }

  private async getSettings() {
    try {
      const res = await this.electionsService.getSettings();
      const { minSelfStakePercentMille } = res;
      const minSelfStakePercent = Number(minSelfStakePercentMille) / 1000;
      this.setMinSelfStakePercentMille(minSelfStakePercent);
    } catch (error) {}
  }

  private async readDataFromFirstSyncedNode(): Promise<IReadAndProcessResults> {
    const defaultNodeProcessedResponse = await this.readDefaultNodeData();

    if (defaultNodeProcessedResponse) {
      return defaultNodeProcessedResponse;
    } else {
      return this.findSyncedCommitteeAndReadData();
    }
  }

  private async readDefaultNodeData(): Promise<IReadAndProcessResults | null> {
    // Check if default node is in sync
    const allManagementStatuses = await this.orbsNodeService.fetchNodeManagementStatus();
    if (!allManagementStatuses) return;
    const isDefaultNodeAtSync = await this.orbsNodeService.checkIfDefaultNodeIsInSync(allManagementStatuses);
    if (!isDefaultNodeAtSync) {
      // TODO : ORL : Add analytic
      console.log('Default node is not in sync');
      return null;
    } else {
      try {
        const readAndProcessResult = await this.orbsNodeService.readAndProcessSystemState(
          allManagementStatuses,
          this.minSelfStakePercentMille,
        );

        return readAndProcessResult;
      } catch (e) {
        const { captureException, sections } = errorMonitoring;
        captureException(e, sections.accountStore, 'error in function: readDefaultNodeData');
        console.log(`Error while reading and processing default node : ${e}`);
        return null;
      }
    }
  }

  private async findSyncedCommitteeAndReadData(): Promise<IReadAndProcessResults> {
    return null;
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

  @action('setAllChainGroupedGuardians')
  private setAllChainsGuardians(value: { [key: string]: IGuardiansDictionary }) {
    this.allChainsGuardians = value;
  }

  @action('setCommitteeMemberData')
  private setCommitteeMemberData(committeeMembers: ICommitteeMemberData[]) {
    this.committeeMembers = committeeMembers;
  }
  @action('setGuardians')
  private setGuardians(value: Guardian[]) {
    this.guardians = value;
  }

  @action('setCommitteeEffectiveStake')
  private setCommitteeEffectiveStake(value: number) {
    this.committeeEffectiveStake = value;
  }

  @action('setCommitteeEffectiveStakeByChain')
  private setCommitteeEffectiveStakeByChain(value: ICommitteeEffectiveStakeByChain) {
    this.committeeEffectiveStakeByChain = value;
  }

  @action('setMinSelfStakePercentMille')
  private setMinSelfStakePercentMille(value: number) {
    this.minSelfStakePercentMille = value;
  }

  @action('setCommitteeGuardians')
  private setCommitteeGuardians(value: Guardian[]) {
    this.committeeGuardians = value;
  }
}
