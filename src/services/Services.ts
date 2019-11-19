import { IOrbsPOSDataService } from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';
import { IEthereumTxService, EthereumTxService } from './ethereumTxService/EthereumTxService';
import { EthereumTxDevService, IEthereumTxDevService } from './ethereumTxService/EthereumTxDevService';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
  orbsTransactionService: IEthereumTxService;
  orbsTransactionDevService: IEthereumTxDevService;
}

export function buildServices(): IServices {
  return {
    orbsTransactionService: new EthereumTxService(window.ethereum),
    orbsPOSDataService: buildOrbsPOSDataService(),
    orbsTransactionDevService: new EthereumTxDevService(),
  };
}
