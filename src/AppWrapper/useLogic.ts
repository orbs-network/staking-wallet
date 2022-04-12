import { useEffect, useState } from 'react';
import { uiConfig } from '../../config/ui-config';
import useNetwork from '../hooks/useNetwork';
import defaultFavicon from '../../assets/favicons/tet.png';
import { DEFAULT_CHAIN } from '../constants';
import { useAppContext } from '../context/app-context';
import { web3Modal } from '../services/web3modal';

function useLogic() {
  const { chain, forcedChain, chainLoaded } = useNetwork();
  const { setProvider } = useAppContext();
  const [providerLoading, setProviderLoading] = useState(false);
  const selected = forcedChain || chain || DEFAULT_CHAIN;

  const eagerConnect = async () => {
    if (web3Modal.cachedProvider) {
      setProviderLoading(true);
      const newProvider = await web3Modal.connect();
      setProvider(newProvider);
      setProviderLoading(false);
    }
  };

  useEffect(() => {
    eagerConnect();
  }, []);

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
