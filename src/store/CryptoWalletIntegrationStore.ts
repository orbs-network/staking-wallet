import { action, computed, observable } from 'mobx';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';

export class CryptoWalletIntegrationStore {
  @observable public isMetamaskInstalled: boolean;
  @observable public hasWalletPermissions: boolean;

  @observable public mainAddress: string;
  @observable public liquidOrbs: number;
  @observable public accumulatedRewards: number;

  constructor(private ethereumTxService: IEthereumTxService) {
    this.isMetamaskInstalled = ethereumTxService.isMetamaskInstalled;
    this.hasWalletPermissions = ethereumTxService.didUserApproveWalletAccess;
  }

  @computed
  public get isConnectedToWallet(): boolean {
    return this.isMetamaskInstalled && this.hasWalletPermissions;
  }

  public async askToConnect(): Promise<boolean> {
    const success = await this.ethereumTxService.requestConnectionPermission();

    if (success) {
      this.hasWalletPermissions = true;
    }

    return success;
  }

  @action('setMainAddress')
  private setMainAddress(mainAddress: string) {
    this.mainAddress = mainAddress;
  }

  @action('setLiquidOrbs')
  private setLiquidOrbs(liquidOrbs: number) {
    this.liquidOrbs = liquidOrbs;
  }

  @action('setLiquidOrbs')
  private setAccumulatedRewards(accumulatedRewards: number) {
    this.accumulatedRewards = accumulatedRewards;
  }
}
