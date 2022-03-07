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
      marginBottom: '6.5em',
    },
  },
  container: (props: any) => ({
    position: 'relative',
    height: '100%',
    borderBottom: props.scrollPosition <= 30 ? `0.5px solid ${theme.chain.current.mainColor}` : null,
  }),
  root: (props: any) => ({
    background: props.scrollPosition >= 30 ? '#000000' : 'transparent',

    transition: '0.2s all',
    position: 'fixed',
    height: '95px',
    [theme.breakpoints.down('xs')]: {
      height: '120px',
    },
  }),
  walletAddress: {
    marginLeft: '15px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0px',
      marginRight: 20,
      marginTop: 15
    },
  },
  languageSelector: {
    marginLeft: 25 ,
    [theme.breakpoints.down('xs')]: {
      marginTop: 15
    },
  }
}));

export const Header = () => {
  const { chainId } = useContext(MobXProviderContext);
  const { mainAddress } = useCryptoWalletIntegrationStore();
  const chainConfig = useMemo(() => getChainConfig(chainId), [chainId]);
  const TetraLogoAndIconSvg: any = chainConfig.ui.navbar.logo;

  const scrollPosition = useScroll();
  const classes = useStyes({ scrollPosition });

  return (
    <>
      <AppBar className={classes.root} style={{ boxShadow: 'none', border: `none` }}>
        <ContentContainer style={{ height: '100%' }}>
          <StyledToolBar disableGutters className={classes.container}>
            <Grid container direction={'row'} alignItems={'center'} justify={'space-between'} style={{ zIndex: 99 }}>
              <Grid item>
                <TetraLogoAndIconSvg className={classes.logo} />
              </Grid>
              <Grid item style={{ marginLeft: 'auto' }}>
                <NetworkIndicator chainId={chainId} />
              </Grid>
              <Grid item className={classes.walletAddress}>
                <WalletAddress address={mainAddress} />
              </Grid>

              <Grid item className={classes.languageSelector}>
                <LanguagesSelector />
              </Grid>
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
