import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/core/styles';
import { Provider } from 'mobx-react';
import React from 'react';
import { App } from './App';
import { buildServices } from './services/Services';
import { configureMobx, getStores } from './store/storesInitialization';
import { LangRouter } from './multi-lang/LangRouter';
import { resources } from './translations';

configureMobx();

const services = buildServices((window as any).ethereum);
const stores = getStores(services.orbsPOSDataService, services.ethereumTxService);

export const AppWrapper: React.FunctionComponent = () => (
  <LangRouter resources={resources}>
    <Provider {...services} {...stores}>
      <CssBaseline />
      <StylesProvider injectFirst>
        <App />
      </StylesProvider>
    </Provider>
  </LangRouter>
);
