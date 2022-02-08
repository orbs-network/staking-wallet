import Web3 from 'web3';
import { getSupportedChains } from '../utils/index';
import config from '../config';
class Web3Service {
  web3: Web3;
  constructor() {
    this.web3 = new Web3((window as any).ethereum);
  }
  triggerNetworkChange = async (id: number | string, params: any, callback?: () => void) => {
    console.log(params);
    const ethereumProvider = (window as any).ethereum;
    const web3 = new Web3(Web3.givenProvider);
    const chainId = await web3.utils.toHex(id);
    try {
      // check if the chain to connect to is installed
      await ethereumProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }], // chainId must be in hexadecimal numbers
      });
      if (callback) {
        callback();
      }
    } catch (error) {
      console.log(error);
      if (error.code === 4902) {
        try {
          await ethereumProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                ...params,
              },
            ],
          });
          if (callback) {
            callback();
          }
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  };

  addChangeEvents = () => {
    const ethereumProvider = (window as any).ethereum;
    if (ethereumProvider) {
      ethereumProvider.on('accountsChanged', async function () {
        window.location.reload();
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
