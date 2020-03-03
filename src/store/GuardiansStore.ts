import { observable, action, reaction, IReactionDisposer } from 'mobx';

import { IOrbsPOSDataService, IGuardianInfo, IGuardiansService } from 'orbs-pos-data';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';

export type TGuardianInfoExtended = IGuardianInfo & { address: string };

export interface IGuardiansStoreState {
  guardiansList: TGuardianInfoExtended[];
  totalParticipatingTokens: bigint;
}

export type TGuardiansStore = IGuardiansStoreState;

export class GuardiansStore implements TGuardiansStore {
  @observable public doneLoading: boolean = false;
  @observable public guardiansList: TGuardianInfoExtended[];
  @observable public totalParticipatingTokens: bigint;

  private addressChangeReaction: IReactionDisposer;

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletConnectionStore,
    private orbsPOSDataService: IOrbsPOSDataService,
    private guardiansService: IGuardiansService,
  ) {
    this.guardiansList = [];
    this.totalParticipatingTokens = BigInt(0);

    this.addressChangeReaction = reaction(
      () => this.cryptoWalletIntegrationStore.mainAddress,
      async address => await this.reactToConnectedAddressChanged(address),
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
      const promises = guardiansAddresses.map(guardianAddress =>
        this.guardiansService.readGuardianInfo(guardianAddress),
      );
      const guardiansInfo = await Promise.all(promises);
      const guardiansInfoExtended = guardiansInfo.map((g, idx) => ({ ...g, address: guardiansAddresses[idx] }));
      this.setGuardiansList(guardiansInfoExtended);

      this.setDoneLoading(true);
    } catch (e) {
      console.log(e);
    }
  }

  private async reactToConnectedAddressChanged(currentAddress) {
    if (currentAddress) {
      this.setDefaultAccountAddress(currentAddress);
    }
  }

  private setDefaultAccountAddress(accountAddress: string) {
    this.guardiansService.setFromAccount(accountAddress);
  }

  public selectGuardian(guardianAddress: string): PromiEvent<TransactionReceipt> {
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
}
