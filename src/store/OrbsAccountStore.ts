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

  public unlockTokens(orbsToUnlock: number): PromiEvent<TransactionReceipt> {
    return this.stakingService.unstake(orbsToUnlock);
  }

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

  private async readDataForAccount(accountAddress: string) {
    const liquidOrbs = await this.orbsPOSDataService.readOrbsBalance(accountAddress);
    const stakingContractAllowance = await this.orbsTokenService.readAllowance(
      this.cryptoWalletIntegrationStore.mainAddress,
      this.stakingService.getStakingContractAddress(),
    );
    const selectedGuardianAddress = await this.guardiansService.readSelectedGuardianAddress(accountAddress);
    const stakedOrbs = await this.stakingService.readStakeBalanceOf(accountAddress);

    this.setLiquidOrbs(liquidOrbs);
    this.setStakingContractAllowance(stakingContractAllowance);
    this.setSelectedGuardianAddress(selectedGuardianAddress);
    this.setStakedOrbs(stakedOrbs);

    await this.readAndSetCooldownStatus(accountAddress);
  }

  private async readAndSetCooldownStatus(accountAddress: string) {
    const cooldownStatus = await this.stakingService.readUnstakeStatus(accountAddress);

    const amount = Number.isNaN(cooldownStatus.cooldownAmount) ? 0 : cooldownStatus.cooldownAmount;
    const releaseTimestamp = Number.isNaN(cooldownStatus.cooldownEndTime) ? 0 : cooldownStatus.cooldownEndTime;

    this.setOrbsInCooldown(amount);
    this.setCooldownReleaseTimestamp(releaseTimestamp);
  }

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
    this.stakedAmountChangeUnsubscribeFunction = this.subscribeToStakeAmountChange(accountAddress);

    // Cooldown status
    this.orbsInCooldownAmountChangeUnsubscribeFunction = this.subscribeToOrbsInCooldownChange(accountAddress);
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

  // Move this out to be more functional and testable
  private subscribeToOrbsInCooldownChange(accountAddress: string): () => Promise<boolean> {
    const onCooldownStatusChanged = () => this.readAndSetCooldownStatus(accountAddress);

    const stakeEventUnsubscribe = this.stakingService.subscribeToStakedEvent(accountAddress, onCooldownStatusChanged);
    const unstakeEventUnsubscribe = this.stakingService.subscribeToUnstakedEvent(
      accountAddress,
      onCooldownStatusChanged,
    );
    const restakeEventUnsubscribe = this.stakingService.subscribeToRestakedEvent(
      accountAddress,
      onCooldownStatusChanged,
    );

    return async () => {
      try {
        await Promise.all([stakeEventUnsubscribe(), unstakeEventUnsubscribe(), restakeEventUnsubscribe()]);
        return true;
      } catch (e) {
        return false;
      }
    };
  }

  // Move this out to be more functional and testable
  private subscribeToStakeAmountChange(accountAddress: string): () => Promise<boolean> {
    const callbackAdapter = (error: Error, stakedAmountInEvent: string, totalStakedAmount: string) => {
      // TODO : O.L : Handle error
      this.setStakedOrbs(parseInt(totalStakedAmount));
    };

    const stakeEventUnsubscribe = this.stakingService.subscribeToStakedEvent(accountAddress, callbackAdapter);
    const unstakeEventUnsubscribe = this.stakingService.subscribeToUnstakedEvent(accountAddress, callbackAdapter);
    const restakeEventUnsubscribe = this.stakingService.subscribeToRestakedEvent(accountAddress, callbackAdapter);

    return async () => {
      try {
        await Promise.all([stakeEventUnsubscribe(), unstakeEventUnsubscribe(), restakeEventUnsubscribe()]);
        return true;
      } catch (e) {
        return false;
      }
    };
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
