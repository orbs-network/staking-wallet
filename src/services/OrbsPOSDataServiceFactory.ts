import { orbsPOSDataServiceFactory, IOrbsPOSDataService, IOrbsPosContractsAddresses } from 'orbs-pos-data';
import Web3 from 'web3';
import { BuildOrbsClient } from './OrbsClientFactory';

import config from '../config';

export function buildOrbsPOSDataService(): IOrbsPOSDataService {
  const web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
  const orbsClient = BuildOrbsClient();

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const overridingAddresses = buildContractAddressesOverridingObject();

  return orbsPOSDataServiceFactory(web3, orbsClient, overridingAddresses);
}

function buildContractAddressesOverridingObject(): Partial<IOrbsPosContractsAddresses> {
  const { contractsAddressesOverride } = config;

  const overridingAddresses: Partial<IOrbsPosContractsAddresses> = {};

  if (contractsAddressesOverride.erc20Contract) {
    overridingAddresses.erc20Contract = contractsAddressesOverride.erc20Contract;
  }

  if (contractsAddressesOverride.guardiansContract) {
    overridingAddresses.guardiansContract = contractsAddressesOverride.guardiansContract;
  }

  return overridingAddresses;
}
