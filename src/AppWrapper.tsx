import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, responsiveFontSizes, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import styled, { ThemeProvider as SCThemeProvider } from 'styled-components';
import { AppStyles, baseTheme } from './theme/Theme';
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

const themeAndStyle = {
  ...baseTheme,
  styles: AppStyles,
};

export const AppWrapper: React.FunctionComponent = () => (
  <LangRouter resources={resources}>
    <Provider {...services} {...stores}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={baseTheme}>
          <SCThemeProvider theme={themeAndStyle}>
            <CssBaseline />
            <App />
          </SCThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  </LangRouter>
);
