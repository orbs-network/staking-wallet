import ReactGA from 'react-ga';
import { IAnalyticsService } from './IAnalyticsService';

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
}
