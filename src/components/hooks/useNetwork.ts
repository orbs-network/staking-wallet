import { useEffect, useState } from 'react';
import Web3 from 'web3';

const chainDictionary = {
  1: 'Ethereum Mainnet',
  42: 'Kovan Test Network',
  3: 'Ropsten Test Network',
  4: 'Rinkeby Test Network',
  5: 'Goerli Test Network',
  137: 'Polygon',
};

const useNetwork = (): { network: string | undefined; chain: string | undefined } => {
  const [network, setNetwork] = useState<string | undefined>(undefined);
  const [chain, setChain] = useState<string | undefined>(undefined);

  const getChainId = async (ethereum: any) => {
    try {
      const web3 = new Web3(ethereum);
      const chainId = await web3.eth.getChainId();
      if (!chainId) return;
      setChain(chainId.toString());
      const networkName = chainDictionary[chainId];
      setNetwork(networkName);
    } catch (error) {
      console.error('error in getting chainId');
    }
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    getChainId(ethereum).then();
  }, []);
  return { network, chain };
};

export default useNetwork;
