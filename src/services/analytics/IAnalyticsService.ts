export interface IAnalyticsService {
  isActive: boolean;
  isInitialized: boolean;
  init: () => Promise<void>;
}
