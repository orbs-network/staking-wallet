import { CONTARCTS_NAMES } from './../constants';
import config from '../config';
import { INetworkContractAddresses } from '../types';
import Web3 from 'web3';
import ContractRegistry from './contarcs/contract-registry';

const getChainAddresses = async (web3: Web3, chain?: number) => {
  if (!chain) {
    return;
  }
  const network = config.networks[chain];

  const { contractsRegistry, erc20Contract } = network;
  try {
    const registryContract = new ContractRegistry(web3, contractsRegistry);
    const addresses = await registryContract.getContracts<INetworkContractAddresses>(CONTARCTS_NAMES);
    addresses.erc20Contract = erc20Contract;
    return addresses;
  } catch (error) {}
};

export { getChainAddresses };
