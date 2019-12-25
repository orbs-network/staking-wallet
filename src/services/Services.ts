import { IOrbsPOSDataService, IStakingService, StakingService } from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';
import { IEthereumTxService } from './ethereumTxService/IEthereumTxService';
import { EthereumTxService } from './ethereumTxService/EthereumTxService';
import { IEthereumProvider } from './ethereumTxService/IEthereumProvider';
import Web3 from 'web3';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
  ethereumTxService: IEthereumTxService;
  stakingService: IStakingService;
}

export function buildServices(ethereumProvider: IEthereumProvider): IServices {
  let web3: Web3;

  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  }

  return {
    ethereumTxService: new EthereumTxService(ethereumProvider),
    orbsPOSDataService: buildOrbsPOSDataService(),
    stakingService: new StakingService(web3),
  };
}
