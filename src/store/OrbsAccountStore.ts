import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { CryptoWalletIntegrationStore } from './CryptoWalletIntegrationStore';
import { IOrbsPOSDataService } from 'orbs-pos-data';

export class OrbsAccountStore {
  @observable public liquidOrbs: string;
  @observable public stakedOrbs: number;
  @observable public accumulatedRewards: number;

  private addressChangeReaction: IReactionDisposer;
  private orbsBalanceChangeUnsubscribeFunction: () => void;

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletIntegrationStore,
    private orbsPOSDataService: IOrbsPOSDataService,
  ) {
    this.addressChangeReaction = reaction(
      () => this.cryptoWalletIntegrationStore.mainAddress,
      async address => {
        if (address) {
          await this.readDataForAccount(address);
          this.refreshAccountListeners(address);
        }
      },
      {
        fireImmediately: true,
      },
    );
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
}
