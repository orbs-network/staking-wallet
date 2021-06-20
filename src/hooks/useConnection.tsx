import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';

const useConnection = () => {
  const history = useHistory();

  const { mainAddress } = useCryptoWalletIntegrationStore();

  const [connected, setConnected] = useState<boolean>(false);
  useEffect(() => {
    if (mainAddress) {
      setConnected(true);
    }
    if (!mainAddress && connected) {
      return window.location.reload();
    }
  }, [connected, history, mainAddress]);
};

export default useConnection;
