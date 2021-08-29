import { action, computed, observable, reaction } from 'mobx';
import { IReactionDisposer } from 'mobx/lib/core/reaction';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';
import { ICryptoWalletConnectionService } from '@orbs-network/contracts-js';
import errorMonitoring from '../services/error-monitoring';

export class CryptoWalletConnectionStore {
  @observable private walletConnectionRequestApproved: boolean;

  @observable public hasEthereumProvider: boolean;
  @observable public hasEventsSupport: boolean;

  @observable public mainAddress: string;

  private addressCheckingInterval: NodeJS.Timeout;
  reactionToWalletConnection: IReactionDisposer;

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
        this.cryptoWalletConnectionService.onMainAddressChange((address) => this.setMainAddress(address));
      } else {
        // Else, we will read it one time + set an interval
        this.cryptoWalletConnectionService.readMainAddress().then((address) => this.setMainAddress(address));

        this.addressCheckingInterval = setInterval(
          () => this.cryptoWalletConnectionService.readMainAddress().then((address) => this.setMainAddress(address)),
          1000,
        );
      }
    }
  }

  @computed
  public get isConnectedToWallet(): boolean {
    return this.hasEthereumProvider;
  }

  public async askToConnect(): Promise<boolean> {
    if (this.isConnectedToWallet) {
      return true;
    } else {
      try {
        const permissionGranted = await this.cryptoWalletConnectionService.requestConnectionPermission();
        this.setWalletConnectionRequestApproved(permissionGranted);
        return this.walletConnectionRequestApproved;
      } catch (error) {
        const { captureException, sections } = errorMonitoring;
        captureException(error, sections.walletConnectionStore, 'error in function: askToConnect');
      }
    }
  }

  private async readInformationFromConnectedWallet() {
    try {
      const walletAddress = await this.cryptoWalletConnectionService.readMainAddress();
      this.setMainAddress(walletAddress);
    } catch (error) {
      const { captureException, sections } = errorMonitoring;
      captureException(error, sections.walletConnectionStore, 'error in function: readInformationFromConnectedWallet');
    }
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
}
