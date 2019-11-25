import { action, computed, observable } from 'mobx';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';
import { ThemeProvider } from '@material-ui/styles';

export class CryptoWalletIntegrationStore {
  @observable private requestApproved: boolean;

  @observable public isMetamaskInstalled: boolean;

  @observable public mainAddress: string;
  @observable public liquidOrbs: number;
  @observable public stakedOrbs: number;
  @observable public accumulatedRewards: number;

  constructor(private ethereumTxService: IEthereumTxService) {
    this.isMetamaskInstalled = ethereumTxService.isMetamaskInstalled;
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
