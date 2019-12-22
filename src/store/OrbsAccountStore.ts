import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { CryptoWalletIntegrationStore } from './CryptoWalletIntegrationStore';
import { IOrbsPOSDataService } from 'orbs-pos-data';
import { raw } from 'express';
import { TransactionVerificationListener } from '../transactions/TransactionVerificationListener';

export class OrbsAccountStore {
  @observable public liquidOrbs: string;
  @observable public stakedOrbs: number;
  @observable public accumulatedRewards: number;
  @observable public selectedGuardianAddress: string;

  private addressChangeReaction: IReactionDisposer;
  private orbsBalanceChangeUnsubscribeFunction: () => void;

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletIntegrationStore,
    private orbsPOSDataService: IOrbsPOSDataService,
  ) {
    this.addressChangeReaction = reaction(
      () => this.cryptoWalletIntegrationStore.mainAddress,
      async address => await this.reactToConnectedAddressChanged(address),
      {
        fireImmediately: true,
      },
    );
  }

  public async stakeOrbs(
    orbsToStake: number,
  ): Promise<{ txId: string; txVerificationListener: TransactionVerificationListener }> {
    // return this.orbsPOSDataService.stakeOrbs(orbsToStake);

    const verificationListener = new TransactionVerificationListener(null);

    return {
      txVerificationListener: verificationListener,
      txId: '',
    };
  }

  public async selectGuardian(
    guardianAddress: string,
  ): Promise<{ txId: string; txVerificationListener: TransactionVerificationListener }> {
    // return this.orbsPOSDataService.selectGuardian(guardianAddress);

    const verificationListener = new TransactionVerificationListener(null);

    return {
      txVerificationListener: verificationListener,
      txId: '',
    };
  }

  public async redeemTokens(): Promise<{ txId: string; txVerificationListener: TransactionVerificationListener }> {
    // return this.orbsPOSDataService.redeemTokens();

    const verificationListener = new TransactionVerificationListener(null);

    return {
      txVerificationListener: verificationListener,
      txId: '',
    };
  }

  public async unlockTokens(
    orbsToUnlock: number,
  ): Promise<{ txId: string; txVerificationListener: TransactionVerificationListener }> {
    // return this.orbsPOSDataService.unlockTokens(orbsToUnlock);

    const verificationListener = new TransactionVerificationListener(null);

    return {
      txVerificationListener: verificationListener,
      txId: '',
    };
  }

  private async reactToConnectedAddressChanged(currentAddress) {
    if (currentAddress) {
      await this.readDataForAccount(currentAddress);
      this.refreshAccountListeners(currentAddress);
    }
  }

  private async readDataForAccount(accountAddress: string) {
    const liquidOrbs = await this.orbsPOSDataService.getOrbsBalance(accountAddress);

    this.setLiquidOrbs(liquidOrbs);
  }

  private async refreshAccountListeners(accountAddress: string) {
    if (this.orbsBalanceChangeUnsubscribeFunction) {
      this.orbsBalanceChangeUnsubscribeFunction();
    }

    this.orbsBalanceChangeUnsubscribeFunction = this.orbsPOSDataService.subscribeToORBSBalanceChange(
      accountAddress,
      newBalance => this.setLiquidOrbs(newBalance),
    );
  }

  @action('setLiquidOrbs')
  private setLiquidOrbs(liquidOrbs: string) {
    this.liquidOrbs = liquidOrbs;
  }

  @action('setLiquidOrbs')
  private setStakedOrbs(stakedOrbs: number) {
    this.stakedOrbs = stakedOrbs;
  }

  @action('setAccumulatedRewards')
  private setAccumulatedRewards(accumulatedRewards: number) {
    this.accumulatedRewards = accumulatedRewards;
  }

  @action('setSelectedGuardianAddress')
  private setSelectedGuardianAddress(selectedGuardianAddress: string) {
    this.selectedGuardianAddress = selectedGuardianAddress;
  }
}
