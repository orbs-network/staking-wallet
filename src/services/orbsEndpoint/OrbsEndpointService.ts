import { IOrbsEndpointService } from './IOrbsEndpointService';
import { IHttpService } from '../http/IHttpService';

export class OrbsEndpointService implements IOrbsEndpointService {
  constructor(private httpService: IHttpService, private remoteAddress: string) {}

  readRewards(address: string) {
    return this.httpService.get(this.buildEndpoint(`/rewards/${address}`));
  }

  readRewardsHistory(address: string) {
    return this.httpService.get(this.buildEndpoint(`/rewards/history/${address}`));
  }

  private buildEndpoint(endpoint) {
    return `${this.remoteAddress}/${endpoint}`;
  }
}
