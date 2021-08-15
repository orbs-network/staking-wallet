import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { baseTheme } from './theme/Theme';
import { Provider } from 'mobx-react';
import React from 'react';
import { App } from './App';
import { LangRouter } from './multi-lang/LangRouter';
import initApp from './init';
import config, { IS_DEV } from './config';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import ErrorMonitoring from './services/error-monitoring/index';
import './services/i18n/index';

const { services, stores, themeAndStyle } = initApp();

export const AppWrapper = () => (
  <LangRouter preLangBasename={IS_DEV ? '' : config.urlBase}>
    <I18nextProvider i18n={i18n}>
      <Provider {...services} {...stores}>
        <StylesProvider injectFirst>
          <ThemeProvider theme={baseTheme}>
            <SCThemeProvider theme={themeAndStyle}>
              <CssBaseline />
              <ErrorMonitoring.ErrorBoundary>
                <App />
              </ErrorMonitoring.ErrorBoundary>
            </SCThemeProvider>
          </ThemeProvider>
        </StylesProvider>
      </Provider>
    </I18nextProvider>
  </LangRouter>
);
