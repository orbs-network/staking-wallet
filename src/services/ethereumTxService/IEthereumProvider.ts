export type TNetworkVersion = '1' | '2' | '3' | '4' | '5' | '42';
export interface IEthereumProvider {
  enable(): Promise<void>;
  selectedAddress: string;
  networkVersion: TNetworkVersion;
}
