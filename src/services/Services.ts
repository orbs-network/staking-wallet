import { IOrbsPOSDataService } from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';
import { IEthereumTxService, EthereumTxService } from './ethereumTxService/EthereumTxService';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
  orbsTransactionService: IEthereumTxService;
}

export function buildServices(): IServices {
  return {
    orbsTransactionService: new EthereumTxService((window as any).ethereum),
    orbsPOSDataService: buildOrbsPOSDataService(),
  };
}
