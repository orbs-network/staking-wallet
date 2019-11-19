import Web3 from 'web3';
import { IEthereumTxService } from './IEthereumTxService';

export class EthereumTxService implements IEthereumTxService {
  private web3: Web3;
  private isAvailable: boolean;

  constructor(private ethereum: any) {
    this.web3 = new Web3(ethereum);
  }

  get isEthereumAvailable(): boolean {
    return this.isAvailable;
  }

  getMainAddress: () => Promise<string>;
  onIsMainNetworkChange: (onChange: (mainAddress: string) => void) => void;
  onMainAddressChange: (onChange: (mainAddress: string) => void) => void;
  requestConnectionPermissions: () => Promise<boolean>;
}
