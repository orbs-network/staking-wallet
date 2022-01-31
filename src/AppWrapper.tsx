import { CssBaseline, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { observer, Provider } from 'mobx-react';
import React from 'react';
import { App } from './App';
import { DEFAULT_CHAIN } from './constants';
import errorMonitoring from './services/error-monitoring/index';
import './services/i18n/index';
import { AppStyles, themes } from './theme/Theme';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import useLogic from './useLogic';
import NotSupportedNetworkWrapper from './wrappers/NotSupportedNetworkWrapper';
import { Header } from './components/nav/Header';
import NoEthereumProviderWrapper from './wrappers/NoEthereumProviderWrapper';
const getTheme = (chain: number) => {
  const theme = themes[chain] || themes[DEFAULT_CHAIN];
  return theme;
};

const getThemeAndStyles = (theme: Theme) => {
  return {
    ...theme,
    styles: AppStyles,
  };
};

export const AppWrapper = observer(() => {
  const { notSupportedChain, services, stores, selectedChain, appLoading, web3Service, noEthProvider } = useLogic();
  const theme = getTheme(selectedChain);
  const showApp = services && stores;
  if (!noEthProvider && appLoading) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <SCThemeProvider theme={getThemeAndStyles(theme)}>
        <CssBaseline />
        <errorMonitoring.ErrorBoundary>
          <>
            <Header />
            {noEthProvider ? (
              <NoEthereumProviderWrapper />
            ) : notSupportedChain ? (
              <NotSupportedNetworkWrapper web3Service={web3Service} />
            ) : showApp ? (
              <Provider {...services} {...stores} chainId={selectedChain}>
                <App />
              </Provider>
            ) : null}
          </>
        </errorMonitoring.ErrorBoundary>
      </SCThemeProvider>
    </ThemeProvider>
  );
});
