import Web3 from 'web3';

class Web3Service {
  web3;
  constructor(private ethereumProvider) {
    this.web3 = new Web3(ethereumProvider);
  }

  async getChainId() {
    try {
      return await this.web3.eth.getChainId();
    } catch (error) {
      console.error('error in getting chainId');
    }
  }

  changeNetwork = async (id: number | string, params: any, callback?: () => void) => {
    const chainId = await this.web3.utils.toHex(id);
    try {
      // check if the chain to connect to is installed
      await this.ethereumProvider.request({
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
          await this.ethereumProvider.request({
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

  onAccountsChanged(method: () => void) {
    this.ethereumProvider.on('accountsChanged', async function () {
      method();
    });
  }

  onNetworkChange(method: () => void) {
    this.ethereumProvider.on('networkChanged', function () {
      method();
    });
  }

  getWeb3Instace = () => {
    return this.web3;
  };
}

export default Web3Service;
