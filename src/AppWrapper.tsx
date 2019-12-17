import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/core/styles';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from './theme/Theme';
import { Provider } from 'mobx-react';
import React from 'react';
import { App } from './App';
import { buildServices } from './services/Services';
import { configureMobx, getStores } from './store/storesInitialization';
import { LangRouter } from './multi-lang/LangRouter';
import { resources } from './translations';

const GlobalStyle = createGlobalStyle`
  body {
    @media (min-width: 1920px) {
      font-size: 20px;
    }

    @media (max-width: 1920px) {
      font-size: 18px;
    }

    @media (max-width: 1600px) {
      font-size: 16px;
    }

    @media (max-width: 1366px) {
      font-size: 14px;
    }

    @media (max-width: 1200px) {
      font-size: 12px;
    }

    @media (max-width: 1024px) {
      font-size: 10px;
    }

    @media (max-width: 768px) {
      font-size: 8px;
    }
  }
`;

configureMobx();

const services = buildServices((window as any).ethereum);
const stores = getStores(services.orbsPOSDataService, services.ethereumTxService);

export const AppWrapper: React.FunctionComponent = () => (
  <LangRouter resources={resources}>
    <Provider {...services} {...stores}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <StylesProvider injectFirst>
          <App />
        </StylesProvider>
      </ThemeProvider>
    </Provider>
  </LangRouter>
);
