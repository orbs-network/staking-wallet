export interface ICryptoWalletConnectionService {
  readonly hasEthereumProvider: boolean;
  readonly hasEventsSupport: boolean;
  readonly isMetamaskInstalled: boolean;
  readonly isSemiCompliantEthereumProviderInstalled: boolean;

  // Getters
  didUserApproveWalletInThePast: boolean;
  readMainAddress: () => Promise<string>;
  getIsMainNetwork: () => Promise<boolean>;

  requestConnectionPermission: () => Promise<boolean>;

  // Event listeners
  onMainAddressChange: (onChange: (mainAddress: string) => void) => () => void;
}
