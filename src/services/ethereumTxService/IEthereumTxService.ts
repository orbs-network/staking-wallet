export interface IEthereumTxService {
  // Getters
  isEthereumAvailable: boolean;
  getMainAddress: () => Promise<string>;

  // Permissions
  // TODO : ORL : Update to a better name&signature
  requestConnectionPermissions: () => Promise<boolean>;

  // Event listeners
  onMainAddressChange: (onChange: (mainAddress: string) => void) => void;
  onIsMainNetworkChange: (onChange: (mainAddress: string) => void) => void;
}
