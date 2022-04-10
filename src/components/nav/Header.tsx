import { AppBarProps, Box, Grid, ToolbarProps, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { LanguagesSelector } from './LanguagesSelector';
import styled from 'styled-components';
import { ContentContainer } from '../structure/ContentContainer';
import NetworkIndicator from '../NetworkIndicator';
import { MobXProviderContext } from 'mobx-react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import WalletAddress from './WalletAddress';
import { useCryptoWalletIntegrationStore } from '../../store/storeHooks';
import useScroll from '../../hooks/useScroll';
import { getChainConfig } from '../../utils';
import { hasInjectedProvider } from '../../constants';
import useScrollDirection from '../../hooks/useScrollDirection';
import useResize from '../../hooks/useResize';
import { Link } from 'react-router-dom';

const StyledToolBar = styled(Toolbar)<ToolbarProps>({});

const useStyes = makeStyles((theme) => ({
  logo: {
    [theme.breakpoints.down('sm')]: {
      zoom: 0.5,
    },
  },
  toolbar: {
    marginBottom: '7.5em',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '10em',
    },
  },
  container: (props: any) => ({
    position: 'relative',
    height: '100%',
    borderBottom: props.scrollPosition <= 30  ? `0.5px solid ${theme.palette.secondary.main}` : null,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
  }),
  root: (props: any) => ({
    background: props.scrollPosition >= 30  ? '#000000' : props.width <= 600 ? '#000000' :  'transparent',
    transition: '0.3s all',
    position: 'fixed',
    height: '95px',
    transform: props.scrollPosition >= 70 && props.width <= 600 && !props.scrollingTop ? 'translate(0, -100%)' : 'translate(0, 0%)',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
  }),
  walletAddressDesktop: {
    marginLeft: '15px',
    width: 137,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  walletAddressMobile: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      marginBottom: '15px',
      width: '100%',  
    },
  },
  languageSelector: {
    marginLeft: 25,
  },
  networkIndicator: {
    marginLeft: 'auto',
    width: 170,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mobileGrid: {
    display: 'none',
    width: '100%',
    marginTop: 20,
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  networkIndicatorMobile: {
    width: '100%',
    maxWidth: 250,
  },
}));

export const Header = () => {
  const { chainId } = useContext(MobXProviderContext);
  const { mainAddress, isConnectedToWallet } = useCryptoWalletIntegrationStore();
  
  const chainConfig = useMemo(() => getChainConfig(chainId), [chainId]);
  const TetraLogoAndIconSvg: any = chainConfig.ui.navbar.logo;

  const scrollPosition = useScroll();
  const scrollingTop = useScrollDirection();
  const [width] = useResize();

  const classes = useStyes({ scrollPosition, scrollingTop, width });

  return (
    <>
      <AppBar className={classes.root} style={{ boxShadow: 'none', border: `none` }}>
        <ContentContainer style={{ height: '100%' }}>
          <StyledToolBar disableGutters className={classes.container}>
            <Grid container direction={'row'} alignItems={'center'} justify={'space-between'} style={{ zIndex: 99 }}>
              <Grid item>
                <Link to='/'>
                <TetraLogoAndIconSvg className={classes.logo} />
                </Link>
              </Grid>
              {hasInjectedProvider && (
                <Grid item className={classes.networkIndicator}>
                  <NetworkIndicator chainId={chainId} />
                </Grid>
              )}

              {isConnectedToWallet && mainAddress && (
                <Grid item className={classes.walletAddressDesktop}>
                  <WalletAddress address={mainAddress} />
                </Grid>
              )}

              <Grid item className={classes.languageSelector}>
                <LanguagesSelector />
              </Grid>
            </Grid>
            <Grid container className={classes.mobileGrid} direction='column'>
              {isConnectedToWallet && mainAddress && (
                <Grid item className={classes.walletAddressMobile}>
                  <WalletAddress address={mainAddress} />
                </Grid>
              )}
              {isConnectedToWallet && (
                <Grid item className={classes.networkIndicatorMobile}>
                  <NetworkIndicator chainId={chainId} />
                </Grid>
              )}
            </Grid>
          </StyledToolBar>
        </ContentContainer>
      </AppBar>
      {/* DEV_NOTE : Second 'Toolbar' is a trick offered by MUI to keep the content properly below the fixed AppBar */}
      {/* DEV_NOTE : We should add any 'bottom padding/margin' of the 'StyledAppBar' to the value we want to have from the page content*/}
      <Toolbar className={classes.toolbar} />
    </>
  );
};
