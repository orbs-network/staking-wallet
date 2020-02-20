// TODO : FUTURE : O.: : Change all 'data-testid' manual strings to functinos + use guardian address
import { TGuardianInfoExtended } from '../../../store/GuardiansStore';

export const guardianRowTestIdFromAddress = (guardianAddress: string) => `guardian-${guardianAddress}`;
export const selectActionButtonTestIdFromAddress = (guardianAddress: string) =>
  `guardian-${guardianAddress}-select-action-button`;

export const guardianRowTestId = (guardian: TGuardianInfoExtended) => guardianRowTestIdFromAddress(guardian.address);
export const guardianNameTestId = (guardian: TGuardianInfoExtended) => `guardian-${guardian.address}-name`;
export const guardianAddressTestId = (guardian: TGuardianInfoExtended) => `guardian-${guardian.address}-address`;
export const guardianWebsiteTestId = (guardian: TGuardianInfoExtended) => `guardian-${guardian.address}-website`;
export const guardianStakeTestId = (guardian: TGuardianInfoExtended) => `guardian-${guardian.address}-stake`;
export const guardianVotedTestId = (guardian: TGuardianInfoExtended) => `guardian-${guardian.address}-voted`;
export const selectActionButtonTestId = (guardian: TGuardianInfoExtended) =>
  selectActionButtonTestIdFromAddress(guardian.address);
