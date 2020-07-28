import { action, computed, observable, reaction } from 'mobx';
import { ICryptoWalletConnectionService } from '../services/cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { IReactionDisposer } from 'mobx/lib/core/reaction';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';

export class CryptoWalletConnectionStore {
  @observable private walletConnectionRequestApproved: boolean;
  @observable private cryptoServiceDataDidUserApproveWalletInThePast: boolean;

  @observable public hasEthereumProvider: boolean;
  @observable public hasEventsSupport: boolean;

  @observable public mainAddress: string;

  private addressCheckingInterval: NodeJS.Timeout;
  reactionToWalletConnection: IReactionDisposer;
  unsubscribeFromMainAddressChange: () => void;


  constructor(
    private cryptoWalletConnectionService: ICryptoWalletConnectionService,
    private analyticsService: IAnalyticsService,
  ) {
    this.hasEthereumProvider = cryptoWalletConnectionService.hasEthereumProvider;
    this.hasEventsSupport = cryptoWalletConnectionService.hasEventsSupport;

    this.reactionToWalletConnection = reaction(
      () => this.isConnectedToWallet,
      async (isConnected) => {
        if (isConnected) {
          this.readInformationFromConnectedWallet();
        }
      },
      {
        fireImmediately: true,
      },
    );

    if (this.hasEthereumProvider) {
      // We will only detect address change if the Ethereum provider can support it
      if (this.cryptoWalletConnectionService.hasEventsSupport) {
        console.log('Supports events');
        // this.unsubscribeFromMainAddressChange = this.cryptoWalletConnectionService.onMainAddressChange((address) => this.handleMainAddressChange(address));
        this.unsubscribeFromMainAddressChange = this.cryptoWalletConnectionService.onMainAddressChange((address) => this.readInformationFromConnectedWallet());
      } else {
        console.warn('This Ethereum provider has no event support.');
        // Else, we will read it one time + set an interval
        this.cryptoWalletConnectionService.readMainAddress().then((address) => this.setMainAddress(address));

        this.addressCheckingInterval = setInterval(
          () => this.cryptoWalletConnectionService.readMainAddress().then((address) => this.setMainAddress(address)),
          1000,
        );
      }
    }
  }

  private handleMainAddressChange(newAddress : string) {
    console.log('New address', newAddress);
    // We need to re-check if the user has approved the app.
    this.setMainAddress(newAddress);

    console.log('Is connected ? ', this.isConnectedToWallet)

    this.copyDataFromCryptoWalletService();

    console.log('Is connected ? ', this.isConnectedToWallet)
  }

  private copyDataFromCryptoWalletService() {
    console.log('Crypto service, did user approve', this.cryptoWalletConnectionService.didUserApproveWalletInThePast);
    this.setCryptoServiceDataDidUserApproveWalletInThePast(this.cryptoWalletConnectionService.didUserApproveWalletInThePast);
  }

  @computed
  public get isConnectedToWallet(): boolean {
    return (
      this.hasEthereumProvider &&
      (this.cryptoServiceDataDidUserApproveWalletInThePast || this.walletConnectionRequestApproved)
    );
  }

  public async askToConnect(): Promise<boolean> {
    if (this.isConnectedToWallet) {
      return true;
    } else {
      const permissionGranted = await this.cryptoWalletConnectionService.requestConnectionPermission();
      this.setWalletConnectionRequestApproved(permissionGranted);

      return this.walletConnectionRequestApproved;
    }
  }

  private async readInformationFromConnectedWallet() {
    console.log('Reading information from connected wallet');
    const walletAddress = await this.cryptoWalletConnectionService.readMainAddress();
    console.log('Wallet address is ', walletAddress);

    this.copyDataFromCryptoWalletService();

    this.setMainAddress(walletAddress);
  }

  @action('setWalletConnectionRequestApproved')
  private setWalletConnectionRequestApproved(requestApproved: boolean) {
    this.walletConnectionRequestApproved = requestApproved;
  }

  @action('setMainAddress')
  private setMainAddress(mainAddress: string) {
    this.mainAddress = mainAddress;

    this.analyticsService.setUserAddress(mainAddress);
  }

  @action('setCryptoServiceDataDidUserApproveWalletInThePast')
  private setCryptoServiceDataDidUserApproveWalletInThePast(didUserApproveWalletInThePast) {
    this.cryptoServiceDataDidUserApproveWalletInThePast = didUserApproveWalletInThePast;
  }
}
