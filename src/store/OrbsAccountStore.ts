import { action, computed, IReactionDisposer, observable, reaction } from 'mobx';
import isNil from 'lodash/isNil';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { IOrbsPOSDataService, IOrbsTokenService, IOrbsRewardsService } from 'orbs-pos-data';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import {
  subscribeToOrbsInCooldownChange,
  subscribeToStakeAmountChange,
} from './contractsStateSubscriptions/combinedEventsSubscriptions';
import { EMPTY_ADDRESS } from '../constants';
import moment from 'moment';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';
import { fullOrbsFromWeiOrbs } from '../cryptoUtils/unitConverter';
import { STAKING_ACTIONS } from '../services/analytics/analyticConstants';
import { OrbsNodeStore } from './OrbsNodeStore';
import { Guardian } from '../services/v2/orbsNodeService/systemState';
import { IStakingRewardsService } from '@orbs-network/contracts-js/dist/ethereumContractsServices/stakingRewardsService/IStakingRewardsService';
import { IDelegationsService, IStakingService } from '@orbs-network/contracts-js';

export class OrbsAccountStore {
  @observable public doneLoading = false;
  @observable public errorLoading = false;

  @observable public liquidOrbs = BigInt(0);
  @observable public stakingContractAllowance = BigInt(0);
  @observable public stakedOrbs = BigInt(0);
  @observable public orbsInCoolDown = BigInt(0);
  @observable public cooldownReleaseTimestamp = 0;

  @observable public totalStakedOrbsInContract = 0;
  @observable public totalUncappedStakedOrbs = 0;

  @observable public rewardsBalance = 0;
  @observable public claimedRewards = 0;
  @observable public estimatedRewardsForNextWeek = 0;

  @observable public _selectedGuardianAddress: string;

  @computed get isGuardian(): boolean {
    return this.orbsNodeStore.guardiansAddresses.includes(this.cryptoWalletIntegrationStore.mainAddress?.toLowerCase());
  }

  @computed get selectedGuardianAddress(): string {
    if (this.isGuardian) {
      return this.cryptoWalletIntegrationStore.mainAddress;
    } else {
      return this._selectedGuardianAddress;
    }
  }
  @computed get hasSelectedGuardian(): boolean {
    if (this.isGuardian) {
      return true;
    } else if (
      !isNil(this.selectedGuardianAddress) &&
      this.selectedGuardianAddress !== EMPTY_ADDRESS &&
      this.selectedGuardianAddress !== this.cryptoWalletIntegrationStore.mainAddress
    ) {
      // DEV_NOTE : O.L : We want to make sure that the selected guardian address is not empty, directed to null (zero address) or the default one (default in V2 is auto self-delegation)
      return true;
    } else {
      return false;
    }
  }
  @computed get selectedGuardian(): Guardian | null {
    if (this.hasSelectedGuardian) {
      const guardian = this.orbsNodeStore.guardians.find(
        (g) => g.EthAddress.toLowerCase() === this.selectedGuardianAddress,
      );
      return guardian || null;
    } else {
      return null;
    }
  }
  @computed get isSelectedGuardianRegistered(): boolean {
    return this.selectedGuardian !== null;
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

  @computed get totalSystemStakedTokens(): number {
    return this.totalStakedOrbsInContract - this.totalUncappedStakedOrbs;
  }

  @computed get hasClaimableRewards(): boolean {
    return this.rewardsBalance > 0;
  }
  @computed get totalRewardedRewards(): number {
    return this.rewardsBalance + this.claimedRewards;
  }

  @computed get needsManualUpdatingOfState(): boolean {
    return !this.cryptoWalletIntegrationStore.hasEventsSupport;
  }

  @computed get hasUnusedAllowance(): boolean {
    return this.stakingContractAllowance > 0;
  }

  private addressChangeReaction: IReactionDisposer;
  private orbsBalanceChangeUnsubscribeFunction: () => void;
  private stakingContractAllowanceChangeUnsubscribeFunction: () => void;
  private stakedAmountChangeUnsubscribeFunction: () => void;
  private orbsInCooldownAmountChangeUnsubscribeFunction: () => void;
  private selectedGuardianChangeUnsubscribeFunction: () => void;

  // TODO : ORL : Remove the old 'orbsRewardsService' and implement new rewards calculation with 'Staking rewards'
  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletConnectionStore,
    private orbsNodeStore: OrbsNodeStore,
    private orbsPOSDataService: IOrbsPOSDataService,
    private stakingService: IStakingService,
    private stakingRewardsService: IStakingRewardsService,
    private orbsTokenService: IOrbsTokenService,
    private orbsRewardsService: IOrbsRewardsService,
    private analyticsService: IAnalyticsService,
    private delegationsService: IDelegationsService,
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

  public delegate(delegationTargetAddress: string): PromiEvent<TransactionReceipt> {
    return this.delegationsService.delegate(delegationTargetAddress);
  }

  public claimRewards(): PromiEvent<TransactionReceipt> {
    return this.stakingRewardsService.claimRewards(this.cryptoWalletIntegrationStore.mainAddress);
  }

  // **** Data fefresh interactions ****
  public async refreshEstimatedRewardsRate() {
    return this.readAndSetEstimatedRewardsForNextWeek(this.cryptoWalletIntegrationStore.mainAddress);
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
    this.delegationsService.setFromAccount(accountAddress);
    this.stakingRewardsService.setFromAccount(accountAddress);
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
      console.error(`Error in read-n-set liquid orbs : ${e}`);
      throw e;
    });
    await this.readAndSetStakedOrbs(accountAddress).catch((e) => {
      console.error(`Error in read-n-set staked orbs : ${e}`);
      throw e;
    });
    await this.readAndSetSelectedGuardianAddress(accountAddress).catch((e) => {
      console.error(`Error in read-n-set selected guardian : ${e}`);
      throw e;
    });
    await this.readAndSetStakingContractAllowance(accountAddress).catch((e) => {
      console.error(`Error in read-n-set contract allowance: ${e}`);
      throw e;
    });
    await this.readAndSetCooldownStatus(accountAddress).catch((e) => {
      console.error(`Error in read-n-set cooldown status : ${e}`);
      throw e;
    });
    await this.readAndSetRewardsBalance(accountAddress).catch((e) => {
      console.error(`Error in read-n-set rewards balance : ${e}`);
      throw e;
    });
    await this.readAndSetClaimedRewards(accountAddress).catch((e) => {
      console.error(`Error in read-n-set claimed rewards : ${e}`);
      throw e;
    });
    await this.readAndSetEstimatedRewardsForNextWeek(accountAddress).catch((e) => {
      console.error(`Error in read-n-set rewards estimation for the following week : ${e}`);
      throw e;
    });
  }

  private async readAndSetLiquidOrbs(accountAddress: string) {
    const liquidOrbs = await this.orbsPOSDataService.readOrbsBalance(accountAddress);
    this.setLiquidOrbs(liquidOrbs);
  }

  private async readAndSetSelectedGuardianAddress(accountAddress: string) {
    const selectedGuardianAddress = await this.delegationsService.readDelegation(accountAddress);
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

  private async readAndSetClaimedRewards(accountAddress: string) {
    const claimedRewardsInFullOrbs = await this.stakingRewardsService.readClaimedRewardsFullOrbs(accountAddress);
    this.setClaimedRewards(claimedRewardsInFullOrbs);
  }

  private async readAndSetEstimatedRewardsForNextWeek(accountAddress: string) {
    const oneWeekInSeconds = 60 * 60 * 24 * 7;
    const estimateRewardsFullOrbs = await this.stakingRewardsService.estimateFutureRewardsFullOrbs(
      accountAddress,
      oneWeekInSeconds,
    );
    this.setEstimatedRewardsForNextWeek(estimateRewardsFullOrbs);
  }

  private async readAndSetRewardsBalance(accountAddress: string) {
    const rewardsBalance = await this.stakingRewardsService.readRewardsBalanceFullOrbs(accountAddress);
    this.setRewardsBalance(rewardsBalance);
  }

  private async readAndSetTotalStakedOrbsInContract() {
    const totalStakedOrbsInContract = await this.stakingRewardsService.readTotalStakedInFullOrbs();
    this.setTotalStakedOrbsInContract(totalStakedOrbsInContract);
  }

  private async readAndSetTotalUncappedStakedOrbs() {
    const totalUncappedStakedOrbs = await this.delegationsService.readUncappedDelegatedStakeInFullOrbs();
    this.setTotalUncappedStakedOrbs(totalUncappedStakedOrbs);
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
    // this.selectedGuardianChangeUnsubscribeFunction = this.guardiansService.subscribeToDelegateEvent(
    //   accountAddress,
    //   (error, delegator, delegatee, delegationCounter) => this.setSelectedGuardianAddress(delegatee),
    // );
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

  @action('setRewardsBalance')
  private setRewardsBalance(rewardsBalance: number) {
    console.log({ rewardsBalance });
    this.rewardsBalance = rewardsBalance;
  }

  @action('setClaimedRewards')
  private setClaimedRewards(claimedRewards: number) {
    this.claimedRewards = claimedRewards;
  }

  @action('setEstimatedRewardsForNextWeek')
  private setEstimatedRewardsForNextWeek(estimatedRewardsForNextWeek: number) {
    this.estimatedRewardsForNextWeek = estimatedRewardsForNextWeek;
  }

  @action('setTotalStakedOrbsInContract')
  private setTotalStakedOrbsInContract(totalStakedOrbsInContract: number) {
    this.totalStakedOrbsInContract = totalStakedOrbsInContract;
  }

  @action('setTotalUncappedStakedOrbs')
  private setTotalUncappedStakedOrbs(totalUncappedStakedOrbs: number) {
    this.totalUncappedStakedOrbs = totalUncappedStakedOrbs;
  }
}
