import { IEthereumProvider, TNetworkVersion } from '../../services/ethereumTxService/IEthereumProvider';

export class EthereumProviderMock implements IEthereumProvider {
  private shouldApproveFutureEnable = true;

  public selectedAddress: string = null;
  public networkVersion: TNetworkVersion = '1';

  async enable(): Promise<void> {
    if (this.shouldApproveFutureEnable) {
      this.selectedAddress = 'DUMMY_ADDRESS';
    } else {
      this.selectedAddress = null;
      throw new Error('User rejected');
    }
  }

  public rejectNextEnable(): void {
    this.shouldApproveFutureEnable = false;
  }

  public setSelectedAddress(selectedAddress): void {
    this.selectedAddress = selectedAddress;
  }
}
