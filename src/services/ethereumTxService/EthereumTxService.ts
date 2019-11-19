import Web3 from 'web3';
import { IEthereumTxService } from './IEthereumTxService';

export class EthereumTxService implements IEthereumTxService {
  private web3: Web3;
  public readonly isAvailable: boolean;

  constructor() {
    const ethereum = (window as any).ethereum;
    this.isAvailable = ethereum !== undefined;
    if (this.isAvailable) {
      this.web3 = new Web3(ethereum);
    }
  }

  requestConnectionPermission: () => Promise<boolean>;

  // Getters
  getIsMainNetwork: () => Promise<boolean>;
  getMainAddress: () => Promise<string>;

  // Event listeners
  onIsMainNetworkChange: (onChange: (isMainNetwork: boolean) => void) => void;
  onMainAddressChange: (onChange: (mainAddress: string) => void) => void;
}
