import { computed, observable } from 'mobx';
import { IEthereumTxService } from '../services/ethereumTxService/IEthereumTxService';

export interface ICryptoWalletIntegrationStoreState {
  hasEthereumProvider: boolean;
  hasWalletPermissions: boolean;
  isConnectedToWallet: boolean;
}

export interface ICryptoWalletIntegrationStoreActions {
  askToConnect: () => Promise<boolean>;
}

export const defaultPosStoreState: ICryptoWalletIntegrationStoreState = {
  hasEthereumProvider: false,
  hasWalletPermissions: false,
  isConnectedToWallet: false,
};

export type TCryptoWalletIntegrationStore = ICryptoWalletIntegrationStoreState & ICryptoWalletIntegrationStoreActions;

export class CryptoWalletIntegrationStore implements TCryptoWalletIntegrationStore {
  @observable public hasEthereumProvider: boolean;
  @observable public hasWalletPermissions: boolean;

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
}
