import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { IOrbsPOSDataService, IStakingService, IOrbsTokenService, IGuardiansService } from 'orbs-pos-data';
import { TransactionVerificationListener } from '../transactions/TransactionVerificationListener';
import { PromiEvent, TransactionReceipt } from 'web3-core';

export class OrbsAccountStore {
  // TODO : O.L : Check if we really need to have a string here.
  @observable public liquidOrbs = '0';
  @observable public stakingContractAllowance = '0';
  @observable public stakedOrbs = 0;
  @observable public orbsInCoolDown = 0;
  @observable public accumulatedRewards: number;
  @observable public selectedGuardianAddress: string;

  private addressChangeReaction: IReactionDisposer;
  private orbsBalanceChangeUnsubscribeFunction: () => void;
  private stakingContractAllowanceChangeUnsubscribeFunction: () => void;

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletConnectionStore,
    private orbsPOSDataService: IOrbsPOSDataService,
    private stakingService: IStakingService,
    private orbsTokenService: IOrbsTokenService,
    private guardiansService: IGuardiansService,
  ) {
    this.addressChangeReaction = reaction(
      () => this.cryptoWalletIntegrationStore.mainAddress,
      async address => await this.reactToConnectedAddressChanged(address),
      {
        fireImmediately: true,
      },
    );
  }

  public setAllowanceForStakingContract(orbsToStake: number): PromiEvent<TransactionReceipt> {
    const stakingContractAddress = this.stakingService.getStakingContractAddress();
    const promivent = this.orbsTokenService.approve(stakingContractAddress, orbsToStake);

    return promivent;
  }

  public stakeOrbs(orbsToStake: number): PromiEvent<TransactionReceipt> {
    return this.stakingService.stake(orbsToStake);
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
    this.orbsTokenService.setFromAccount(accountAddress);
  }

  private async readDataForAccount(accountAddress: string) {
    const liquidOrbs = await this.orbsPOSDataService.readOrbsBalance(accountAddress);
    const stakingContractAllowance = await this.orbsTokenService.readAllowance(
      this.cryptoWalletIntegrationStore.mainAddress,
      this.stakingService.getStakingContractAddress(),
    );
    const selectedGuardianAddress = await this.guardiansService.readSelectedGuardianAddress(accountAddress);

    this.setLiquidOrbs(liquidOrbs);
    this.setStakingContractAllowance(stakingContractAllowance);
    this.setSelectedGuardianAddress(selectedGuardianAddress);
  }

  private async refreshAccountListeners(accountAddress: string) {
    // Orbs balance
    if (this.orbsBalanceChangeUnsubscribeFunction) {
      this.orbsBalanceChangeUnsubscribeFunction();
    }

    this.orbsBalanceChangeUnsubscribeFunction = this.orbsPOSDataService.subscribeToORBSBalanceChange(
      accountAddress,
      newBalance => this.setLiquidOrbs(newBalance),
    );

    // Staking contract allowance
    if (this.stakingContractAllowanceChangeUnsubscribeFunction) {
      this.stakingContractAllowanceChangeUnsubscribeFunction();
    }

    this.stakingContractAllowanceChangeUnsubscribeFunction = this.orbsTokenService.subscribeToAllowanceChange(
      accountAddress,
      this.stakingService.getStakingContractAddress(),
      (error, newAllowance) => this.setStakingContractAllowance(newAllowance),
    );
  }

  @action('setLiquidOrbs')
  private setLiquidOrbs(liquidOrbs: string) {
    this.liquidOrbs = liquidOrbs;
  }

  @action('setStakingContractAllowance')
  private setStakingContractAllowance(stakingContractAllowance: string) {
    this.stakingContractAllowance = stakingContractAllowance;
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
