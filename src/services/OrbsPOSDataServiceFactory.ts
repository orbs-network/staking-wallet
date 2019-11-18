import { orbsPOSDataServiceFactory, IOrbsPOSDataService } from 'orbs-pos-data';
import Web3 from 'web3';
import { BuildOrbsClient } from './OrbsClientFactory';

const ETHEREUM_PROVIDER_URL = 'https://mainnet.infura.io/v3/3fe9b03bd8374639809addf2164f7287';

export function buildOrbsPOSDataService(): IOrbsPOSDataService {
  const web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_PROVIDER_URL));
  const orbsClient = BuildOrbsClient();
  return orbsPOSDataServiceFactory(web3, orbsClient);
}
