import { MobXProviderContext } from 'mobx-react';
import { IOrbsPOSDataService } from 'orbs-pos-data';
import React from 'react';
import { IServices } from './Services';
import { IEthereumTxService } from './ethereumTxService/IEthereumTxService';

function useServices(): IServices {
  return React.useContext(MobXProviderContext);
}

export function useOrbsPOSDataService(): IOrbsPOSDataService {
  return useServices().orbsPOSDataService;
}

export function useEthereumTxService(): IEthereumTxService {
  return useServices().ethereumTxService;
}
