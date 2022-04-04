import WalletConnectProvider from '@walletconnect/web3-provider';
import MaticWalletConnectProvider from '@maticnetwork/walletconnect-provider';
import { CHAINS } from '../../constants';

import Web3 from 'web3';
import Web3Modal from 'web3modal';
import config from '../../../config';

const getWalletConnect = (chain: number) => {
  const chainConfig = config.networks[chain];

  //   if (chainConfig && chain === CHAINS.polygon) {
  //     return {
  //       package: WalletConnectProvider,
  //       options: {
  //         infuraId: config.networks[CHAINS.polygon].rpcUrls[0], // required
  //       },
  //     };
  //   } else {
  return {
    package: WalletConnectProvider,
    options: {
      rpc: {
        137: 'https://polygon-rpc.com',
        1: process.env.INFURA_ID,
      },
      // required
    },
    // };
  };
};

const getProviderOptions = (chain: number) => {
  return {
    binancechainwallet: {
      package: true,
    },
    // injected: {},
    // Example with WalletConnect provider
    walletconnect: getWalletConnect(chain),
    'custom-onto': {
      display: {
        logo:
          'data:image/png;base64,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',
        name: 'ONTO',
        description: 'Connect your ONTO wallet',
      },
      package: true,
      connector: async () => {
        const provider = (window as any).onto;
        const web3 = new Web3(provider);

        await provider.enable();

        return web3.currentProvider;
      },
    },
    /* See Provider Options Section */
  };
};

const createWeb3Modal = (chain: number) => {
  const web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: false, // optional
    providerOptions: getProviderOptions(chain), // required
  });
  return web3Modal;
};

export { createWeb3Modal };
