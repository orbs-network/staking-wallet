import { useLocation } from 'react-router-dom';
import React, { ReactNode, useEffect, useState } from 'react';
import useNetwork from '../components/hooks/useNetwork';
import ProviderWrapper from './ProviderWrapper';
import { addChangeEvents, forceChainChange, isWrongNetwork } from '../utils/web3';
import WrongNetwork from '../components/WrongNetwork';
import { NETWORK_QUERY_PARAM } from '../constants';
interface IProps {
  children: ReactNode;
}

const hideLoader = () => {
  const loader: any = document.querySelector('#centerDiv');
  loader.style.display = 'none';
};

const availableChains = JSON.parse(process.env.TARGET_NETWORKS);

const NetworkWrapper = ({ children }: IProps) => {
  const { chain, noProvider } = useNetwork();
  const location = useLocation();
  const [forcedChain, setForcedChain] = useState<string | undefined>(undefined);
  const [selectedChain, setSelectedChain] = useState<string | undefined>(undefined);

  const detectForcedNetwork = () => {
    const res = new URLSearchParams(location.search).get(NETWORK_QUERY_PARAM);
    setForcedChain(res);
  };

  useEffect(() => {
    detectForcedNetwork();
    addChangeEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chain) {
      setSelectedChain(chain);
      hideLoader();
    }
    if (noProvider) {
      hideLoader();
    }
  }, [chain, forcedChain, noProvider]);

  if (!noProvider && !selectedChain) {
    return null;
  }

  if (isWrongNetwork(selectedChain, availableChains) || forceChainChange(forcedChain, selectedChain)) {
    return <WrongNetwork availableChains={availableChains} selectedChain={Number(selectedChain)} />;
  }

  return <ProviderWrapper chain={selectedChain}>{children}</ProviderWrapper>;
};

export default NetworkWrapper;
