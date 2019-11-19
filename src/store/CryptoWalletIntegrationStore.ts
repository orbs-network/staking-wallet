import { observable } from 'mobx';
import { IEthereumTxService } from '../services/ethereumTxService/EthereumTxService';

export interface ICryptoWalletIntegrationStoreState {
  isConnectedToWallet: boolean;
}

export const defaultPosStoreState: ICryptoWalletIntegrationStoreState = {
  isConnectedToWallet: false,
};

export type TCryptoWalletIntegrationStore = ICryptoWalletIntegrationStoreState;

export class CryptoWalletIntegrationStore implements TCryptoWalletIntegrationStore {
  @observable public isConnectedToWallet: boolean;

  constructor(private ethereumTxService: IEthereumTxService) {
    this.isConnectedToWallet = ethereumTxService.isEthereumAvailable;
  }
}
