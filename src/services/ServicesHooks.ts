import { MobXProviderContext } from 'mobx-react';
import { OrbsPOSDataService } from 'orbs-pos-data';
import React from 'react';
import { IServices } from './Services';

function useServices(): IServices {
  return React.useContext(MobXProviderContext);
}

export function useOrbsPOSDataService(): OrbsPOSDataService {
  return useServices().orbsPOSDataService;
}
