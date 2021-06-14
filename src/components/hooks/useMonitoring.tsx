import { useEffect } from 'react';
import ErrorMonitoring from '../../services/error-monitoring';
import { useCryptoWalletIntegrationStore } from '../../store/storeHooks';

const useMonitoring = () => {
  const { mainAddress } = useCryptoWalletIntegrationStore();
  console.log({ mainAddress });
  useEffect(() => {
    ErrorMonitoring.init();
  }, []);

  useEffect(() => {
    if (!mainAddress) return;

    ErrorMonitoring.setUser({ mainAddress });
  }, [mainAddress]);

  return null;
};

export default useMonitoring;
