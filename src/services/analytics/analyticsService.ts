import ReactGA from 'react-ga';
import { IAnalyticsService } from './IAnalyticsService';
import { TModalId } from './analyticConstants';

export class AnalyticsService implements IAnalyticsService {
  private active = false;
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
    this.setDimension('userAddress', userAddress);
  }

  public trackModalView(modalId: TModalId) {
    this.trackModal(modalId);
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
}
