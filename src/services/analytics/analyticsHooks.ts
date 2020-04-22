import { useAnalyticsService } from '../ServicesHooks';
import { useEffect } from 'react';
import { TModalId } from './analyticConstants';

export const useTrackModal = (modalId: TModalId) => {
  const analyticsService = useAnalyticsService();

  useEffect(() => {
    analyticsService.trackModalView(modalId);
  }, [analyticsService, modalId]);
};
