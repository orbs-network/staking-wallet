import { Provider } from 'mobx-react';
import React, { ReactNode, useMemo } from 'react';
import initApp from '../init';
import { INetworkContractAddresses } from '../types';

interface IProps {
  children: ReactNode;
  chain?: number;
  addresses: INetworkContractAddresses;
}

function ProviderWrapper({ children, chain, addresses }: IProps) {
  const res = useMemo(() => initApp(chain, addresses), [addresses, chain]);

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
