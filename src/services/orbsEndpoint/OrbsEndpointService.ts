import { IOrbsEndpointService } from './IOrbsEndpointService';
import { IHttpService } from '../http/IHttpService';
import { IAccumulatedRewards, TRewardsDistributionHistory } from './orbsEndpointTypes';

export class OrbsEndpointService implements IOrbsEndpointService {
  constructor(private httpService: IHttpService, private remoteAddress: string) {}

  readAccumulatedRewards(address: string): Promise<IAccumulatedRewards> {
    return this.httpService.get(this.buildEndpoint(`/rewards/${address}`));
  }

  readRewardsDistributionsHistory(address: string): Promise<TRewardsDistributionHistory> {
    return this.httpService.get<TRewardsDistributionHistory>(this.buildEndpoint(`/rewards/history/${address}`));
  }

  private buildEndpoint(endpoint) {
    return `${this.remoteAddress}/${endpoint}`;
  }
}
