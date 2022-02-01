import { useState } from 'react';
import useNetwork from '../hooks/useNetwork';
import web3Service from '../services/web3Service';
import { getSupportedChains } from '../utils';

const availableChains = getSupportedChains();

function useLogic() {
  const { chain, forcedChain, chainLoaded } = useNetwork();
  const [isLoading, setIsLoading] = useState(true);

  const hideLoader = () => {
    setIsLoading(false);
  };

  const wrongChain =
    web3Service.isWrongNetwork(chain, availableChains) || web3Service.forceChainChange(forcedChain, chain);

  return { isLoading, chain, forcedChain, chainLoaded, hideLoader, wrongChain };
}

export default useLogic;
