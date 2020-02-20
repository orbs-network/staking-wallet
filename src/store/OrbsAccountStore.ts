import { action, computed, IReactionDisposer, observable, reaction } from 'mobx';
import isNil from 'lodash/isNil';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { IOrbsPOSDataService, IStakingService, IOrbsTokenService, IGuardiansService } from 'orbs-pos-data';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import {
  subscribeToOrbsInCooldownChange,
  subscribeToStakeAmountChange,
} from './contractsStateSubscriptions/combinedEventsSubscriptions';
import { EMPTY_ADDRESS } from '../constants';
import moment from 'moment';

export class OrbsAccountStore {
  // TODO : O.L : Check if we really need to have a string here.
  @observable public liquidOrbs = BigInt(0);
  @observable public stakingContractAllowance = BigInt(0);
  @observable public stakedOrbs = BigInt(0);
  @observable public orbsInCoolDown = BigInt(0);
  @observable public cooldownReleaseTimestamp = 0;
  @observable public accumulatedRewards = BigInt(0);
  @observable public selectedGuardianAddress: string;

  @computed get hasSelectedGuardian(): boolean {
    return !isNil(this.selectedGuardianAddress) && this.selectedGuardianAddress !== EMPTY_ADDRESS;
  }
  @computed get hasOrbsToWithdraw(): boolean {
    return this.orbsInCoolDown > 0 && this.cooldownReleaseTimestamp <= moment.utc().unix();
  }
  private addressChangeReaction: IReactionDisposer;
  private orbsBalanceChangeUnsubscribeFunction: () => void;
  private stakingContractAllowanceChangeUnsubscribeFunction: () => void;
  private stakedAmountChangeUnsubscribeFunction: () => void;
  private orbsInCooldownAmountChangeUnsubscribeFunction: () => void;
  private selectedGuardianChangeUnsubscribeFunction: () => void;

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

  public setAllowanceForStakingContract(allowanceForStakingContractInWeiOrbs: bigint): PromiEvent<TransactionReceipt> {
    const stakingContractAddress = this.stakingService.getStakingContractAddress();
    const promivent = this.orbsTokenService.approve(stakingContractAddress, allowanceForStakingContractInWeiOrbs);

    return promivent;
  }

  public stakeTokens(weiOrbsToStake: bigint): PromiEvent<TransactionReceipt> {
    return this.stakingService.stake(weiOrbsToStake);
  }

  public withdrawTokens(): PromiEvent<TransactionReceipt> {
    return this.stakingService.withdraw();
  }

  public unstakeTokens(weiOrbsToUnstake: bigint): PromiEvent<TransactionReceipt> {
    return this.stakingService.unstake(weiOrbsToUnstake);
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
    this.setStakedOrbs(stakedOrbs);
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

    // Staked orbs
    const onStakedAmountChanged = (error: Error, stakedAmountInEvent: bigint, totalStakedAmount: bigint) => {
      // TODO : O.L : Handle error
      this.setStakedOrbs(totalStakedAmount);
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

    // Selected guardian
    this.selectedGuardianChangeUnsubscribeFunction = this.guardiansService.subscribeToDelegateEvent(
      accountAddress,
      (error, delegator, delegatee, delegationCounter) => this.setSelectedGuardianAddress(delegatee),
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
  private setLiquidOrbs(liquidOrbs: bigint) {
    this.liquidOrbs = liquidOrbs;
  }

  @action('setStakingContractAllowance')
  private setStakingContractAllowance(stakingContractAllowance: bigint) {
    this.stakingContractAllowance = stakingContractAllowance;
  }

  @action('setLiquidOrbs')
  private setStakedOrbs(stakedOrbs: bigint) {
    this.stakedOrbs = stakedOrbs;
  }

  @action('setOrbsInCooldown')
  private setOrbsInCooldown(orbsInCooldown: bigint) {
    this.orbsInCoolDown = orbsInCooldown;
  }

  @action('setCooldownReleaseTimestamp')
  private setCooldownReleaseTimestamp(cooldownReleaseTimestamp: number) {
    this.cooldownReleaseTimestamp = cooldownReleaseTimestamp;
  }

  @action('setAccumulatedRewards')
  private setAccumulatedRewards(accumulatedRewards: bigint) {
    this.accumulatedRewards = accumulatedRewards;
  }

  @action('setSelectedGuardianAddress')
  private setSelectedGuardianAddress(selectedGuardianAddress: string) {
    this.selectedGuardianAddress = selectedGuardianAddress;
  }
}
