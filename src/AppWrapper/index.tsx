import React, { useEffect } from 'react';
import { App } from '../App';
import '../services/i18n/index';
import web3Service from '../services/web3Service';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { CssBaseline, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';

import useLogic from './useLogic';
import { AppStyles, getTheme } from '../theme/Theme';
import errorMonitoring from '../services/error-monitoring/index';
import WrongNetwork from '../components/WrongNetwork';
import ProviderWrapper from '../wrappers/ProviderWrapper';
import AppLoader from '../components/app-loader';


const getThemeAndStyles = (theme: Theme) => {
  return {
    ...theme,
    styles: AppStyles,
  };
};


web3Service.addNetworkChangedEvent();

export const AppWrapper = () => {
  const { isLoading, chain, forcedChain, chainLoaded, hideLoader, wrongChain } = useLogic();

  const theme = getTheme(chain);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
    
        preventDuplicate
      >
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
              ) : (
                <div>Error</div>
              )}
            </>
          </errorMonitoring.ErrorBoundary>
        </SCThemeProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
