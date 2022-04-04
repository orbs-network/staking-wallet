import { Provider } from 'mobx-react';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/app-context';
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
  const { provider } = useAppContext();

  useEffect(() => {
    const onLoad = async () => {
      setIsLoaded(false);
      try {
        const web3Provider = provider || (window as any).ethereum;
        const res = await initApp(web3Provider, chain);
        
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
  }, [chain, provider]);

  return isLoaded ? (
    <Provider {...services} {...stores} chainId={chain}>
      {children}
    </Provider>
  ) : null;
}

export default ProviderWrapper;
