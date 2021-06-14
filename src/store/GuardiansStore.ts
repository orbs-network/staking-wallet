import { observable, action, reaction, IReactionDisposer, computed } from 'mobx';

import { IOrbsPOSDataService, IGuardianInfo, IGuardiansService } from 'orbs-pos-data';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { STAKING_ACTIONS } from '../services/analytics/analyticConstants';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';
import errorMonitoring from '../services/error-monitoring';

export type TGuardianInfoExtended = IGuardianInfo & { address: string };

export interface IGuardiansStoreState {
  guardiansList: TGuardianInfoExtended[];
  totalParticipatingTokens: bigint;
}

export type TGuardiansStore = IGuardiansStoreState;

export class GuardiansStore implements TGuardiansStore {
  @observable public doneLoading = false;
  @observable public errorLoading = false;
  @observable public guardiansList: TGuardianInfoExtended[];
  @observable public totalParticipatingTokens: bigint;

  private addressChangeReaction: IReactionDisposer;

  @computed get guardiansAddresses(): string[] {
    return this.guardiansList.map((g) => g.address.toLowerCase());
  }

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletConnectionStore,
    private orbsPOSDataService: IOrbsPOSDataService,
    private guardiansService: IGuardiansService,
    private analyticsService: IAnalyticsService,
    private alertErrors = false,
  ) {
    this.guardiansList = [];
    this.totalParticipatingTokens = BigInt(0);

    this.addressChangeReaction = reaction(
      () => this.cryptoWalletIntegrationStore.mainAddress,
      async (address) => {
        try {
          await this.reactToConnectedAddressChanged(address);
        } catch (e) {
          this.failLoadingProcess(e);
          errorMonitoring.captureException(e, 'guardian store');
          console.error(e);
        }
      },
      {
        fireImmediately: true,
      },
    );
  }

  async init() {
    try {
      const totalParticipatingTokens = await this.orbsPOSDataService.readTotalParticipatingTokens();
      this.setTotalParticipatingTokens(totalParticipatingTokens);

      const guardiansAddresses = await this.guardiansService.readGuardiansList(0, 100);
      const promises = guardiansAddresses.map((guardianAddress) =>
        this.guardiansService.readGuardianInfo(guardianAddress),
      );
      const guardiansInfo = await Promise.all(promises);
      const guardiansInfoExtended = guardiansInfo.map((g, idx) => ({ ...g, address: guardiansAddresses[idx] }));
      this.setGuardiansList(guardiansInfoExtended);

      this.setDoneLoading(true);
    } catch (e) {
      this.failLoadingProcess(e);
      errorMonitoring.captureException(e, 'guardian store');
      if (this.alertErrors) {
        alert(`Error on Guardians store : ${e}`);
      }

      console.error('Error while initialising Guardians store', e);
    }
  }

  private async reactToConnectedAddressChanged(currentAddress) {
    if (currentAddress) {
      this.setDefaultAccountAddress(currentAddress);
    }
  }

  // ****  Complex setters ****
  private failLoadingProcess(error: Error) {
    this.setErrorLoading(true);
    this.setDoneLoading(true);
  }

  // ****  Observables setter actions ****
  private setDefaultAccountAddress(accountAddress: string) {
    this.guardiansService.setFromAccount(accountAddress);
  }

  public selectGuardian(guardianAddress: string): PromiEvent<TransactionReceipt> {
    this.analyticsService.trackStakingContractInteractionRequest(STAKING_ACTIONS.guardianChange);

    return this.guardiansService.selectGuardian(guardianAddress);
  }

  @action('setGuardiansList')
  private setGuardiansList(guardians: TGuardianInfoExtended[]) {
    this.guardiansList = guardians;
  }

  @action('setTotalParticipatingTokens')
  private setTotalParticipatingTokens(totalParticipatingTokens: bigint) {
    this.totalParticipatingTokens = totalParticipatingTokens;
  }

  @action('setDoneLoading')
  private setDoneLoading(doneLoading: boolean) {
    this.doneLoading = doneLoading;
  }

  @action('setErrorLoading')
  private setErrorLoading(errorLoading: boolean) {
    this.errorLoading = errorLoading;
  }
}
