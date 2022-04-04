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
import { DEFAULT_CHAIN, hasInjectedProvider } from '../constants';
import {AppContext} from '../context/app-context/index'

const getThemeAndStyles = (theme: Theme) => {
  return {
    ...theme,
    styles: AppStyles,
  };
};


if(hasInjectedProvider){
  web3Service.addNetworkChangedEvent();
}

export const AppWrapper = () => {
  const { isLoading, chain, forcedChain, chainLoaded, hideLoader, wrongChain } = useLogic();

  const theme = getTheme(chain);


  return (
    <AppContext>
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
                <ProviderWrapper hideLoader={hideLoader} chain={chain || forcedChain || DEFAULT_CHAIN} >
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
    </AppContext>
  );
};
