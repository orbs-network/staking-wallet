import Web3 from 'web3';
import { IEthereumTxService } from './IEthereumTxService';
import { HttpProvider } from 'web3-core';

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
  public get didUserApproveWalletAccess(): boolean {
    // DEV_NOTE : O.L : IMPORTANT ! : This currently works with the soon to be deprecated apis of metamask injected 'ethereum'
    //                                and is not part of the properties in the official types of web3.
    //                                We need to check and find a better way to detect if the user has already approved wallet access.
    // @ts-ignore
    return !!this.web3.currentProvider.selectedAddress;
  }

  getIsMainNetwork: () => Promise<boolean>;
  getMainAddress: () => Promise<string>;

  // Event listeners
  onMainAddressChange: (onChange: (mainAddress: string) => void) => () => void;
  onIsMainNetworkChange: (onChange: (isMainNetwork: boolean) => void) => () => void;
}
