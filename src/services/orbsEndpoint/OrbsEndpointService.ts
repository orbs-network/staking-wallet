import { HttpService } from '../http/HttpService';
import { IOrbsEndpointService } from './IOrbsEndpointService';

export class OrbsEndpointService implements IOrbsEndpointService {
  constructor(private httpService: HttpService, private remoteAddress: string) {}

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
