import { TModalId, TStackingAction } from './analyticConstants';

export interface IAnalyticsService {
  isActive: boolean;
  isInitialized: boolean;
  init: () => Promise<void>;

  setUserAddress: (userAddress: string) => void;
  trackModalView: (modalId: TModalId) => void;
  trackStakingContractInteraction: (stakingAction: TStackingAction, value: number) => void;
}
