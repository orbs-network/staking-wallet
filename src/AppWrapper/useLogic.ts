import { useEffect, useState } from 'react';
import config from '../../config';
import { uiConfig } from '../../config/ui-config';
import { CHAINS } from '../constants';
import useNetwork from '../hooks/useNetwork';
import web3Service from '../services/web3Service';
import { getSupportedChains } from '../utils';
import defaultFavicon from '../../assets/favicons/tet.png';

const availableChains = getSupportedChains();

function useLogic() {
  const { chain, forcedChain, chainLoaded } = useNetwork();
  const [isLoading, setIsLoading] = useState(true);
  const selected = forcedChain || chain;
  const hideLoader = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!selected) {
      return;
    }
    const faviconImage = (uiConfig[selected] && uiConfig[selected].favicon) || defaultFavicon;
      const favicon: any = document.getElementById('favicon');
      favicon.href = faviconImage;
    
  }, [selected]);

  const wrongChain =
    web3Service.isWrongNetwork(chain, availableChains) || web3Service.forceChainChange(forcedChain, chain);

  return { isLoading, chain, forcedChain, chainLoaded, hideLoader, wrongChain };
}

export default useLogic;
