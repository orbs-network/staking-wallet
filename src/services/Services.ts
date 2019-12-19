import { IOrbsPOSDataService } from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';
import { IEthereumTxService } from './ethereumTxService/IEthereumTxService';
import { EthereumTxService } from './ethereumTxService/EthereumTxService';
import { IEthereumProvider } from './ethereumTxService/IEthereumProvider';
import { IOrbsContractsService } from './orbsContractsService/IOrbsContractsService';
import { OrbsContractsService } from './orbsContractsService/OrbsContractsService';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
  ethereumTxService: IEthereumTxService;
  orbsContractsService: IOrbsContractsService;
}

export function buildServices(ethereumProvider: IEthereumProvider): IServices {
  return {
    ethereumTxService: new EthereumTxService(ethereumProvider),
    orbsPOSDataService: buildOrbsPOSDataService(),
    orbsContractsService: new OrbsContractsService(),
  };
}
