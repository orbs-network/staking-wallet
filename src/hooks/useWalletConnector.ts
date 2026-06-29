import { useContext, useState } from 'react';
import { MobXProviderContext } from 'mobx-react';
import { useAppContext } from '../context/app-context';
import { ConnectWalletOptions, walletConnection, WalletProviderType } from '../services/wallet-connection';

function getConnectionErrorMessage(error: any) {
  const message = error && error.message ? error.message : '';

  if (message.includes('Missing REOWN_PROJECT_ID')) {
    return 'Reown project id is not configured. Please set REOWN_PROJECT_ID and restart the dev server.';
  }

  return message || 'Wallet connection failed. Please try again.';
}

function useWalletConnector() {
  const { chainId } = useContext(MobXProviderContext);
  const { setConnectedWallet } = useAppContext();
  const [connectLoading, setConnectLoading] = useState(false);
  const [rejectedConnection, setRejectedConnection] = useState(false);
  const [connectionErrorMessage, setConnectionErrorMessage] = useState('');
  const [showWrongNetworkPopup, setShowWrongNetworkPopup] = useState(false);
  const [userChainId, setUserChainId] = useState<number | null>(null);

  const connect = async (optionsOrProviderType?: WalletProviderType | ConnectWalletOptions) => {
    setRejectedConnection(false);
    setConnectionErrorMessage('');

    const options =
      typeof optionsOrProviderType === 'string' ? { providerType: optionsOrProviderType } : optionsOrProviderType || {};
    const showBlockingLoader = options.providerType !== 'reown';

    if (showBlockingLoader) {
      setConnectLoading(true);
    }

    try {
      const connectedWallet = await walletConnection.connect({
        ...options,
        targetChainId: Number(chainId),
      });

      if (connectedWallet.chainId !== Number(chainId)) {
        setUserChainId(connectedWallet.chainId);
        setShowWrongNetworkPopup(true);
        await walletConnection.disconnect();
        return false;
      }

      setConnectedWallet(connectedWallet);
      return true;
    } catch (error) {
      walletConnection.clearCachedProvider();
      setRejectedConnection(true);
      setConnectionErrorMessage(getConnectionErrorMessage(error));
      console.error('Wallet connection failed', error);
      return false;
    } finally {
      if (showBlockingLoader) {
        setConnectLoading(false);
      }
    }
  };

  return {
    connect,
    connectLoading,
    rejectedConnection,
    connectionErrorMessage,
    clearConnectionError: () => setConnectionErrorMessage(''),
    showWrongNetworkPopup,
    setShowWrongNetworkPopup,
    userChainId,
  };
}

export default useWalletConnector;
