import { action, computed, observable } from 'mobx';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';

export interface ICryptoWalletIntegrationStoreState {
  // Connection flags
  hasEthereumProvider: boolean;
  hasWalletPermissions: boolean;
  isConnectedToWallet: boolean;

  // account data
  mainAddress: string;
  liquidOrbs: number;
  accumulatedRewards: number; // DEV_NOTE : O.L : Consider moving this to a different store
}

export interface ICryptoWalletIntegrationStoreActions {
  askToConnect: () => Promise<boolean>;
}

export const defaultPosStoreState: ICryptoWalletIntegrationStoreState = {
  hasEthereumProvider: false,
  hasWalletPermissions: false,
  isConnectedToWallet: false,

  mainAddress: '',
  liquidOrbs: 0,
  accumulatedRewards: 0,
};

export type TCryptoWalletIntegrationStore = ICryptoWalletIntegrationStoreState & ICryptoWalletIntegrationStoreActions;

export class CryptoWalletIntegrationStore implements TCryptoWalletIntegrationStore {
  @observable public hasEthereumProvider: boolean;
  @observable public hasWalletPermissions: boolean;

  @observable public mainAddress: string;
  @observable public liquidOrbs: number;
  @observable public accumulatedRewards: number;

  constructor(private ethereumTxService: IEthereumTxService) {
    this.hasEthereumProvider = ethereumTxService.isAvailable;
    this.hasWalletPermissions = ethereumTxService.didUserApproveWalletAccess;
  }

  @computed
  public get isConnectedToWallet(): boolean {
    return this.hasEthereumProvider && this.hasWalletPermissions;
  }

  public askToConnect(): Promise<boolean> {
    return this.ethereumTxService.requestConnectionPermission();
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
