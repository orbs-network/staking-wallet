import { useCallback, useEffect, useRef, useState } from 'react';
import { uiConfig } from '../../config/ui-config';
import useNetwork from '../hooks/useNetwork';
import defaultFavicon from '../../assets/favicons/tet.png';
import { DEFAULT_CHAIN } from '../constants';
import { useAppContext } from '../context/app-context';
import { walletConnection } from '../services/wallet-connection';

function useLogic() {
  const { chain, forcedChain, chainLoaded } = useNetwork();
  const { setConnectedWallet } = useAppContext();
  const [providerLoading, setProviderLoading] = useState(false);
  const selected = forcedChain || chain || DEFAULT_CHAIN;
  const restoreTarget = forcedChain || chain || (chainLoaded ? DEFAULT_CHAIN : undefined);
  const restoredTargetRef = useRef<number | undefined>(undefined);

  const eagerConnect = useCallback(
    async (targetChainId: number) => {
      setProviderLoading(true);
      try {
        const connectedWallet = await walletConnection.restore({ targetChainId });
        if (connectedWallet && connectedWallet.chainId === Number(targetChainId)) {
          setConnectedWallet(connectedWallet);
        } else if (connectedWallet) {
          await walletConnection.disconnect();
        }
      } catch (error) {
        walletConnection.clearCachedProvider();
      } finally {
        setProviderLoading(false);
      }
    },
    [setConnectedWallet],
  );

  useEffect(() => {
    if (!chainLoaded || !restoreTarget || restoredTargetRef.current === restoreTarget) {
      return;
    }

    restoredTargetRef.current = restoreTarget;
    eagerConnect(restoreTarget);
  }, [chainLoaded, restoreTarget, eagerConnect]);

  useEffect(() => {
    if (!selected) {
      return;
    }
    const faviconImage = (uiConfig[selected] && uiConfig[selected].favicon) || defaultFavicon;
    const favicon: any = document.getElementById('favicon');
    favicon.href = faviconImage;
  }, [selected]);

  return {
    isLoading: !chainLoaded || providerLoading,
    chain: selected,
  };
}

export default useLogic;
