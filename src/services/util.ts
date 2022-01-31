import { getSupportedChains } from '../utils/web3';
import config, { INetwork } from '../config';

const getPropertyFromNetworks = () => {
  const arr: { chain: number; managementServiceStatusPageUrl: string }[] = [];
  try {
    const supportedChains = getSupportedChains();
    for (const chain of supportedChains) {
      const network = config.networks[chain];
      if (network) {
        const { managementServiceStatusPageUrl } = network;
        arr.push({ chain, managementServiceStatusPageUrl });
      }
    }
    return arr;
  } catch (error) {
    return [];
  }
};

export { getPropertyFromNetworks };
