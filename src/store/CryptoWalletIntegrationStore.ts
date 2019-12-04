import { action, computed, observable } from 'mobx';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';

export class CryptoWalletIntegrationStore {
  @observable private walletConnectionRequestApproved: boolean;

  @observable public isMetamaskInstalled: boolean;

  @observable public mainAddress: string;

  constructor(private ethereumTxService: IEthereumTxService) {
    this.isMetamaskInstalled = ethereumTxService.isMetamaskInstalled;

    if (this.isMetamaskInstalled) {
      this.ethereumTxService.onMainAddressChange(address => this.setMainAddress(address));

      if (this.isConnectedToWallet) {
        this.readInformationFromConnectedWallet();
      }
    }
  }

  @computed
  public get isConnectedToWallet(): boolean {
    return (
      this.isMetamaskInstalled &&
      (this.ethereumTxService.didUserApproveWalletInThePast || this.walletConnectionRequestApproved)
    );
  }

  public async askToConnect(): Promise<boolean> {
    if (this.isConnectedToWallet) {
      return true;
    } else {
      const permissionGranted = await this.ethereumTxService.requestConnectionPermission();
      this.setWalletConnectionRequestApproved(permissionGranted);

      if (permissionGranted) {
        this.readInformationFromConnectedWallet();
      }

      return this.walletConnectionRequestApproved;
    }
  }

  private async readInformationFromConnectedWallet() {
    const walletAddress = await this.ethereumTxService.getMainAddress();

    this.setMainAddress(walletAddress);
  }

  @action('setWalletConnectionRequestApproved')
  private setWalletConnectionRequestApproved(requestApproved: boolean) {
    this.walletConnectionRequestApproved = requestApproved;
  }

  @action('setMainAddress')
  private setMainAddress(mainAddress: string) {
    this.mainAddress = mainAddress;
  }
}
