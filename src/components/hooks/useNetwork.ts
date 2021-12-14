import { useEffect, useState } from 'react';
import Web3 from 'web3';
import config from '../../config';

const useNetwork = (): string | undefined => {
  const [chain, setChain] = useState<string | undefined>(undefined);

  const getChainId = async (ethereum: any) => {
    try {
      const web3 = new Web3(ethereum);
      const chainId = await web3.eth.getChainId();
      if (!chainId) return;
      setChain(chainId.toString());
    } catch (error) {
      console.error('error in getting chainId');
    }
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    getChainId(ethereum).then();
  }, []);
  return chain;
};

export default useNetwork;
