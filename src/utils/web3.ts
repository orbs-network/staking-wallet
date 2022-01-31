import Web3 from 'web3';
import config from '../config';
const triggerNetworkChange = async (id: number | string, params: any, callback?: () => void) => {
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

const addChangeEvents = () => {
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

const addNetworkChangedEvent = () => {
  const ethereumProvider = (window as any).ethereum;
  if (ethereumProvider) {
    ethereumProvider.on('networkChanged', function () {
      window.location.reload();
    });
  }
};
const addAccountChangedEvent = () => {
  const ethereumProvider = (window as any).ethereum;
  if (ethereumProvider) {
    ethereumProvider.on('accountsChanged', async function () {
      window.location.reload();
    });
  }
};

const isWrongNetwork = (chain: number, availableChains: number[]) => {
  if (!chain) {
    return false;
  }
  return !availableChains.includes(chain);
};

const forceChainChange = (forcedChain?: number, selectedChain?: number) => {
  if (!forcedChain || !selectedChain) {
    return false;
  }
  return forcedChain !== selectedChain;
};



const getSupportedChains = () => {
  try {
    return JSON.parse(process.env.TARGET_NETWORKS) || [];
  } catch (error) {
    return [];
  }
};

const isSupportedChain = (chain: number) => {
  const availableChains = getSupportedChains();
  if (!chain) {
    return false;
  }
  return availableChains.includes(chain);
};

const getSortedChains = (selectedChain: number) => {
  const chains = getSupportedChains();
  const index = chains.findIndex((c: number) => c === selectedChain);
  chains.splice(index, 1);
  chains.unshift(selectedChain);
  return chains;
};

const getPropertyFromNetworks = (property: string) => {
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

const getWeb3Instace = () => {
  if ((window as any).ethereum) {
    return new Web3(Web3.givenProvider);
  }
};

export {
  triggerNetworkChange,
  addChangeEvents,
  isWrongNetwork,
  addNetworkChangedEvent,
  addAccountChangedEvent,
  getSupportedChains,
  forceChainChange,
  getPropertyFromNetworks,
  getSortedChains,
  getWeb3Instace,
  isSupportedChain
};
