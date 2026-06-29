import { Provider } from 'mobx-react';
import React, { ReactNode, useEffect, useState } from 'react';
import AppLoader from '../components/app-loader';
import { useAppContext } from '../context/app-context/';
import initApp from '../init';

const INIT_TIMEOUT_MS = 20000;

interface IProps {
  children: ReactNode;
  chain?: number;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Application initialization timed out')), timeoutMs)),
  ]);
}

function ProviderWrapper({ children, chain }: IProps) {
  const [services, setServices] = useState(null);
  const [stores, setStores] = useState(null);
  const [initError, setInitError] = useState(false);
  const { provider, connectedWallet } = useAppContext();

  const init = async () => {
    setServices(null);
    setStores(null);
    setInitError(false);
    try {
      const res = await withTimeout(initApp(provider, chain, connectedWallet), INIT_TIMEOUT_MS);
      setServices(res.services);
      setStores(res.stores);
    } catch (error) {
      console.error('Application initialization failed', error);
      setInitError(true);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, provider]);

  if (initError) {
    return <div style={{ color: '#ffffff', padding: 32, textAlign: 'center' }}>Loading failed. Please refresh.</div>;
  }

  return services && stores ? (
    <Provider {...services} {...stores} chainId={chain}>
      {children}
    </Provider>
  ) : (
    <AppLoader />
  );
}

export default ProviderWrapper;
