import { IOrbsPOSDataService } from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';

export interface IServices {
  orbsPOSDataService: IOrbsPOSDataService;
}

export function buildServices(): IServices {
  return {
    orbsPOSDataService: buildOrbsPOSDataService(),
  };
}
