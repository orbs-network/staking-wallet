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

const services = buildServices((window as any).ethereum);
const stores = getStores(services.orbsPOSDataService, services.ethereumTxService);

export const AppWrapper: React.FunctionComponent = () => (
  <BrowserRouter>
    <Provider {...services} {...stores}>
      <App />
    </Provider>
  </BrowserRouter>
);
