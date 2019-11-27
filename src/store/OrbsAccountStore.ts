import { action, observable } from 'mobx';
import { CryptoWalletIntegrationStore } from './CryptoWalletIntegrationStore';
import { IOrbsPOSDataService } from 'orbs-pos-data';

export class OrbsAccountStore {
  @observable public liquidOrbs: number;
  @observable public stakedOrbs: number;
  @observable public accumulatedRewards: number;

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletIntegrationStore,
    private orbsPOSDataService: IOrbsPOSDataService,
  ) {}

  @action('setLiquidOrbs')
  private setLiquidOrbs(liquidOrbs: number) {
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
