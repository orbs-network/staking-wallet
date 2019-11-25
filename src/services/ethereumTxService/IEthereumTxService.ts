export interface IEthereumTxService {
  readonly isMetamaskInstalled: boolean;

  // Getters
  didUserApproveWalletInThePast: boolean;
  getMainAddress: () => string;
  getIsMainNetwork: () => Promise<boolean>;

  requestConnectionPermission: () => Promise<boolean>;

  // Event listeners
  onMainAddressChange: (onChange: (mainAddress: string) => void) => () => void;
}
