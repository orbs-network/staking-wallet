import React from 'react';
import { App } from '../App';
import '../services/i18n/index';
import web3Service from '../services/web3Service';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { CssBaseline, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import useLogic from './useLogic';
import { AppStyles, themes } from '../theme/Theme';
import errorMonitoring from '../services/error-monitoring/index';
import WrongNetwork from '../components/WrongNetwork';
import ProviderWrapper from '../wrappers/ProviderWrapper';
import AppLoader from '../components/app-loader';
import { DEFAULT_CHAIN } from '../constants';

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

web3Service.addChangeEvents();

export const AppWrapper = () => {
  const { isLoading, chain, forcedChain, chainLoaded, hideLoader, wrongChain } = useLogic();

  const theme = getTheme(chain);

  return (
    <ThemeProvider theme={theme}>
      <SCThemeProvider theme={getThemeAndStyles(theme)}>
        <CssBaseline />
        <errorMonitoring.ErrorBoundary>
          <>
            {isLoading && <AppLoader />}
            {wrongChain ? (
              <WrongNetwork hideLoader={hideLoader} selectedChain={Number(chain)} forcedChain={forcedChain} />
            ) : chainLoaded ? (
              <ProviderWrapper hideLoader={hideLoader} chain={chain}>
                <App />
              </ProviderWrapper>
            ) : null}
          </>
        </errorMonitoring.ErrorBoundary>
      </SCThemeProvider>
    </ThemeProvider>
  );
};
