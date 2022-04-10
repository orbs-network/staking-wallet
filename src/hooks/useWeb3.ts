import { useAppContext } from '../context/app-context';
import { web3Modal } from '../services/web3modal';
import Web3Service from '../services/web3Service';
function useWeb3() {
  const { provider } = useAppContext();

  const addNetworkChangedEvent = () => {
    new Web3Service(provider).addNetworkChangedEvent();
  };

  const addAccountChangedEvent = () => {
    new Web3Service(provider).addAccountChangedEvent();
  };

  const getLatestBlock = () => {
    return new Web3Service(provider).getLatestBlock();
  };
  const getAccountBalance = (address: string) => {
    return new Web3Service(provider).getAccountBalance(address);
  };

  const forceChainChange = (id: string | number, callback?: () => void) => {
    return new Web3Service(provider).triggerNetworkChange(id, callback);
  };

  const getChainId = () => {
    return new Web3Service(provider).getChainId();
  };


  const disconnect = () => {
    return web3Modal.clearCachedProvider()
  }

  return {
    addNetworkChangedEvent,
    addAccountChangedEvent,
    getLatestBlock,
    getAccountBalance,
    forceChainChange,
    getChainId,
    provider,
    disconnect
  };
}

export default useWeb3;
