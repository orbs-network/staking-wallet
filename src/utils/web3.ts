import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import { IEthereumProvider } from '@orbs-network/contracts-js';
import Web3 from 'web3';
import config from '../config';

export const createWeb3Instance = (ethereumProvider: IEthereumProvider) => {
  let web3: Web3;
  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  } else {
    web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
  }
  return web3;
};

export const createWeb3ModalInstance = () => {
  const providerOptions = {
    injected: {
      package: null,
    },
    // Example with WalletConnect provider
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
          3: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        },
      },
    },
  };

  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions,
  });
  return web3Modal;
};
