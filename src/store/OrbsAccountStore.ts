import { action, computed, IReactionDisposer, observable, reaction } from 'mobx';
import isNil from 'lodash/isNil';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import {
  IOrbsPOSDataService,
  IStakingService,
  IOrbsTokenService,
  IGuardiansService,
  IOrbsRewardsService,
  IRewardsDistributionEvent,
} from 'orbs-pos-data';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import {
  subscribeToOrbsInCooldownChange,
  subscribeToStakeAmountChange,
} from './contractsStateSubscriptions/combinedEventsSubscriptions';
import { EMPTY_ADDRESS } from '../constants';
import moment from 'moment';
import { GuardiansStore } from './GuardiansStore';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../cryptoUtils/unitConverter';
import { STAKING_ACTIONS } from '../services/analytics/analyticConstants';
import { IAccumulatedRewards } from 'orbs-pos-data/dist/interfaces/IAccumulatedRewards';

export type TRewardsDistributionHistory = IRewardsDistributionEvent[];

export class OrbsAccountStore {
  @observable public doneLoading = false;
  @observable public errorLoading = false;

  @observable public liquidOrbs = BigInt(0);
  @observable public stakingContractAllowance = BigInt(0);
  @observable public stakedOrbs = BigInt(0);
  @observable public orbsInCoolDown = BigInt(0);
  @observable public cooldownReleaseTimestamp = 0;
  @observable public accumulatedRewards: IAccumulatedRewards;
  @observable public rewardsDistributionsHistory: TRewardsDistributionHistory;
  @observable public _selectedGuardianAddress: string;

  @computed get isGuardian(): boolean {
    return this.guardiansStore.guardiansAddresses.includes(
      this.cryptoWalletIntegrationStore.mainAddress?.toLowerCase(),
    );
  }

  @computed get selectedGuardianAddress(): string {
    if (this.isGuardian) {
      return this.cryptoWalletIntegrationStore.mainAddress;
    } else {
      return this._selectedGuardianAddress;
    }
  }
  @computed get hasSelectedGuardian(): boolean {
    return !isNil(this.selectedGuardianAddress) && this.selectedGuardianAddress !== EMPTY_ADDRESS;
  }
  @computed get hasOrbsToWithdraw(): boolean {
    return this.orbsInCoolDown > 0 && this.cooldownReleaseTimestamp <= moment.utc().unix();
  }
  @computed get hasStakedOrbs(): boolean {
    return this.stakedOrbs > 0;
  }
  @computed get hasOrbsInCooldown(): boolean {
    return this.orbsInCoolDown > 0;
  }
  @computed get participatingInStaking(): boolean {
    return this.hasStakedOrbs || this.hasOrbsInCooldown || this.hasOrbsToWithdraw;
  }
  @computed get totalAccumulatedRewards(): number {
    if (!this.accumulatedRewards) {
      return 0;
    }

    // DEV_NOTE : The rewards are in whole orbs, we can safely convert them to numbers.
    return (
      Number(this.accumulatedRewards.delegatorReward) +
      Number(this.accumulatedRewards.guardianReward) +
      Number(this.accumulatedRewards.validatorReward)
    );
  }

  @computed get totalDistributedRewards(): number {
    if (!this.rewardsDistributionsHistory) {
      return 0;
    }

    const totalDistributedRewards = this.rewardsDistributionsHistory.reduce((sum, distributionEvent) => {
      // DEV_NOTE : The rewards are in whole orbs, we can safely convert them to numbers.
      return sum + fullOrbsFromWeiOrbs(distributionEvent.amount);
    }, 0);

    return totalDistributedRewards;
  }

  @computed get needsManualUpdatingOfState(): boolean {
    return !this.cryptoWalletIntegrationStore.hasEventsSupport;
  }

  private addressChangeReaction: IReactionDisposer;
  private orbsBalanceChangeUnsubscribeFunction: () => void;
  private stakingContractAllowanceChangeUnsubscribeFunction: () => void;
  private stakedAmountChangeUnsubscribeFunction: () => void;
  private orbsInCooldownAmountChangeUnsubscribeFunction: () => void;
  private selectedGuardianChangeUnsubscribeFunction: () => void;

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletConnectionStore,
    private guardiansStore: GuardiansStore,
    private orbsPOSDataService: IOrbsPOSDataService,
    private stakingService: IStakingService,
    private orbsTokenService: IOrbsTokenService,
    private guardiansService: IGuardiansService,
    private orbsRewardsService: IOrbsRewardsService,
    private analyticsService: IAnalyticsService,
  ) {
    this.addressChangeReaction = reaction(
      () => this.cryptoWalletIntegrationStore.mainAddress,
      async (address) => {
        this.setDoneLoading(false);
        await this.reactToConnectedAddressChanged(address);
        this.setDoneLoading(true);
      },
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
    this.analyticsService.trackStakingContractInteractionRequest(
      STAKING_ACTIONS.staking,
      fullOrbsFromWeiOrbs(weiOrbsToStake),
    );

    return this.stakingService.stake(weiOrbsToStake);
  }

  public withdrawTokens(): PromiEvent<TransactionReceipt> {
    this.analyticsService.trackStakingContractInteractionRequest(STAKING_ACTIONS.withdrawing);

    return this.stakingService.withdraw();
  }

  public unstakeTokens(weiOrbsToUnstake: bigint): PromiEvent<TransactionReceipt> {
    this.analyticsService.trackStakingContractInteractionRequest(
      STAKING_ACTIONS.unstaking,
      fullOrbsFromWeiOrbs(weiOrbsToUnstake),
    );

    return this.stakingService.unstake(weiOrbsToUnstake);
  }

  public restakeTokens(): PromiEvent<TransactionReceipt> {
    this.analyticsService.trackStakingContractInteractionRequest(STAKING_ACTIONS.restaking);

    return this.stakingService.restake();
  }

  // **** Current address changed ****

  private async reactToConnectedAddressChanged(currentAddress) {
    if (currentAddress) {
      this.setDefaultAccountAddress(currentAddress);

      if (this.cryptoWalletIntegrationStore.hasEventsSupport) {
        this.refreshAccountListeners(currentAddress);
      }

      try {
        await this.readDataForAccount(currentAddress);
      } catch (e) {
        this.failLoadingProcess(e);
        console.error('Error in reacting to address change in Orbs Account Store', e);
      }
    }
  }

  private setDefaultAccountAddress(accountAddress: string) {
    this.stakingService.setFromAccount(accountAddress);
    this.orbsTokenService.setFromAccount(accountAddress);
  }

  // **** Data reading and setting ****

  public async manuallyReadAccountData() {
    try {
      await this.readDataForAccount(this.cryptoWalletIntegrationStore.mainAddress);
    } catch (e) {
      this.failLoadingProcess(e);
      console.error('Error in manually reading address data in Orbs Account Store', e);
    }
  }

  private async readDataForAccount(accountAddress: string) {
    // TODO : O.L : Add error handling (logging ?) for each specific "read and set" function.
    await this.readAndSetLiquidOrbs(accountAddress).catch((e) => {
      console.error(`Error in reading liquid orbs : ${e}`);
      throw e;
    });
    await this.readAndSetStakedOrbs(accountAddress).catch((e) => {
      console.error(`Error in reading staked orbs : ${e}`);
      throw e;
    });
    await this.readAndSetSelectedGuardianAddress(accountAddress).catch((e) => {
      console.error(`Error in reading selected guardian : ${e}`);
      throw e;
    });
    await this.readAndSetStakingContractAllowance(accountAddress).catch((e) => {
      console.error(`Error in reading contract allowance: ${e}`);
      throw e;
    });
    await this.readAndSetCooldownStatus(accountAddress).catch((e) => {
      console.error(`Error in reading cooldown status : ${e}`);
      throw e;
    });
    await this.readAndSetRewards(accountAddress).catch((e) => {
      console.error(`Error in reading rewards : ${e}`);
      throw e;
    });
    await this.readAndSetRewardsHistory(accountAddress).catch((e) => {
      console.error(`Error in reading rewards history : ${e}`);
      throw e;
    });
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

  private async readAndSetRewards(accountAddress: string) {
    const accumulatedRewards = await this.orbsRewardsService.readAccumulatedRewards(accountAddress);
    this.setAccumulatedRewards(accumulatedRewards);
  }

  private async readAndSetRewardsHistory(accountAddress: string) {
    const rewardsDistributionHistory = await this.orbsRewardsService.readRewardsDistributionsHistory(accountAddress);
    this.setRewardsDistributionsHistory(rewardsDistributionHistory);
  }

  // ****  Subscriptions ****

  private async refreshAccountListeners(accountAddress: string) {
    this.cancelAllCurrentSubscriptions();

    // Orbs balance
    this.orbsBalanceChangeUnsubscribeFunction = this.orbsPOSDataService.subscribeToORBSBalanceChange(
      accountAddress,
      (newBalance) => this.setLiquidOrbs(newBalance),
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

  // ****  Complex setters ****
  private failLoadingProcess(error: Error) {
    this.setErrorLoading(true);
    this.setDoneLoading(true);
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

  @action('setSelectedGuardianAddress')
  private setSelectedGuardianAddress(selectedGuardianAddress: string) {
    this._selectedGuardianAddress = selectedGuardianAddress;
  }

  @action('setDoneLoading')
  private setDoneLoading(doneLoading: boolean) {
    this.doneLoading = doneLoading;
  }

  @action('setErrorLoading')
  private setErrorLoading(errorLoading: boolean) {
    this.errorLoading = errorLoading;
  }

  @action('setAccumulatedRewards')
  private setAccumulatedRewards(accumulatedRewards: any) {
    this.accumulatedRewards = accumulatedRewards;
  }

  @action('setRewardsDistributionsHistory')
  private setRewardsDistributionsHistory(rewardsDistributionsHistory: any) {
    this.rewardsDistributionsHistory = rewardsDistributionsHistory;
  }
}
