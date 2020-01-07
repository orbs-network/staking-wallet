import {
  IOrbsPOSDataService,
  IStakingService,
  StakingService,
  IOrbsTokenService,
  OrbsTokenService,
} from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';
import { IEthereumTxService } from './ethereumTxService/IEthereumTxService';
import { EthereumTxService } from './ethereumTxService/EthereumTxService';
import { IEthereumProvider } from './ethereumTxService/IEthereumProvider';
import Web3 from 'web3';
import config from '../config';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
  ethereumTxService: IEthereumTxService;
  stakingService: IStakingService;
  orbsTokenService: IOrbsTokenService;
}

export function buildServices(ethereumProvider: IEthereumProvider): IServices {
  let web3: Web3;

  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  }

  return {
    ethereumTxService: new EthereumTxService(ethereumProvider),
    orbsPOSDataService: buildOrbsPOSDataService(),
    stakingService: new StakingService(web3, config.contractsAddressesOverride.stakingContract),
    orbsTokenService: new OrbsTokenService(web3, config.contractsAddressesOverride.erc20Contract),
  };
}
