import { orbsPOSDataServiceFactory, IOrbsPOSDataService, IOrbsPosContractsAddresses } from 'orbs-pos-data';
import Web3 from 'web3';
import { BuildOrbsClient } from './OrbsClientFactory';

import config from '../config';

export function buildOrbsPOSDataService(): IOrbsPOSDataService {
  const web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
  const orbsClient = BuildOrbsClient();

  return orbsPOSDataServiceFactory(web3, orbsClient, config.contractsAddressesOverride);
}
