import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { IOrbsPOSDataService, IStakingService, IOrbsTokenService, IGuardiansService } from 'orbs-pos-data';
import { TransactionVerificationListener } from '../transactions/TransactionVerificationListener';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import {
  subscribeToOrbsInCooldownChange,
  subscribeToStakeAmountChange,
} from './contractsStateSubscriptions/combinedEventsSubscriptions';

export class OrbsAccountStore {
  // TODO : O.L : Check if we really need to have a string here.
  @observable public liquidOrbs = '0';
  @observable public stakingContractAllowance = '0';
  @observable public stakedOrbs = 0;
  @observable public orbsInCoolDown = 0;
  @observable public cooldownReleaseTimestamp = 0;
  @observable public accumulatedRewards: number;
  @observable public selectedGuardianAddress: string;

  private addressChangeReaction: IReactionDisposer;
  private orbsBalanceChangeUnsubscribeFunction: () => void;
  private stakingContractAllowanceChangeUnsubscribeFunction: () => void;
  private stakedAmountChangeUnsubscribeFunction: () => void;
  private orbsInCooldownAmountChangeUnsubscribeFunction: () => void;

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

  // **** Contract interactions ****

  public setAllowanceForStakingContract(orbsToStake: number): PromiEvent<TransactionReceipt> {
    const stakingContractAddress = this.stakingService.getStakingContractAddress();
    const promivent = this.orbsTokenService.approve(stakingContractAddress, orbsToStake);

    return promivent;
  }

  public stakeTokens(orbsToStake: number): PromiEvent<TransactionReceipt> {
    return this.stakingService.stake(orbsToStake);
  }

  public withdrawTokens(): PromiEvent<TransactionReceipt> {
    return this.stakingService.withdraw();
  }

  public unstakeTokens(orbsToUnlock: number): PromiEvent<TransactionReceipt> {
    return this.stakingService.unstake(orbsToUnlock);
  }

  public restakeTokens(): PromiEvent<TransactionReceipt> {
    return this.stakingService.restake();
  }

  // **** Current address changed ****

  private async reactToConnectedAddressChanged(currentAddress) {
    if (currentAddress) {
      this.setDefaultAccountAddress(currentAddress);
      this.refreshAccountListeners(currentAddress);

      await this.readDataForAccount(currentAddress);
    }
  }

  private setDefaultAccountAddress(accountAddress: string) {
    this.stakingService.setFromAccount(accountAddress);
    this.orbsTokenService.setFromAccount(accountAddress);
  }

  // **** Data reading and setting ****

  private async readDataForAccount(accountAddress: string) {
    // TODO : O.L : Add error handling (logging ?) for each specific "read and set" function.
    await this.readAndSetLiquidOrbs(accountAddress);
    await this.readAndSetStakedOrbs(accountAddress);
    await this.readAndSetSelectedGuardianAddress(accountAddress);
    await this.readAndSetStakingContractAllowance(accountAddress);
    await this.readAndSetCooldownStatus(accountAddress);
  }

  private async readAndSetLiquidOrbs(accountAddress: string) {
    const liquidOrbs = await this.orbsPOSDataService.readOrbsBalance(accountAddress);
    this.setLiquidOrbs(liquidOrbs);
  }

  private async readAndSetSelectedGuardianAddress(accountAddress: string) {
    const selectedGuardianAddress = await this.guardiansService.readSelectedGuardianAddress(accountAddress);

    this.setSelectedGuardianAddress(selectedGuardianAddress);
  }

  private async readAndSetStakedOrbs(accountAddress: string) {
    const stakedOrbs = await this.stakingService.readStakeBalanceOf(accountAddress);
    this.setStakedOrbs(parseInt(stakedOrbs));
  }

  private async readAndSetStakingContractAllowance(accountAddress: string) {
    const stakingContractAllowance = await this.orbsTokenService.readAllowance(
      this.cryptoWalletIntegrationStore.mainAddress,
      this.stakingService.getStakingContractAddress(),
    );

    this.setStakingContractAllowance(stakingContractAllowance);
  }

  private async readAndSetCooldownStatus(accountAddress: string) {
    const cooldownStatus = await this.stakingService.readUnstakeStatus(accountAddress);

    const amount = cooldownStatus.cooldownAmount;
    const releaseTimestamp = cooldownStatus.cooldownEndTime;

    this.setOrbsInCooldown(amount);
    this.setCooldownReleaseTimestamp(releaseTimestamp);
  }

  // ****  Subscriptions ****

  private async refreshAccountListeners(accountAddress: string) {
    this.cancelAllCurrentSubscriptions();

    // Orbs balance
    this.orbsBalanceChangeUnsubscribeFunction = this.orbsPOSDataService.subscribeToORBSBalanceChange(
      accountAddress,
      newBalance => this.setLiquidOrbs(newBalance),
    );

    // Staking contract allowance
    this.stakingContractAllowanceChangeUnsubscribeFunction = this.orbsTokenService.subscribeToAllowanceChange(
      accountAddress,
      this.stakingService.getStakingContractAddress(),
      (error, newAllowance) => this.setStakingContractAllowance(newAllowance),
    );

    // TODO : O.L : Work out the string/number decision.
    // Staked orbs
    const onStakedAmountChanged = (error: Error, stakedAmountInEvent: string, totalStakedAmount: string) => {
      // TODO : O.L : Handle error
      this.setStakedOrbs(parseInt(totalStakedAmount));
    };
    this.stakedAmountChangeUnsubscribeFunction = subscribeToStakeAmountChange(
      this.stakingService,
      accountAddress,
      onStakedAmountChanged,
    );

    // Cooldown status
    const onCooldownStatusChanged = () => this.readAndSetCooldownStatus(accountAddress);
    this.orbsInCooldownAmountChangeUnsubscribeFunction = subscribeToOrbsInCooldownChange(
      this.stakingService,
      accountAddress,
      onCooldownStatusChanged,
    );
  }

  private cancelAllCurrentSubscriptions() {
    // Orbs balance
    if (this.orbsBalanceChangeUnsubscribeFunction) {
      this.orbsBalanceChangeUnsubscribeFunction();
    }

    // Staking contract allowance
    if (this.stakingContractAllowanceChangeUnsubscribeFunction) {
      this.stakingContractAllowanceChangeUnsubscribeFunction();
    }

    // Staked orbs
    if (this.stakedAmountChangeUnsubscribeFunction) {
      this.stakedAmountChangeUnsubscribeFunction();
    }

    // Cooldown status
    if (this.orbsInCooldownAmountChangeUnsubscribeFunction) {
      this.orbsInCooldownAmountChangeUnsubscribeFunction();
    }
  }

  // ****  Observables setter actions ****

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

  @action('setOrbsInCooldown')
  private setOrbsInCooldown(orbsInCooldown: number) {
    this.orbsInCoolDown = orbsInCooldown;
  }

  @action('setCooldownReleaseTimestamp')
  private setCooldownReleaseTimestamp(cooldownReleaseTimestamp: number) {
    this.cooldownReleaseTimestamp = cooldownReleaseTimestamp;
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
