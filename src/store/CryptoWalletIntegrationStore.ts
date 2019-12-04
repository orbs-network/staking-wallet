import { action, computed, observable } from 'mobx';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';

export class CryptoWalletIntegrationStore {
  @observable private requestApproved: boolean;

  @observable public isMetamaskInstalled: boolean;

  @observable public mainAddress: string;

  constructor(private ethereumTxService: IEthereumTxService) {
    this.isMetamaskInstalled = ethereumTxService.isMetamaskInstalled;

    if (this.isMetamaskInstalled) {
      this.ethereumTxService.onMainAddressChange(address => this.setMainAddress(address));
    }
  }

  @computed
  public get isConnectedToWallet(): boolean {
    return this.isMetamaskInstalled && (this.ethereumTxService.didUserApproveWalletInThePast || this.requestApproved);
  }

  public async askToConnect(): Promise<boolean> {
    const result = await this.ethereumTxService.requestConnectionPermission();
    this.setRequestApproved(result);
    return this.requestApproved;
  }

  @action('setRequestApproved')
  private setRequestApproved(requestApproved: boolean) {
    this.requestApproved = requestApproved;
  }

  @action('setMainAddress')
  private setMainAddress(mainAddress: string) {
    this.mainAddress = mainAddress;
  }
}
