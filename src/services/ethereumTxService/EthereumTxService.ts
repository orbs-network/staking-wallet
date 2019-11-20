import Web3 from 'web3';
import { IEthereumTxService } from './IEthereumTxService';
import { HttpProvider } from 'web3-core';

export class EthereumTxService implements IEthereumTxService {
  private ethereum;
  private web3: Web3;
  public readonly isAvailable: boolean;

  constructor() {
    this.ethereum = (window as any).ethereum;
    this.isAvailable = this.ethereum !== undefined;
    if (this.isAvailable) {
      this.web3 = new Web3(this.ethereum);
    }
  }

  public async requestConnectionPermission() {
    // this.ensureEthereumProvider();

    try {
      await this.ethereum.enable();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Getters
  public get didUserApproveWalletAccess(): boolean {
    // DEV_NOTE : O.L : IMPORTANT ! : This currently works with the soon to be deprecated apis of metamask injected 'ethereum'
    //                                and is not part of the properties in the official types of web3.
    //                                We need to check and find a better way to detect if the user has already approved wallet access.
    // @ts-ignore
    return this.isAvailable && !!this.web3.currentProvider.selectedAddress;
  }

  getIsMainNetwork: () => Promise<boolean>;
  getMainAddress: () => Promise<string>;

  // Event listeners
  onMainAddressChange: (onChange: (mainAddress: string) => void) => () => void;
  onIsMainNetworkChange: (onChange: (isMainNetwork: boolean) => void) => () => void;

  private ensureEthereumProvider() {
    if (!this.isAvailable) {
      throw new Error(`Tried using 'EthereumTxService' but no ethereum provider exists`);
    }
  }
}
