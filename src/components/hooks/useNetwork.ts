import { useEffect, useState } from 'react';
import Web3 from 'web3';

const useNetwork = (): { chain: number | undefined; noProvider: boolean } => {
  const [chain, setChain] = useState<number | undefined>(undefined);
  const [noProvider, setNoProvider] = useState<boolean>(false);
  const getChainId = async (ethereum: any) => {
    try {
      const web3 = new Web3(ethereum);
      const chainId = await web3.eth.getChainId();
      if (!chainId) return;
      setChain(chainId);
    } catch (error) {
      console.error('error in getting chainId');
    }
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setNoProvider(true);
    } else {
      getChainId(ethereum).then();
    }
  }, []);
  return { chain, noProvider };
};

export default useNetwork;
