import { useLocation } from 'react-router-dom';
import React, { ReactNode, useEffect, useState } from 'react';
import useNetwork from '../components/hooks/useNetwork';
import ProviderWrapper from './ProviderWrapper';
import { addChangeEvents, isValidNetwork } from '../utils/web3';
import ForceChangeNetwork from '../components/ForceChangeNetwork';
import InvalidNetwork from '../components/InvalidNetwork';
interface IProps {
  children: ReactNode;
}

const NetworkWrapper = ({ children }: IProps) => {
  const chain = useNetwork();
  const location = useLocation();
  const [forcedChain, setForcedChain] = useState<string | undefined>(undefined);
  const [selectedChain, setSelectedChain] = useState<string | undefined>(undefined);
  const [forceChangeNetwork, setForceChangeNetwork] = useState(false);
  const detectForcedNetwork = () => {
    const res = new URLSearchParams(location.search).get('network');
    setForcedChain(res);
  };

  useEffect(() => {
    detectForcedNetwork();
    addChangeEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chain) {
      return;
    } else if (!forcedChain) {
      setSelectedChain(chain);
    } else if (chain === forcedChain) {
      setSelectedChain(chain);
    } else {
      setForceChangeNetwork(true);
    }
  }, [chain, forcedChain]);

  if (forceChangeNetwork && forcedChain) {
    return <ForceChangeNetwork chain={forcedChain} />;
  }


  if (selectedChain && !isValidNetwork(selectedChain)) {
    return <InvalidNetwork />;
  }

  return <ProviderWrapper chain={selectedChain}>{children}</ProviderWrapper>;
};

export default NetworkWrapper;
