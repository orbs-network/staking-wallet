import { useEffect } from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { useAnalyticsService } from '../services/ServicesHooks';

const useAnalytics = (event: string) => {
  const { hasEthereumProvider, isConnectedToWallet } = useCryptoWalletIntegrationStore();
  const analyticsService = useAnalyticsService();
  useEffect(() => {
    if (hasEthereumProvider && isConnectedToWallet) {
      analyticsService[event]();
    }
  }, [analyticsService, event, hasEthereumProvider, isConnectedToWallet]);
};

export default useAnalytics;
