import { TModalId, TStackingAction } from './analyticConstants';

export interface IAnalyticsService {
  isActive: boolean;
  isInitialized: boolean;
  init: () => Promise<void>;

  setUserAddress: (userAddress: string) => void;
  trackModalView: (modalId: TModalId) => void;
  trackStakingContractInteractionRequest: (stakingAction: TStackingAction, value?: number) => void;
  trackStakingContractInteractionSuccess: (stakingAction: TStackingAction, value?: number) => void;
}
