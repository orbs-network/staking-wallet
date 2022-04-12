import React from 'react';
import { App } from '../App';
import '../services/i18n/index';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { CssBaseline, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import useLogic from './useLogic';
import { AppStyles, getTheme } from '../theme/Theme';
import errorMonitoring from '../services/error-monitoring/index';
import ProviderWrapper from '../wrappers/ProviderWrapper';
import AppLoader from '../components/app-loader';

const getThemeAndStyles = (theme: Theme) => {
  return {
    ...theme,
    styles: AppStyles,
  };
};


export const AppWrapper = () => {
  const { isLoading, chain } = useLogic();
  const theme = getTheme(chain);


  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider preventDuplicate>
        <SCThemeProvider theme={getThemeAndStyles(theme)}>
          <CssBaseline />
          <errorMonitoring.ErrorBoundary>
            {isLoading ? (
              <AppLoader />
            ) : (
              <ProviderWrapper chain={chain}>
                <App />
              </ProviderWrapper>
            )}
          </errorMonitoring.ErrorBoundary>
        </SCThemeProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
