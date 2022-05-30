import React, { createContext, useContext, useState } from 'react';
import {web3Modal} from '../../services/web3modal'
interface IState {
  provider: any;
  setProvider: (val: any) => void;
}

const Context = createContext<IState>({} as IState);

interface IProps {
  children: React.ReactNode;
}

const AppContext = ({ children }: IProps) => {
  const [provider, setProvider] = useState(null);

  const value = {
    provider,
    setProvider,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useAppContext = () => {
  
  const values = useContext(Context);

  return values
};

export { AppContext, useAppContext };
