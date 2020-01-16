export interface ICryptoWalletConnectionService {
  readonly isMetamaskInstalled: boolean;

  // Getters
  didUserApproveWalletInThePast: boolean;
  getMainAddress: () => Promise<string>;
  getIsMainNetwork: () => Promise<boolean>;

  requestConnectionPermission: () => Promise<boolean>;

  // Event listeners
  onMainAddressChange: (onChange: (mainAddress: string) => void) => () => void;
}
