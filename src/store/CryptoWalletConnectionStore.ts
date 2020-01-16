import { action, computed, observable, reaction } from 'mobx';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';
import { IReactionDisposer } from 'mobx/lib/core/reaction';

export class CryptoWalletConnectionStore {
  @observable private walletConnectionRequestApproved: boolean;

  @observable public isMetamaskInstalled: boolean;

  @observable public mainAddress: string;

  reactionToWalletConnection: IReactionDisposer;

  constructor(private ethereumTxService: IEthereumTxService) {
    this.isMetamaskInstalled = ethereumTxService.isMetamaskInstalled;

    this.reactionToWalletConnection = reaction(
      () => this.isConnectedToWallet,
      async isConnected => {
        if (isConnected) {
          this.readInformationFromConnectedWallet();
        }
      },
      {
        fireImmediately: true,
      },
    );

    if (this.isMetamaskInstalled) {
      this.ethereumTxService.onMainAddressChange(address => this.setMainAddress(address));
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
