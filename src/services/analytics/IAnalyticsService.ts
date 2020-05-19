import { TModalId, TStackingAction } from './analyticConstants';

export type TEthereumProviderName =
  | 'MetaMask'
  | 'Trust Wallet'
  | 'ImToken'
  | 'ORBS Infura'
  | 'Unknown Ethereum provider';

export interface IAnalyticsService {
  isActive: boolean;
  isInitialized: boolean;
  init: () => Promise<void>;

  setUserAddress: (userAddress: string) => void;
  setEthereumProvider: (ethereumProviderName: TEthereumProviderName) => void;
  trackAppLogin: () => void;
  trackModalView: (modalId: TModalId) => void;
  trackStakingContractInteractionRequest: (stakingAction: TStackingAction, value?: number) => void;
  trackStakingContractInteractionSuccess: (stakingAction: TStackingAction, value?: number) => void;
}
