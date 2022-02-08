import { INetworkContractAddresses } from './../../types/index';
import Web3 from 'web3';
import config from '../../config';
import { CONTARCTS_NAMES } from '../../constants';
import ContractRegistry from '../contarcs/contract-registry';
const infuraId = '9a7b1e845d3c454e92f9b759a07fe314';

const networksUrls = {
  1: `https://mainnet.infura.io/v3/${infuraId}`,
  3: `https://ropsten.infura.io/v3/${infuraId}`,
  137: `https://polygon-rpc.com`,
};

class Networks {
  async getAddresses(chain?: number) {
    if (!chain) {
      return;
    }
    const rpc = networksUrls[chain];
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const network = config.networks[chain];
    const { contractsRegistry, erc20Contract } = network;
    try {
      const registryContract = new ContractRegistry(web3, contractsRegistry);
      const addresses = await registryContract.getContracts<INetworkContractAddresses>(CONTARCTS_NAMES);
      addresses.erc20Contract = erc20Contract;
      return addresses;
    } catch (error) {}
  }
}
export default new Networks();
