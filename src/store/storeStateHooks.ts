import moment from 'moment';
import { useOrbsAccountStore } from './storeHooks';

export function useTimeLeftForCooldown() {
  const orbsAccountStore = useOrbsAccountStore();

  const utcNowInSeconds = moment()
    .utc()
    .unix();
  const timeLeftForCooldown = orbsAccountStore.cooldownReleaseTimestamp - utcNowInSeconds;

  return timeLeftForCooldown;
}

export function useOrbsInCooldownState(): { hasOrbsInCooldown: boolean; canWithdrawCooldownOrbs: boolean } {
  const orbsAccountStore = useOrbsAccountStore();
  const timeLeftForCooldown = useTimeLeftForCooldown();

  const hasOrbsInCooldown = orbsAccountStore.orbsInCoolDown > 0;
  const canWithdrawCooldownOrbs = hasOrbsInCooldown && timeLeftForCooldown <= 0;

  return {
    hasOrbsInCooldown,
    canWithdrawCooldownOrbs,
  };
}
