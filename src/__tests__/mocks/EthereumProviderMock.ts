import { IEthereumProvider } from '../../services/ethereumTxService/IEthereumProvider';

export class EthereumProviderMock implements IEthereumProvider {
  public selectedAddress: string = null;
  private shouldApproveFutureEnable = true;

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
}
