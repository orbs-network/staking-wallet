import { IEthereumTxService } from './IEthereumTxService';

export interface IEthereumTxDevService extends IEthereumTxService {
  setIsAvailable: (isAvailable: boolean) => void;
}

export class EthereumTxDevService implements IEthereumTxDevService {
  didUserApproveWalletAccess: boolean;
  getIsMainNetwork: () => Promise<boolean>;
  getMainAddress: () => Promise<string>;
  readonly isAvailable: boolean;
  onIsMainNetworkChange: (onChange: (isMainNetwork: boolean) => void) => () => void;
  onMainAddressChange: (onChange: (mainAddress: string) => void) => () => void;
  requestConnectionPermission: () => Promise<boolean>;
  setIsAvailable: (isAvailable: boolean) => void;
}
