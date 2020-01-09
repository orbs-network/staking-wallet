import { IOrbsPOSDataService, orbsPOSDataServiceFactory } from 'orbs-pos-data';
import Web3 from 'web3';
import config from '../config';
import { BuildOrbsClient } from './OrbsClientFactory';


export function buildOrbsPOSDataService(): IOrbsPOSDataService {
  const web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
  const orbsClient = BuildOrbsClient();

  return orbsPOSDataServiceFactory(web3, orbsClient, config.contractsAddressesOverride);
}
