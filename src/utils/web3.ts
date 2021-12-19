import Web3 from 'web3';
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

const isWrongNetwork = (chain: string, availableChains: number[]) => {
  if (!chain) {
    return false;
  }
  return !availableChains.includes(Number(chain));
};

const forceChainChange = (forcedChain?: string, selectedChain?: string) => {
  if (!forcedChain || !selectedChain) {
    return false;
  }
  return forcedChain !== selectedChain;
};

const getSupportedNetworks = () => {
  try {
    return JSON.parse(process.env.TARGET_NETWORKS) || [];
  } catch (error) {}
};

export {
  triggerNetworkChange,
  addChangeEvents,
  isWrongNetwork,
  addNetworkChangedEvent,
  addAccountChangedEvent,
  getSupportedNetworks,
  forceChainChange
};
