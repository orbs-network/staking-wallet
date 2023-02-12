import { ITotalChainStakeAmount } from './types';
import ContractRegistry from '../services/contarcs/contract-registry';
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
import { DelegationsService, IDelegationsService, IStakingService, StakingService } from '@orbs-network/contracts-js';
import errorMonitoring from '../services/error-monitoring';
import { getSupportedChains } from '../utils';
import Web3 from 'web3';
import web3Service from '../services/web3Service';
import config from '../../config';
export class OrbsAccountStore {
  @observable public doneLoading = false;
  @observable public errorLoading = false;

  // DEV_NOTE : O.L : This is a simple mechanism that will allow users of limited Dapp browsers to
  //                  still have the core capabilities of Tetra.
  // Special error indicators for contract queries that can fail due to
  // specific DAPP browser limitations
  @observable public errorReadingAccumulatedRewards = false;
  @observable public errorReadingRewardsDistribution = false;
  // DEV_NOTE : O.L : This should only be an error if trying to read Guardian from events.
  @observable public errorReadingSelectedGuardian = false;

  @observable public liquidOrbs = BigInt(0);
  @observable public stakingContractAllowance = BigInt(0);
  @observable public stakedOrbs = BigInt(0);
  @observable public orbsInCoolDown = BigInt(0);
  @observable public cooldownReleaseTimestamp = 0;
  @observable public totalStakeByChain: ITotalChainStakeAmount[] = [];
  @observable public totalSystemStakedTokens = 0;
  @observable public totalStakedOrbsInContract = 0;
  @observable public totalUncappedStakedOrbs = 0;
  @observable private providerError = false;

  @observable private initialFetchFinished = false;

  @observable public rewardsBalance = '0';
  @observable public claimedRewards = '0';
  @observable public estimatedRewardsForNextWeek = 0;

  @observable public _selectedGuardianAddress: string;

  @computed get isGuardian(): boolean {
    return this.orbsNodeStore.guardiansAddresses.includes(this.cryptoWalletIntegrationStore.mainAddress?.toLowerCase());
  }

  // ignore provider error after initial data loading
  @computed get isProviderError(): boolean {
    return this.initialFetchFinished ? false : this.providerError;
  }

  @computed get selectedGuardianAddress(): string {
    return this._selectedGuardianAddress;
  }

  @computed get hasSelectedGuardian(): boolean {
    if (this.isGuardian) {
      return true;
    } else if (
      !isNil(this.selectedGuardianAddress) &&
      this.selectedGuardianAddress !== EMPTY_ADDRESS &&
      this.cryptoWalletIntegrationStore.mainAddress &&
      this.selectedGuardianAddress.toLowerCase() !== this.cryptoWalletIntegrationStore.mainAddress.toLowerCase()
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
        (g) => g.EthAddress.toLowerCase() === this.selectedGuardianAddress.toLowerCase(),
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

  @computed get noTokens(): boolean {
    return !this.hasOrbsInCooldown && !this.hasStakedOrbs && !this.liquidOrbs && !this.totalRewardedRewards;
  }

  @computed get hasOrbsInCooldown(): boolean {
    return this.orbsInCoolDown > 0;
  }
  @computed get participatingInStaking(): boolean {
    return this.hasStakedOrbs || this.hasOrbsInCooldown || this.hasOrbsToWithdraw;
  }

  @computed get hasClaimableRewards(): boolean {
    return Number(this.rewardsBalance) > 0;
  }
  @computed get totalRewardedRewards(): string {
    return new Number(Number(this.rewardsBalance) + Number(this.claimedRewards)).toFixed(18);
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

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletConnectionStore,
    private orbsNodeStore: OrbsNodeStore,
    private orbsPOSDataService: IOrbsPOSDataService,
    private stakingService: IStakingService,
    private stakingRewardsService: IStakingRewardsService,
    private orbsTokenService: IOrbsTokenService,
    private analyticsService: IAnalyticsService,
    private delegationsService: IDelegationsService,
    private alertErrors = false,
  ) {
    this.readTotalStakeByChain();
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

  public async readTotalStakeByChain() {
    let total = 0;
    const result: ITotalChainStakeAmount[] = await Promise.all(
      getSupportedChains().map(async (chain: number) => {
        const { rpcUrls, contractsRegistry } = config.networks[chain];

        const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrls[0]));
        const { staking, delegations }: any = await new ContractRegistry(web3, contractsRegistry).getContracts([
          'staking',
          'delegations',
        ]);

        const totalStake = await new StakingService(web3, staking).readTotalStakedInFullOrbs();

        const totalUncappedStakedOrbs = await new DelegationsService(
          web3,
          delegations,
        ).readUncappedDelegatedStakeInFullOrbs();

        const totalSystemStakedTokens = totalStake - totalUncappedStakedOrbs;
        total += totalSystemStakedTokens;
        return {
          chain,
          totalSystemStakedTokens,
        };
      }),
    );

    this.setTotalStakeByChain(result);
    this.setTotalSystemStakedTokens(total);
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
  public async refreshAllRewardsData() {
    this.readAndSetEstimatedRewardsForNextWeek(this.cryptoWalletIntegrationStore.mainAddress);
    this.readAndSetRewardsBalance(this.cryptoWalletIntegrationStore.mainAddress);
    this.readAndSetClaimedRewards(this.cryptoWalletIntegrationStore.mainAddress);
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
        const { sections, captureException } = errorMonitoring;
        this.failLoadingProcess(e);
        captureException(e, sections.accountStore);
        if (this.alertErrors) {
          alert(`Error on orbs account store : ${e}`);
        }
        errorMonitoring.captureException(e, sections.accountStore, 'error in function: reactToConnectedAddressChanged');
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

  public async manuallyReadAccountData(address?: string) {
    try {
      await this.readDataForAccount(address || this.cryptoWalletIntegrationStore.mainAddress);
    } catch (e) {
      console.log(e);

      const { sections, captureException } = errorMonitoring;
      this.failLoadingProcess(e);
      captureException(e, sections.accountStore, 'error in function: manuallyReadAccountData');
      console.error('Error in manually reading address data in Orbs Account Store', e);
    }
  }

  private async readDataForAccount(accountAddress: string) {
    try {
      // await Promise.all([
      //   this.readAndSetLiquidOrbs(accountAddress),
      //   this.readAndSetStakedOrbs(accountAddress),
      //   this.readAndSetSelectedGuardianAddress(accountAddress),
      //   this.readAndSetStakingContractAllowance(accountAddress),
      //   this.readAndSetCooldownStatus(accountAddress),
      //   this.readAndSetRewardsBalance(accountAddress),
      //   this.readAndSetClaimedRewards(accountAddress),
      //   this.readAndSetEstimatedRewardsForNextWeek(accountAddress),
      //   this.readAndSetTotalStakedOrbsInContract(),
      //   this.readAndSetTotalUncappedStakedOrbs(),
      // ]);

      await this.readAndSetLiquidOrbs(accountAddress).catch((e) => {
        this.alertIfEnabled(`Error in reading liquid orbs : ${e}`);
        console.error(`Error in read-n-set liquid orbs : ${e}`);
        throw e;
      });
      await this.readAndSetStakedOrbs(accountAddress).catch((e) => {
        this.alertIfEnabled(`Error in reading staked orbs : ${e}`);
        console.error(`Error in read-n-set staked orbs : ${e}`);
        throw e;
      });
      await this.readAndSetSelectedGuardianAddress(accountAddress).catch((e) => {
        this.alertIfEnabled(`Error in reading selected guardian : ${e}`);
        console.error(`Error in read-n-set selected guardian : ${e}`);
        throw e;
      });
      await this.readAndSetStakingContractAllowance(accountAddress).catch((e) => {
        this.alertIfEnabled(`Error in reading contract allowance: ${e}`);
        console.error(`Error in read-n-set contract allowance: ${e}`);
        throw e;
      });
      await this.readAndSetCooldownStatus(accountAddress).catch((e) => {
        this.alertIfEnabled(`Error in reading cooldown status : ${e}`);
        console.error(`Error in read-n-set cooldown status : ${e}`);
        throw e;
      });
      await this.readAndSetRewardsBalance(accountAddress).catch((e) => {
        this.alertIfEnabled(`Error in reading: ${e}`);
        console.error(`Error in read-n-set rewards balance : ${e}`);
        throw e;
      });
      await this.readAndSetClaimedRewards(accountAddress).catch((e) => {
        this.alertIfEnabled(`Error in reading Claimed Rewards: ${e}`);
        console.error(`Error in read-n-set claimed rewards : ${e}`);
        throw e;
      });
      await this.readAndSetEstimatedRewardsForNextWeek(accountAddress).catch((e) => {
        this.alertIfEnabled(`Error in reading EstimatedRewardsForNextWeek: ${e}`);
        console.error(`Error in read-n-set rewards estimation for the following week : ${e}`);
        throw e;
      });
      await this.readAndSetTotalStakedOrbsInContract().catch((e) => {
        this.alertIfEnabled(`Error in reading TotalStakedOrbsInContract: ${e}`);
        console.error(`Error in read-n-set total staked orbs in contract : ${e}`);
        throw e;
      });
      await this.readAndSetTotalUncappedStakedOrbs().catch((e) => {
        this.alertIfEnabled(`Error in reading Total uncapped staked Orbs: ${e}`);
        console.error(`Error in read-n-set total uncapped staked orbs : ${e}`);
        throw e;
      });

      this.setInitialFetchFinished();
    } catch (error) {
      this.setProviderError(true);
      const { sections, captureException } = errorMonitoring;
      captureException(error, sections.accountStore, 'error in function: readDataForAccount');

      if (error instanceof Error) {
        console.log(error.message);

        this.alertIfEnabled(`error in function: readDataForAccount: ${error.message}`);
      }
    }
  }

  private alertIfEnabled(error: string) {
    if (this.alertErrors) {
      alert(error);
    }
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
      accountAddress,
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
    this.setClaimedRewards(new Number(claimedRewardsInFullOrbs).toFixed(18));
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
    this.setRewardsBalance(new Number(rewardsBalance).toFixed(18));
  }

  private async readAndSetTotalStakedOrbsInContract() {
    const totalStakedOrbsInContract = await this.stakingService.readTotalStakedInFullOrbs();
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
      (error, newAllowance) => {
        if (!error) {
          this.setStakingContractAllowance(newAllowance);
        }
      },
    );

    // Staked orbs
    const onStakedAmountChanged = (error: Error, stakedAmountInEvent: bigint, totalStakedAmount: bigint) => {
      // TODO : O.L : Handle error

      if (error) {
        const { sections, captureException } = errorMonitoring;
        captureException(error, sections.accountStore, 'error in function: onStakedAmountChanged');
      } else {
        this.setStakedOrbs(totalStakedAmount);
      }
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
  private setRewardsBalance(rewardsBalance: string) {
    this.rewardsBalance = rewardsBalance;
  }

  @action('setClaimedRewards')
  private setClaimedRewards(claimedRewards: string) {
    this.claimedRewards = claimedRewards;
  }
  @action('setTotalStakeByChain')
  private setTotalStakeByChain(value: ITotalChainStakeAmount[]) {
    this.totalStakeByChain = value;
  }

  @action('setEstimatedRewardsForNextWeek')
  private setEstimatedRewardsForNextWeek(estimatedRewardsForNextWeek: number) {
    this.estimatedRewardsForNextWeek = estimatedRewardsForNextWeek;
  }

  @action('setTotalSystemStakedTokens')
  private setTotalSystemStakedTokens(value: number) {
    this.totalSystemStakedTokens = value;
  }

  @action('setTotalStakedOrbsInContract')
  private setTotalStakedOrbsInContract(totalStakedOrbsInContract: number) {
    this.totalStakedOrbsInContract = totalStakedOrbsInContract;
  }

  @action('setTotalUncappedStakedOrbs')
  private setTotalUncappedStakedOrbs(totalUncappedStakedOrbs: number) {
    this.totalUncappedStakedOrbs = totalUncappedStakedOrbs;
  }

  @action('setProviderError')
  private setProviderError(value: boolean) {
    this.providerError = value;
  }

  @action('setInitialFetchFinished')
  private setInitialFetchFinished() {
    this.initialFetchFinished = true;
  }
}
