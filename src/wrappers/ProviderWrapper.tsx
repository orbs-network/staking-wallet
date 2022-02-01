import { Provider } from 'mobx-react';
import React, { ReactNode, useEffect, useState } from 'react';
import initApp from '../init';

interface IProps {
  children: ReactNode;
  chain?: number;
  hideLoader: () => void;
}

function ProviderWrapper({ children, chain, hideLoader }: IProps) {
  const [services, setServices] = useState(null);
  const [stores, setStores] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const onLoad = async () => {
      try {
        const res = await initApp(chain);
        setServices(res.services);
        setStores(res.stores);
      } catch (error) {
      } finally {
        hideLoader();
        setIsLoaded(true);
      }
    };
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  return isLoaded ? (
    <Provider {...services} {...stores} chainId={chain}>
      {children}
    </Provider>
  ) : null;
}

export default ProviderWrapper;
