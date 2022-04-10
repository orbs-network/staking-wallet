import { IStakingService } from 'orbs-pos-data';
import { StakingServiceEventCallback } from 'orbs-pos-data/dist/interfaces/IStakingService';
import errorMonitoring from '../../services/error-monitoring';

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
      const { sections, captureException } = errorMonitoring;
      captureException(
        e,
        sections.combinedEventsAndSubscriptions,
        'error in function: subscribeToOrbsInCooldownChange',
      );
      return false;
    }
  };
}

export function subscribeToStakeAmountChange(
  stakingService: IStakingService,
  accountAddress: string,
  callback: StakingServiceEventCallback,
): () => Promise<boolean> {
  const stakeEventUnsubscribe = stakingService.subscribeToStakedEvent(accountAddress, callback);
  const unstakedEventUnsubscribe = stakingService.subscribeToUnstakedEvent(accountAddress, callback);
  const restakedEventUnsubscribe = stakingService.subscribeToRestakedEvent(accountAddress, callback);

  return async () => {
    try {
      await Promise.all([stakeEventUnsubscribe(), unstakedEventUnsubscribe(), restakedEventUnsubscribe()]);
      return true;
    } catch (e) {
      const { sections, captureException } = errorMonitoring;
      captureException(e, sections.combinedEventsAndSubscriptions, 'error in function: subscribeToStakeAmountChange');
      return false;
    }
  };
}
