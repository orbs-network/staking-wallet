export interface IEthereumTxService {
  readonly isMetamaskInstalled: boolean;

  // Getters
  didUserApproveWalletAccess: boolean;
  getMainAddress: () => Promise<string>;
  getIsMainNetwork: () => Promise<boolean>;

  requestConnectionPermission: () => Promise<boolean>;

  // Event listeners
  onMainAddressChange: (onChange: (mainAddress: string) => void) => () => void;
  onIsMainNetworkChange: (onChange: (isMainNetwork: boolean) => void) => () => void;
}
