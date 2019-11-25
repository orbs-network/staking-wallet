import Web3 from 'web3';
import { IEthereumTxService } from './IEthereumTxService';
import { IEthereumProvider } from './IEthereumProvider';
import { ThemeProvider } from '@material-ui/styles';

export class EthereumTxService implements IEthereumTxService {
  private web3: Web3;
  public readonly isMetamaskInstalled: boolean;

  constructor(private ethereum: IEthereumProvider) {
    this.isMetamaskInstalled = this.ethereum !== undefined;
    if (this.isMetamaskInstalled) {
      this.web3 = new Web3(this.ethereum as any);
    }
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

  getMainAddress(): string {
    return this.ethereum.selectedAddress;
  }

  // Event listeners
  onMainAddressChange: (onChange: (mainAddress: string) => void) => () => void;
}
