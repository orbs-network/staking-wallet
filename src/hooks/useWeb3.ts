import { useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '../context/app-context';
import { walletConnection } from '../services/wallet-connection';
import Web3Service from '../services/web3Service';
function useWeb3() {
  const { provider, setConnectedWallet } = useAppContext();
  const web3Ref = useRef(new Web3Service());

  useEffect(() => {
    web3Ref.current = new Web3Service(provider);
  }, [provider]);

  const addProviderListeners = useCallback(() => {
    web3Ref.current.addAccountChangedEvent();
    web3Ref.current.addNetworkChangedEvent();
  }, []);

  const getLatestBlock = useCallback(() => {
    return web3Ref.current.getLatestBlock();
  }, []);
  const getAccountBalance = useCallback((address: string) => {
    return web3Ref.current.getAccountBalance(address);
  }, []);

  const getChainId = useCallback(() => {
    return web3Ref.current.getChainId();
  }, []);

  const disconnect = useCallback(async () => {
    await walletConnection.disconnect();
    setConnectedWallet(null);
  }, [setConnectedWallet]);

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
