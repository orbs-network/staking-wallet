import { IAccumulatedRewards, TRewardsDistributionHistory } from './orbsEndpointTypes';

export interface IOrbsEndpointService {
  readAccumulatedRewards(address: string): Promise<IAccumulatedRewards>;
  readRewardsDistributionsHistory(address: string): Promise<TRewardsDistributionHistory>;
}
