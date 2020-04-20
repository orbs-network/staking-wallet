import Web3 from 'web3';
import { ICryptoWalletConnectionService } from './ICryptoWalletConnectionService';
import { IEthereumProvider } from './IEthereumProvider';

// TODO : FUTURE : O.L : Change all ethereum.<call> to the new standard events format.

export class CryptoWalletConnectionService implements ICryptoWalletConnectionService {
  private web3: Web3;
  public readonly hasEthereumProvider: boolean;
  public readonly isMetamaskInstalled: boolean;
  public readonly hasEventsSupport: boolean;

  constructor(private ethereum: IEthereumProvider) {
    this.hasEthereumProvider = this.ethereum !== undefined;

    this.isMetamaskInstalled = this.hasEthereumProvider; // && (this.ethereum.isMetaMask || this.ethereum.isImToken);
    if (this.isMetamaskInstalled) {
      this.web3 = new Web3(this.ethereum as any);
    }

    const on = this.hasEthereumProvider ? (this.ethereum as any).on : undefined;
    this.hasEventsSupport = on !== undefined && on !== null;
  }

  public async requestConnectionPermission(): Promise<boolean> {
    try {
      await this.ethereum.enable();
      return true;
    } catch (e) {
      return false;
    }
  }

  // Getters
  public get didUserApproveWalletInThePast(): boolean {
    // DEV_NOTE : O.L : IMPORTANT ! : This currently works with the soon to be deprecated apis of metamask injected 'ethereum'
    //                                and is not part of the properties in the official types of web3.
    //                                We need to check and find a better way to detect if the user has already approved wallet access.
    // @ts-ignore
    return this.isMetamaskInstalled && !!this.ethereum.selectedAddress;
  }

  async getIsMainNetwork(): Promise<boolean> {
    return this.isMetamaskInstalled && this.ethereum.networkVersion === '1';
  }

  async getMainAddress(): Promise<string> {
    return this.ethereum.selectedAddress;
  }

  // Event listeners
  async onMainAddressChange(onChange: (mainAddress: string) => void): Promise<() => void> {
    const listener = (accounts) => {
      onChange(accounts[0]);
    };

    if (this.hasEventsSupport) {
      this.ethereum.on('accountsChanged', listener);

      return () => {
        this.ethereum.off('accountsChanged', listener);
      };
    } else {
      const accounts = await this.web3.eth.getAccounts();
      listener(accounts);
      this.ethereum.selectedAddress = accounts[0];
    }
  }
}
