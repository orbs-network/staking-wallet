import ReactGA, { EventArgs } from 'react-ga';
import { IAnalyticsService, TEthereumProviderName } from './IAnalyticsService';
import { EVENT_CATEGORIES, TEventCategories, TModalId, TStackingAction, USER_EVENT_ACTIONS } from './analyticConstants';

const CUSTOM_DIMENSIONS = {
  userAddress: 'dimension1',
  ethereumProviderName: 'dimension2',
};

export class AnalyticsService implements IAnalyticsService {
  private readonly active;
  private initialized = false;

  constructor(private trackingId: string, isActive: boolean) {
    this.active = isActive;
  }

  public async init() {
    if (!this.isActive) {
      return;
    }

    ReactGA.initialize(this.trackingId, {});

    this.initialized = true;
  }

  public get isActive() {
    return this.active;
  }

  public get isInitialized() {
    return this.initialized;
  }

  public setUserAddress(userAddress: string) {
    this.setDimension(CUSTOM_DIMENSIONS.userAddress, userAddress);
  }

  public setEthereumProvider(ethereumProviderName: TEthereumProviderName) {
    this.setDimension(CUSTOM_DIMENSIONS.ethereumProviderName, ethereumProviderName);
  }

  public trackModalView(modalId: TModalId) {
    this.trackModal(modalId);
  }

  public trackAppLogin(): void {
    this.trackEvent(EVENT_CATEGORIES.user, USER_EVENT_ACTIONS.loggedIn);
  }

  public trackStakingContractInteractionRequest(stakingAction: TStackingAction, value?: number): void {
    this.trackEvent(EVENT_CATEGORIES.tokenStakeRequest, stakingAction, value);
  }

  public trackStakingContractInteractionSuccess(stakingAction: TStackingAction, value?: number): void {
    this.trackEvent(EVENT_CATEGORIES.tokenStakeSuccess, stakingAction, value);
  }

  private setDimension(dimensionKey: string, dimensionValue: string | number) {
    if (!this.isActive) {
      return;
    }

    ReactGA.set({ [dimensionKey]: dimensionValue });
  }

  private trackModal(modalId: TModalId) {
    if (!this.isActive) {
      return;
    }

    ReactGA.modalview(modalId);
  }

  private trackEvent(category: TEventCategories, action: string, value?: number) {
    if (!this.isActive) {
      return;
    }

    const eventArgs: EventArgs = {
      category,
      action,
    };

    if (value !== undefined) {
      eventArgs.value = value;
    }

    ReactGA.event(eventArgs);
  }
}
