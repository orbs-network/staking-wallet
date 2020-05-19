import { IEthereumProvider } from '../cryptoWalletConnectionService/IEthereumProvider';
import { TEthereumProviderName } from './IAnalyticsService';

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
