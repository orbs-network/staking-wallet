import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ConnectedWallet } from '../../services/wallet-connection';

interface IState {
  provider: any;
  setProvider: (val: any) => void;
  connectedWallet: ConnectedWallet | null;
  setConnectedWallet: (val: ConnectedWallet | null) => void;
}

const Context = createContext<IState>({} as IState);

interface IProps {
  children: React.ReactNode;
}

const AppContext = ({ children }: IProps) => {
  const [provider, setProvider] = useState(null);
  const [connectedWallet, setConnectedWalletState] = useState<ConnectedWallet | null>(null);

  const setConnectedWallet = useCallback((wallet: ConnectedWallet | null) => {
    setConnectedWalletState(wallet);
    setProvider(wallet ? wallet.provider : null);
  }, []);

  const value = useMemo(
    () => ({
      provider,
      setProvider,
      connectedWallet,
      setConnectedWallet,
    }),
    [connectedWallet, provider, setConnectedWallet],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useAppContext = () => {
  const values = useContext(Context);

  return values;
};

export { AppContext, useAppContext };
