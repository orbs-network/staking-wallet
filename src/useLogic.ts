import { useEffect, useRef, useState } from 'react';
import initApp from './init';
import Web3Service from './services/Web3Service';
import { isSupportedChain } from './utils/web3';
import useLanguage from './components/hooks/useLanguage';

const ethProvider = (window as any).ethereum;

function useLogic() {
  useLanguage();
  const [services, setServices] = useState(undefined);
  const [stores, setStores] = useState(null);
  const [selectedChain, setSelectedChain] = useState<number | undefined>(undefined);
  const [notSupportedChain, setNotSupportedChain] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const web3Service = useRef<undefined | Web3Service>(undefined);

  const createStoresAndServices = async (chain: number) => {
    try {
      const res = await initApp(chain);
      setServices(res.services);
      setStores(res.stores);
      setSelectedChain(chain);
    } catch (error) {
      console.log(error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleNewChain = async () => {
    const result = await web3Service.current.getChainId();
    const isSupported = isSupportedChain(result);
    if (isSupported) {
      createStoresAndServices(result);
    } else {
      setNotSupportedChain(true);
      setAppLoading(false);
    }
  };

  const onChainChanged = () => {
    setNotSupportedChain(false);
    setServices(undefined);
    setStores(undefined);
    handleNewChain();
  };

  useEffect(() => {
    if (!ethProvider) {
      return;
    }
    web3Service.current = new Web3Service(ethProvider);
    web3Service.current.onNetworkChange(onChainChanged);
    web3Service.current.onAccountsChanged(onChainChanged);

    handleNewChain();
  }, []);

  return {
    services,
    stores,
    selectedChain,
    notSupportedChain,
    appLoading,
    web3Service: web3Service.current,
    noEthProvider: !ethProvider,
  };
}

export default useLogic;
