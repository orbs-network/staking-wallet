/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from 'react-router-dom';
import React, { ReactNode, useEffect, useState } from 'react';
import useNetwork from '../components/hooks/useNetwork';
import ProviderWrapper from './ProviderWrapper';
import { addChangeEvents, forceChainChange, getSupportedChains, getWeb3Instace, isWrongNetwork } from '../utils/web3';
import WrongNetwork from '../components/WrongNetwork';
import { CONTARCTS_NAMES, DEFAULT_CHAIN, NETWORK_QUERY_PARAM } from '../constants';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { CssBaseline, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { AppStyles, themes } from '../theme/Theme';
import errorMonitoring from '../services/error-monitoring';
import ContractRegistry from '../services/contarcs/contract-registry';
import config from '../config';
import { INetworkContractAddresses } from '../types/index';

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

const getAddresses = async (chain: number) => {
  const web3 = getWeb3Instace();
  if (!web3 || !chain) {
    return;
  }
  const network = config.networks[chain];
  if (!network) {
    return;
  }
  const { contractsRegistry, erc20Contract } = network;

  try {
    const registryContract = new ContractRegistry(web3, contractsRegistry);
    const addresses = await registryContract.getContracts<INetworkContractAddresses>(CONTARCTS_NAMES);
    addresses.erc20Contract = erc20Contract;
    return addresses;
  } catch (error) {}
};

const NetworkWrapper = ({ children }: IProps) => {
  const { chain, noProvider } = useNetwork();
  const location = useLocation();
  const [forcedChain, setForcedChain] = useState<number | undefined>(undefined);
  const [selectedChain, setSelectedChain] = useState<number | undefined>(undefined);
  const [addresses, setAddresses] = useState({} as INetworkContractAddresses);
  const [isLoading, setIsLoading] = useState(true);
  const detectForcedNetwork = () => {
    const network = new URLSearchParams(location.search).get(NETWORK_QUERY_PARAM);
    if (network) {
      setForcedChain(Number(network));
    }
  };

  useEffect(() => {
    if (!isLoading) {
      hideLoader();
    }
  }, [isLoading]);

  useEffect(() => {
    detectForcedNetwork();
    addChangeEvents();
  }, []);

  useEffect(() => {
    const handleChain = async () => {
      if (chain) {
        setSelectedChain(chain);
        const networkAddresses = await getAddresses(chain);
        if (networkAddresses) {
          setAddresses(networkAddresses);
        }
        setIsLoading(false);
      }
      if (noProvider) {
        setIsLoading(false);
      }
    };
    handleChain();
  }, [chain, forcedChain, noProvider]);

  if (!noProvider && !selectedChain) {
    return null;
  }
  if (isLoading) {
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
            <ProviderWrapper addresses={addresses} chain={selectedChain}>
              {children}
            </ProviderWrapper>
          )}
        </errorMonitoring.ErrorBoundary>
      </SCThemeProvider>
    </ThemeProvider>
  );
};

export default NetworkWrapper;
