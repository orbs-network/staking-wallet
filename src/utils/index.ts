import config from '../../config/index';
import { DEFAULT_CHAIN } from '../constants';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getSupportedChains = () => {
  try {
    return JSON.parse(process.env.TARGET_NETWORKS) || [];
  } catch (error) {
    return [];
  }
};
const getSortedChains = (selectedChain: number) => {
  const chains = getSupportedChains();
  const index = chains.findIndex((c: number) => c === selectedChain);
  chains.splice(index, 1);
  chains.unshift(selectedChain);
  return chains;
};

const getChainConfig = (chain: number) => {
  let network = config.networks[chain];
  if (!network) {
    network = config.networks[DEFAULT_CHAIN];
  }
  return network;
};

const getNavbarImagesByChain = (chain: number) => {
  let network = getChainConfig(chain);

  return network.ui.navbar;
};

export { sleep, getSupportedChains, getSortedChains, getNavbarImagesByChain, getChainConfig };
