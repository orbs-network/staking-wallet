/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from 'react-router-dom';
import React, { ReactNode, useEffect, useState } from 'react';
import useNetwork from '../components/hooks/useNetwork';
import ProviderWrapper from './ProviderWrapper';
import { addChangeEvents, forceChainChange, getSupportedChains, isWrongNetwork } from '../utils/web3';
import WrongNetwork from '../components/WrongNetwork';
import { DEFAULT_CHAIN, NETWORK_QUERY_PARAM } from '../constants';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { CssBaseline, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { AppStyles, themes } from '../theme/Theme';
import errorMonitoring from '../services/error-monitoring';

interface IProps {
  children: ReactNode;
}

const hideLoader = () => {
  const loader: any = document.querySelector('#centerDiv');
  loader.style.display = 'none';
};

const availableChains = getSupportedChains();

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

const NetworkWrapper = ({ children }: IProps) => {
  const { chain, noProvider } = useNetwork();
  const location = useLocation();
  const [forcedChain, setForcedChain] = useState<number | undefined>(undefined);
  const [selectedChain, setSelectedChain] = useState<number | undefined>(undefined);

  const detectForcedNetwork = () => {
    const network = new URLSearchParams(location.search).get(NETWORK_QUERY_PARAM);
    if (network) {
      setForcedChain(Number(network));
    }
  };

  useEffect(() => {
    detectForcedNetwork();
    addChangeEvents();
  }, []);

  useEffect(() => {
    if (chain) {
      setSelectedChain(chain);
      hideLoader();
    }
    if (noProvider) {
      hideLoader();
    }
  }, [chain, forcedChain, noProvider]);

  if (!noProvider && !selectedChain) {
    return null;
  }
  const wrongChain = isWrongNetwork(selectedChain, availableChains) || forceChainChange(forcedChain, selectedChain);
  const theme = getTheme(selectedChain);
  return (
    <ThemeProvider theme={theme}>
      <SCThemeProvider theme={getThemeAndStyles(theme)}>
        <CssBaseline />
        <errorMonitoring.ErrorBoundary>
          {wrongChain ? (
            <WrongNetwork availableChains={availableChains} selectedChain={Number(selectedChain)} />
          ) : (
            <ProviderWrapper chain={selectedChain}>{children}</ProviderWrapper>
          )}
        </errorMonitoring.ErrorBoundary>
      </SCThemeProvider>
    </ThemeProvider>
  );
};

export default NetworkWrapper;
