import { IEthereumProvider } from '../../services/ethereumTxService/IEthereumProvider';

export class EthereumProviderMock implements IEthereumProvider {
  public selectedAddress: string;

  async enable(): Promise<void> {}
}
