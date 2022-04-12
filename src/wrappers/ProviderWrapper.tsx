import { Provider } from 'mobx-react';
import React, { ReactNode, useEffect, useState } from 'react';
import AppLoader from '../components/app-loader';
import { useAppContext } from '../context/app-context/';
import initApp from '../init';

interface IProps {
  children: ReactNode;
  chain?: number;
}

function ProviderWrapper({ children, chain }: IProps) {
  const [services, setServices] = useState(null);
  const [stores, setStores] = useState(null);
  const { provider } = useAppContext();

  const init = async () => {
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

  useEffect(() => {
    init();
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
