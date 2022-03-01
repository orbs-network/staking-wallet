import { AppBarProps, Box, Grid, ToolbarProps, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React, { useCallback, useContext, useState } from 'react';
import { LanguagesSelector } from './LanguagesSelector';
import styled from 'styled-components';
import { ContentContainer } from '../structure/ContentContainer';
import { ReactComponent as TetraLogoAndIconSvg } from '../../../assets/logos/tetra_logo_with_icon.svg';
import NetworkIndicator from '../NetworkIndicator';
import { MobXProviderContext } from 'mobx-react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { IExtenedTheme } from '../../theme/Theme';
import WalletAddress from './WalletAddress';
import config from '../../config';
import { useCryptoWalletIntegrationStore } from '../../store/storeHooks';
import CustomSnackbar from '../snackbar/custom-snackbar';
import { useAlertsTranslations, useWalletInfoSectionTranslations } from '../../translations/translationsHooks';

const StyledAppBar = styled(AppBar)<AppBarProps>({
  borderBottom: '2px solid #363636',
  height: '95px',
});

const StyledToolBar = styled(Toolbar)<ToolbarProps>({});

const useStyes = makeStyles((theme: IExtenedTheme) => ({
  logoContainer: {},
  networkImage: {
    position: 'absolute',
    right: 0,
    height: '100%',
    overflow: 'hidden',
    width: '100%',

    '& img': {
      height: '140px',
      top: '50%',
      transform: 'translate(0, -50%)',
      position: 'absolute',
      right: 0,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logo: {
    [theme.breakpoints.down('sm')]: {
      zoom: 0.5,
    },
  },
  container: {
    position: 'relative',
    height: '100%',
  },
}));

const getNavbarImage = (chain: number) => {
  const network = config.networks[chain];
  if (!network) {
    return '';
  }
  return network.navbarImage;
};

export const Header = () => {
  const { chainId } = useContext(MobXProviderContext);
  const { mainAddress } = useCryptoWalletIntegrationStore();

  const classes = useStyes();

  return (
    <>
      <StyledAppBar position='fixed'>
        <ContentContainer style={{ height: '100%' }}>
          <Box className={classes.networkImage}>
            <img src={getNavbarImage(chainId)} />
          </Box>
          <StyledToolBar disableGutters className={classes.container}>
            <Grid container direction={'row'} alignItems={'center'} justify={'space-between'} style={{ zIndex: 99 }}>
              <Grid item className={classes.logoContainer}>
                <TetraLogoAndIconSvg className={classes.logo} />
              </Grid>
              <Grid item style={{ marginLeft: 'auto' }}>
                <NetworkIndicator chainId={chainId} />
              </Grid>
              <Grid item style={{ marginLeft: 15 }}>
                <WalletAddress address={mainAddress} />
              </Grid>

              <Grid item style={{ marginLeft: 25 }}>
                <LanguagesSelector />
              </Grid>
            </Grid>
          </StyledToolBar>
        </ContentContainer>
      </StyledAppBar>
      {/* DEV_NOTE : Second 'Toolbar' is a trick offered by MUI to keep the content properly below the fixed AppBar */}
      {/* DEV_NOTE : We should add any 'bottom padding/margin' of the 'StyledAppBar' to the value we want to have from the page content*/}
      <Toolbar style={{ marginBottom: '2.5em' }} />
    </>
  );
};
