import Web3 from 'web3';
const triggerNetworkChange = async (id: number | string, params: any) => {
  const ethereumProvider = (window as any).ethereum;
  const web3 = new Web3(Web3.givenProvider);
  const chainId = await web3.utils.toHex(id);
  try {
    // check if the chain to connect to is installed
    await ethereumProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }], // chainId must be in hexadecimal numbers
    });
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
    ethereumProvider.on('networkChanged', function () {
      window.location.reload();
    });
    ethereumProvider.on('accountsChanged', async function () {
     window.location.reload();
    });
  }
};

const isValidNetwork = (chain: string) => {
  return JSON.parse(process.env.TARGET_NETWORKS).includes(Number(chain));
};

export { triggerNetworkChange, addChangeEvents, isValidNetwork };
