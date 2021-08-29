import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { AppStyles, baseTheme } from './theme/Theme';
import React from 'react';
import { App } from './App';
import { LangRouter } from './multi-lang/LangRouter';
import config, { IS_DEV } from './config';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import ErrorMonitoring from './services/error-monitoring/index';
import './services/i18n/index';

const themeAndStyle = {
  ...baseTheme,
  styles: AppStyles,
};
export const AppWrapper = () => (
  <LangRouter preLangBasename={IS_DEV ? '' : config.urlBase}>
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  </LangRouter>
);
