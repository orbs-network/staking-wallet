import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { DEFAULT_CHAIN, NETWORK_QUERY_PARAM, PENDING_NETWORK_SWITCH_CHAIN_KEY } from '../constants';
import web3Service from '../services/web3Service';
import { getSupportedChains } from '../utils';
import useWeb3 from './useWeb3';

const detectForcedNetwork = (location) => {
  const network = new URLSearchParams(location.search).get(NETWORK_QUERY_PARAM);
  if (network) {
    return Number(network);
  }
};

const getValidForcedNetwork = (location) => {
  const forced = detectForcedNetwork(location);
  const availableChains = getSupportedChains();

  if (!forced) {
    return undefined;
  }

  return availableChains.includes(forced) ? forced : Number(DEFAULT_CHAIN);
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
  const [forcedChain, setForcedChain] = useState<number | undefined>(() => getValidForcedNetwork(location));
  const [chainLoaded, setChainLoaded] = useState(false);
  const {getChainId, provider} = useWeb3()
  const getChain = async () => {
    try {
      const result = await getChainId();
      setChain(result);
    } catch (error) {
      console.error('error in getting chainId');
    } finally {
      setChainLoaded(true);
    }
  };

  useEffect(() => {
  
    if (!provider) {
      setNoProvider(true);
      setChainLoaded(true);
    } else {
      getChain();
    }
    const forced = getValidForcedNetwork(location);
    if (forced) {
      setForcedChain(forced);
      if (window.sessionStorage.getItem(PENDING_NETWORK_SWITCH_CHAIN_KEY) === String(forced)) {
        window.sessionStorage.removeItem(PENDING_NETWORK_SWITCH_CHAIN_KEY);
      }
    }
  }, []);


  

  return { chain, noProvider, forcedChain, chainLoaded };
};

export default useNetwork;
