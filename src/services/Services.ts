import { IOrbsPOSDataService } from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';
import { IEthereumTxService } from './ethereumTxService/IEthereumTxService';
import { EthereumTxService } from './ethereumTxService/EthereumTxService';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
  ethereumTxService: IEthereumTxService;
}

export function buildServices(): IServices {
  return {
    ethereumTxService: new EthereumTxService((window as any).ethereum),
    orbsPOSDataService: buildOrbsPOSDataService(),
  };
}
