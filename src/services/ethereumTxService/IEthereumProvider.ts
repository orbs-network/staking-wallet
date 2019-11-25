export interface IEthereumProvider {
  enable(): Promise<void>;
  selectedAddress: string;
}
