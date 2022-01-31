import { useCryptoWalletIntegrationStore } from '../store/storeHooks';

const useNetwork = () => {
  const { isConnectedToWallet } = useCryptoWalletIntegrationStore();
  const [forcedNetwork, setForcedChain] = useState(null);

  const detectForcedNetwork = () => {
    const network = new URLSearchParams(location.search).get(NETWORK_QUERY_PARAM);
    if (network) {
      setForcedChain(Number(network));
    }
  };

};

export default useNetwork;
