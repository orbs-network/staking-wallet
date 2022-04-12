import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/app-context';
import { web3Modal } from '../services/web3modal';
import Web3Service from '../services/web3Service';
function useWeb3() {
  const { provider } = useAppContext();
  const web3Ref = useRef(new Web3Service());

  useEffect(() => {
    web3Ref.current = new Web3Service(provider);
  }, [provider]);



  const addProviderListeners = () => {
    web3Ref.current.addAccountChangedEvent();
    web3Ref.current.addNetworkChangedEvent();
  };

  const getLatestBlock = () => {
    return web3Ref.current.getLatestBlock();
  };
  const getAccountBalance = (address: string) => {
    return web3Ref.current.getAccountBalance(address);
  };

  const getChainId = () => {
    return web3Ref.current.getChainId();
  };

  const disconnect = () => {
    return web3Modal.clearCachedProvider();
  };

  return {
    addProviderListeners,
    getLatestBlock,
    getAccountBalance,
    getChainId,
    provider,
    disconnect,
  };
}

export default useWeb3;
