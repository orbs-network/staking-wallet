import Web3 from 'web3';
import { getSupportedChains } from '../utils/index';
import config from '../../config';
class Web3Service {
  web3: Web3;
  constructor() {
    this.web3 = new Web3((window as any).ethereum);
  }

  triggerNetworkChange = async (id: number | string, callback?: () => void) => {
    const ethereum = (window as any).ethereum;
    const chainId = this.web3.utils.toHex(id);
    try {
      // check if the chain to connect to is installed
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }], // chainId must be in hexadecimal numbers
      });
      if (callback) {
        callback();
      }
    } catch (error) {
    
      const chain = config.networks[id];
      const params = {
        chainId: this.web3.utils.toHex(id), // A 0x-prefixed hexadecimal string
        chainName: chain.name,
        nativeCurrency: {
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol, // 2-6 characters long
          decimals: chain.nativeCurrency.decimals,
        },
        rpcUrls: chain.rpcUrls,
        blockExplorerUrls: [chain.blockExplorerUrl],
      };

      await this.web3.eth.getAccounts((error, accounts) => {
        (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params, accounts[0]],
        });
      });
      if (callback) {
        callback();
      }

      console.error(error);
    }
  };

  addChangeEvents = () => {
    const ethereumProvider = (window as any).ethereum;
    if (ethereumProvider) {
      ethereumProvider.on('accountsChanged', async function () {
        // window.location.reload();
      });
      ethereumProvider.on('networkChanged', function () {
        window.location.reload();
      });
    }
  };

  getAccountBalance = async (walletAddress: string) => {
    try {
      const result = await this.web3.eth.getBalance(walletAddress);
      const balance = this.web3.utils.fromWei(result);
      return balance;
    } catch (error) {
      return '0';
    }
  };

  addNetworkChangedEvent = () => {
    const ethereumProvider = (window as any).ethereum;
    if (ethereumProvider) {
      ethereumProvider.on('networkChanged', function () {
        window.location.reload();
      });
    }
  };
  addAccountChangedEvent = () => {
    const ethereumProvider = (window as any).ethereum;
    if (ethereumProvider) {
      ethereumProvider.on('accountsChanged', async function () {
        window.location.reload();
      });
    }
  };

  isWrongNetwork = (chain: number, availableChains: number[]) => {
    if (!chain) {
      return false;
    }
    return !availableChains.includes(chain);
  };

  forceChainChange = (forcedChain?: number, selectedChain?: number) => {
    if (!forcedChain || !selectedChain) {
      return false;
    }
    return forcedChain !== selectedChain;
  };

  getChainId = async () => {
    try {
      return this.web3.eth.getChainId();
    } catch (error) {
      console.error('error in getting chainId');
    }
  };

  getLatestBlock = async () => {
    try {
      return this.web3.eth.getBlockNumber();
    } catch (error) {}
  };

  getPropertyFromNetworks = (property: string) => {
    const arr: string[] = [];
    try {
      const supportedChains = getSupportedChains();

      for (const chain of supportedChains) {
        const network = config.networks[chain];
        if (network) {
          arr.push(network[property]);
        }
      }
      return arr;
    } catch (error) {
      return [];
    }
  };
}

export default new Web3Service();
