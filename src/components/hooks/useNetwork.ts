import React from 'react';
import { IEthereumProvider } from '@orbs-network/contracts-js';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

const chainDictionary = {
  1: 'Ethereum Mainnet',
  42: 'Kovan Test Network',
  3: 'Ropsten Test Network',
  4: 'Rinkeby Test Network',
  5: 'Goerli Test Network',
};
const handleNetworkChange = (ethereum: IEthereumProvider) => {
  ethereum.on('chainChanged', (chainId: string) => {
    //reload was suggested by the metamask documentation
    window.location.reload();
  });
};

const useNetwork = (): [string | undefined] => {
  const [network, setNetwork] = useState<string | undefined>(undefined);

  const getChainId = async (ethereum: any) => {
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    try {
      const web3 = new Web3(ethereum);
      const chainId = await web3.eth.getChainId();
      if (!chainId) return;
      const networkName = chainDictionary[chainId];
      setNetwork(networkName);
    } catch (error) {
      console.error('error in getting chainId');
    }
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    window.addEventListener('load', handleNetworkChange.bind(null, ethereum));
    getChainId(ethereum).then();
    return () => {
      window.removeEventListener('load', handleNetworkChange.bind(null, ethereum));
    };
  }, []);
  return [network];
};

export default useNetwork;
