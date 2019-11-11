import { OrbsPOSDataService } from 'orbs-pos-data';
import { buildOrbsPOSDataService } from './OrbsPOSDataServiceFactory';

export interface IServices {
  orbsPOSDataService: OrbsPOSDataService;
}

export function buildServices(): IServices {
  return {
    orbsPOSDataService: buildOrbsPOSDataService(),
  };
}
