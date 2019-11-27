import { action, observable, reaction } from 'mobx';
import { CryptoWalletIntegrationStore } from './CryptoWalletIntegrationStore';
import { IOrbsPOSDataService } from 'orbs-pos-data';

export class OrbsAccountStore {
  @observable public liquidOrbs: string;
  @observable public stakedOrbs: number;
  @observable public accumulatedRewards: number;

  constructor(
    private cryptoWalletIntegrationStore: CryptoWalletIntegrationStore,
    private orbsPOSDataService: IOrbsPOSDataService,
  ) {
    const addressChangeReaction = reaction(
      () => this.cryptoWalletIntegrationStore.mainAddress,
      async address => {
        if (address) {
          const liquidOrbs = await this.orbsPOSDataService.getOrbsBalance(address);
          this.setLiquidOrbs(liquidOrbs);
        }
      },
      {
        fireImmediately: true,
      },
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
