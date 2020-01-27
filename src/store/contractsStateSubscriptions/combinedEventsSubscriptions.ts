import { IStakingService } from 'orbs-pos-data';
import { StakingServiceEventCallback } from 'orbs-pos-data/src/interfaces/IStakingService';

export function subscribeToOrbsInCooldownChange(
  stakingService: IStakingService,
  accountAddress: string,
  callback: StakingServiceEventCallback,
): () => Promise<boolean> {
  const unstakeEventUnsubscribe = stakingService.subscribeToUnstakedEvent(accountAddress, callback);
  const restakeEventUnsubscribe = stakingService.subscribeToRestakedEvent(accountAddress, callback);
  const withdrewEventUnsubscribe = stakingService.subscribeToWithdrewEvent(accountAddress, callback);

  return async () => {
    try {
      await Promise.all([unstakeEventUnsubscribe(), restakeEventUnsubscribe(), withdrewEventUnsubscribe()]);
      return true;
    } catch (e) {
      return false;
    }
  };
}
