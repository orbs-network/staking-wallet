import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';

import { configure } from 'mobx';
import { buildServices, IServices } from './services/Services';
import { getStores } from './store/storesInitialization';
import { App } from './App';

configure({
  enforceActions: 'observed',
});

const services = buildServices();
const stores = getStores(services.orbsPOSDataService, services.ethereumTxService);

interface IProps {
  services: IServices;
}

export const AppWrapper: React.FunctionComponent<IProps> = ({ services }) => (
  <BrowserRouter>
    <Provider {...services} {...stores}>
      <App />
    </Provider>
  </BrowserRouter>
);
