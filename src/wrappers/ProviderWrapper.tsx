import { Provider } from 'mobx-react';
import React, { ReactNode, useEffect, useState } from 'react';
import AppLoader from '../components/app-loader';
import { useAppContext } from '../context/app-context/';
import useWeb3 from '../hooks/useWeb3';
import initApp from '../init';
import { web3Modal } from '../services/web3modal';

interface IProps {
  children: ReactNode;
  chain?: number;
}

function ProviderWrapper({ children, chain }: IProps) {
  const [services, setServices] = useState(null);
  const [stores, setStores] = useState(null);
  const { provider } = useAppContext();

  useEffect(() => {
    const onLoad = async () => {
      setServices(null);
      setStores(null);
      try {
        
        const res = await initApp(provider, chain);
        setServices(res.services);
        setStores(res.stores);
      } catch (error) {
      } finally {
      }
    };
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, provider]);

  return services && stores ? (
    <Provider {...services} {...stores} chainId={chain}>
      {children}
    </Provider>
  ) : (
    <AppLoader />
  );
}

export default ProviderWrapper;
