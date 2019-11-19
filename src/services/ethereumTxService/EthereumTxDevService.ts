import { IEthereumTxService } from './EthereumTxService';

export interface IEthereumTxDevService extends IEthereumTxService {
  setIsAvailable: (isAvailable: boolean) => void;
}

export class EthereumTxDevService implements IEthereumTxDevService {
  getMainAddress: () => Promise<string>;
  isEthereumAvailable: boolean;
  onIsMainNetworkChange: (onChange: (mainAddress: string) => void) => void;
  onMainAddressChange: (onChange: (mainAddress: string) => void) => void;
  requestConnectionPermissions: () => Promise<boolean>;


  setIsAvailable: (isAvailable: boolean) => void;
}