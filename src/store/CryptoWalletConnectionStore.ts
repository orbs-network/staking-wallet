import { action, computed, observable, reaction } from 'mobx';
import { IReactionDisposer } from 'mobx/lib/core/reaction';
import { IAnalyticsService } from '../services/analytics/IAnalyticsService';
import { ICryptoWalletConnectionService } from '@orbs-network/contracts-js';
import errorMonitoring from '../services/error-monitoring';
import { hasInjectedProvider } from '../constants';

export class CryptoWalletConnectionStore {
  @observable private walletConnectionRequestApproved: boolean;

  @observable public hasEthereumProvider: boolean;
  @observable public hasEventsSupport: boolean;
  @observable public isConnected: boolean;

  @observable public mainAddress: string

  private addressCheckingInterval: NodeJS.Timeout;
  reactionToWalletConnection: IReactionDisposer;

  constructor(
    private cryptoWalletConnectionService: ICryptoWalletConnectionService,
    private analyticsService: IAnalyticsService,
    isMetamask: boolean,
  ) {
    
    this.hasEthereumProvider = hasInjectedProvider;
    this.hasEventsSupport = isMetamask;

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
  }

  



  

  @computed
  public get isConnectedToWallet(): boolean {
    return this.isConnected
  }




  public async askToConnect(): Promise<boolean> {
    if (this.isConnectedToWallet) {
      return true;
    } else {
      try {
        
        this.setWalletConnectionRequestApproved(true);
       
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
  @action('setIsConnected')
  public setIsConnected = (val: boolean) => {
    this.isConnected = val
  }

  @action('setMainAddress')
  public setMainAddress(mainAddress: string) {
    
    this.mainAddress = mainAddress;

    this.analyticsService.setUserAddress(mainAddress);
  }
}
