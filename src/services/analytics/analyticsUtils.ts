import { TEthereumProviderName } from './IAnalyticsService';
import { IEthereumProvider } from '@orbs-network/contracts-js';

export function detectEthereumProviderName(ethereum: IEthereumProvider): TEthereumProviderName {
  const ethereumProviderName: TEthereumProviderName = ethereum.isMetaMask
    ? 'MetaMask'
    : ethereum.isTrust
    ? 'Trust Wallet'
    : ethereum.isImToken
    ? 'ImToken'
    : 'Unknown Ethereum provider';

  return ethereumProviderName;
}
