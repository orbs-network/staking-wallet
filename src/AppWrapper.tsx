import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { baseTheme } from './theme/Theme';
import { Provider } from 'mobx-react';
import React, { useMemo } from 'react';
import { App } from './App';
import { LangRouter } from './multi-lang/LangRouter';
import initApp from './init';
import config, { IS_DEV } from './config';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import ErrorMonitoring from './services/error-monitoring/index';
import './services/i18n/index';
import useNetwork from './components/hooks/useNetwork';
import ChainProvider from './providers/ChainProvider';
export const AppWrapper = () => {
  const chain = useNetwork();
  const res = useMemo(() => initApp(chain), [chain]);
  if (!res) {
    return null;
  }
  const { services, stores, themeAndStyle, chainId } = res;

  return (
    <LangRouter preLangBasename={IS_DEV ? '' : config.urlBase}>
      <I18nextProvider i18n={i18n}>
        <Provider {...services} {...stores} chainId={chainId}>
          <StylesProvider injectFirst>
            <ThemeProvider theme={baseTheme}>
              <SCThemeProvider theme={themeAndStyle}>
                <CssBaseline />
                <ChainProvider chainId={chainId}>
                  <ErrorMonitoring.ErrorBoundary>
                    <App />
                  </ErrorMonitoring.ErrorBoundary>
                </ChainProvider>
              </SCThemeProvider>
            </ThemeProvider>
          </StylesProvider>
        </Provider>
      </I18nextProvider>
    </LangRouter>
  );
};
