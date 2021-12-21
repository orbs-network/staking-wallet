import { Provider } from 'mobx-react';
import React, { ReactNode, useMemo } from 'react';
import initApp from '../init';

interface IProps {
  children: ReactNode;
  chain?: number;
}

function ProviderWrapper({ children, chain }: IProps) {
  const res = useMemo(() => initApp(chain), [chain]);

  if (!res) {
    return null;
  }

  const { services, stores } = res;

  return (
    <Provider {...services} {...stores} chainId={chain}>
      {children}
    </Provider>
  );
}

export default ProviderWrapper;
