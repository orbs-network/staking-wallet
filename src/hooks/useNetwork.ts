import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { DEFAULT_CHAIN, NETWORK_QUERY_PARAM } from '../constants';
import web3Service from '../services/web3Service';
import { getSupportedChains } from '../utils';

const detectForcedNetwork = (location) => {
  const network = new URLSearchParams(location.search).get(NETWORK_QUERY_PARAM);
  if (network) {
    return Number(network);
  }
};

const useNetwork = (): {
  chain: number | undefined;
  noProvider: boolean;
  forcedChain: number | undefined;
  chainLoaded: boolean;
} => {
  const location = useLocation();
  const [chain, setChain] = useState<number | undefined>(undefined);
  const [noProvider, setNoProvider] = useState<boolean>(false);
  const [forcedChain, setForcedChain] = useState<number | undefined>(undefined);
  const [chainLoaded, setChainLoaded] = useState(false);
  const getChain = async () => {
    try {
      const result = await web3Service.getChainId();
      setChain(result);
    } catch (error) {
      console.error('error in getting chainId');
    } finally {
      setChainLoaded(true);
    }
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setNoProvider(true);
      setChainLoaded(true);
    } else {
      getChain();
    }
    const forced = detectForcedNetwork(location);
    const availableChains = getSupportedChains();
    if (forced) {
      setForcedChain(availableChains.includes(forced) ? forced : Number(DEFAULT_CHAIN));
    }
  }, []);

  return { chain, noProvider, forcedChain, chainLoaded };
};

export default useNetwork;
