import React, { createContext, useContext, useState } from "react";

interface IState {
  provider: any;
  setProvider: (val: any) => void;
}

const Context = createContext<IState>({} as IState);

interface IProps {
  children: React.ReactNode;
}

const AppContext = ({ children }: IProps) => {
  const [provider, setProvider] = useState(null)

  const value = {
    provider,
    setProvider
  };
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};
const useAppContext = () => useContext(Context);
export { AppContext, useAppContext };
