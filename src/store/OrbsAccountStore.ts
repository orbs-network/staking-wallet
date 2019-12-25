import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { CryptoWalletIntegrationStore } from './CryptoWalletIntegrationStore';
import { IOrbsPOSDataService, IStakingService } from 'orbs-pos-data';
import { TransactionVerificationListener } from '../transactions/TransactionVerificationListener';

export class OrbsAccountStore {
  // TODO : O.L : Check if we really need to have a string here.
  @observable public liquidOrbs = '0';
  @observable public stakedOrbs = 0;
  @observable public orbsInCoolDown = 0;
  @observable public accumulatedRewards: number;
  @observable public selectedGuardianAddress: string;

  private addressChangeReaction: IReactionDisposer;
  private orbsBalanceChangeUnsubscribeFunction: () => void;

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletIntegrationStore,
    private orbsPOSDataService: IOrbsPOSDataService,
    private stakingService: IStakingService,
  ) {
    this.addressChangeReaction = reaction(
      () => this.cryptoWalletIntegrationStore.mainAddress,
      async address => await this.reactToConnectedAddressChanged(address),
      {
        fireImmediately: true,
      },
    );
  }

  public async stakeOrbs(orbsToStake: number): Promise<{ txVerificationListener: TransactionVerificationListener }> {
    const promivent = this.stakingService.stake(orbsToStake);

    const res = await promivent;

    const verificationListener = new TransactionVerificationListener(promivent);

    return {
      txVerificationListener: verificationListener,
    };
  }

  public async selectGuardian(
    guardianAddress: string,
  ): Promise<{ txVerificationListener: TransactionVerificationListener }> {
    // return this.orbsPOSDataService.selectGuardian(guardianAddress);

    const verificationListener = new TransactionVerificationListener(null);

    return {
      txVerificationListener: verificationListener,
    };
  }

  public async redeemTokens(): Promise<{ txVerificationListener: TransactionVerificationListener }> {
    // return this.orbsPOSDataService.redeemTokens();

    const verificationListener = new TransactionVerificationListener(null);

    return {
      txVerificationListener: verificationListener,
    };
  }

  public async unlockTokens(
    orbsToUnlock: number,
  ): Promise<{ txVerificationListener: TransactionVerificationListener }> {
    // return this.orbsPOSDataService.unlockTokens(orbsToUnlock);

    const verificationListener = new TransactionVerificationListener(null);

    return {
      txVerificationListener: verificationListener,
    };
  }

  private async reactToConnectedAddressChanged(currentAddress) {
    if (currentAddress) {
      this.setDefaultAccountAddress(currentAddress);
      await this.readDataForAccount(currentAddress);
      this.refreshAccountListeners(currentAddress);
    }
  }

  private setDefaultAccountAddress(accountAddress: string) {
    this.stakingService.setFromAccount(accountAddress);
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
