import { AppBarProps, Box, Grid, ToolbarProps, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import useScrollDirection from '../../hooks/useScrollDirection';
import useResize from '../../hooks/useResize';
import { Link } from 'react-router-dom';
import { CommonActionButton } from '../base/CommonActionButton';
import WalletOptionsDialog from '../../sections/connect-wallet/WalletOptionsDialog';
import WrongNetworkPopup from '../../sections/connect-wallet/WrongNetworkPopup';
import useWalletConnector from '../../hooks/useWalletConnector';
import { ConnectWalletOptions } from '../../services/wallet-connection';
import { walletLegalAgreement } from '../../services/wallet-connection/legalAgreement';
import { useConnectWalletSectionTranslations } from '../../translations/translationsHooks';
import PageLoader from '../loaders/page-loader';
import CustomSnackbar from '../snackbar/custom-snackbar';

const StyledToolBar = styled(Toolbar)<ToolbarProps>({});

const useStyes = makeStyles((theme) => ({
  logo: {
    [theme.breakpoints.down('sm')]: {
      zoom: 0.5,
    },
  },
  toolbar: {
    marginBottom: '3.75em',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '3.75em',
    },
  },
  container: (props: any) => ({
    position: 'relative',
    height: '100%',
    borderBottom: props.scrollPosition <= 30 ? `0.5px solid ${theme.palette.secondary.main}` : null,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
  }),
  root: (props: any) => ({
    background: props.scrollPosition >= 30 ? '#000000' : props.width <= 600 ? '#000000' : 'transparent',
    transition: '0.3s all',
    position: 'fixed',
    height: '95px',
    transform:
      props.scrollPosition >= 70 && props.width <= 600 && !props.scrollingTop
        ? 'translate(0, -100%)'
        : 'translate(0, 0%)',
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
  connectButton: {
    marginLeft: 15,
    height: '35px !important',
    width: '170px !important',
    minWidth: '170px !important',
    padding: '0 !important',
    [theme.breakpoints.down('xs')]: {
      width: '100% !important',
      minWidth: 'unset !important',
      marginLeft: 0,
      marginBottom: 15,
    },
  },
  connectButtonDesktop: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
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
  },
}));

export const Header = () => {
  const { chainId } = useContext(MobXProviderContext);
  const { mainAddress, isConnectedToWallet } = useCryptoWalletIntegrationStore();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(95);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const {
    connect,
    connectLoading,
    connectionErrorMessage,
    clearConnectionError,
    showWrongNetworkPopup,
    setShowWrongNetworkPopup,
    userChainId,
  } = useWalletConnector();
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();

  const chainConfig = useMemo(() => getChainConfig(chainId), [chainId]);
  const TetraLogoAndIconSvg: any = chainConfig.ui.navbar.logo;

  const scrollPosition = useScroll();
  const scrollingTop = useScrollDirection();
  const [width] = useResize();

  const classes = useStyes({ scrollPosition, scrollingTop, width });

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (!headerRef.current) {
        return;
      }

      const nextHeight = Math.ceil(headerRef.current.getBoundingClientRect().height);
      setHeaderHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight));
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    const ResizeObserverConstructor = (window as any).ResizeObserver;
    const resizeObserver = ResizeObserverConstructor ? new ResizeObserverConstructor(updateHeaderHeight) : null;

    if (resizeObserver && headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [chainId, isConnectedToWallet, mainAddress, width]);

  const handleConnectClicked = useCallback(() => {
    if (!walletLegalAgreement.getAccepted()) {
      const connectWalletSection = document.getElementById('connectWalletSection');
      if (connectWalletSection) {
        connectWalletSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setShowWalletOptions(true);
  }, []);

  const handleWalletSelected = useCallback(
    async (options: ConnectWalletOptions) => {
      setShowWalletOptions(false);
      await connect(options);
    },
    [connect],
  );

  return (
    <>
      <WrongNetworkPopup
        userChainId={userChainId}
        open={showWrongNetworkPopup}
        onClose={() => setShowWrongNetworkPopup(false)}
      />
      <PageLoader open={connectLoading} />
      <CustomSnackbar
        show={!!connectionErrorMessage}
        hide={clearConnectionError}
        message={connectionErrorMessage}
        variant='error'
        autoHideDuration={6000}
      />
      <WalletOptionsDialog
        open={showWalletOptions}
        onClose={() => setShowWalletOptions(false)}
        onSelect={handleWalletSelected}
      />
      <AppBar ref={headerRef} className={classes.root} style={{ boxShadow: 'none', border: `none` }}>
        <ContentContainer style={{ height: '100%' }}>
          <StyledToolBar disableGutters className={classes.container}>
            <Grid container direction={'row'} alignItems={'center'} justify={'space-between'} style={{ zIndex: 99 }}>
              <Grid item>
                <Link to='/'>
                  <TetraLogoAndIconSvg className={classes.logo} />
                </Link>
              </Grid>
              <Grid item className={classes.networkIndicator}>
                <NetworkIndicator chainId={chainId} />
              </Grid>

              {isConnectedToWallet && mainAddress && (
                <Grid item className={classes.walletAddressDesktop}>
                  <WalletAddress address={mainAddress} />
                </Grid>
              )}

              {!isConnectedToWallet && (
                <Grid item className={classes.connectButtonDesktop}>
                  <CommonActionButton className={classes.connectButton} onClick={handleConnectClicked}>
                    {connectWalletSectionTranslations('connectYourAccount')}
                  </CommonActionButton>
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
              {!isConnectedToWallet && (
                <Grid item>
                  <CommonActionButton className={classes.connectButton} onClick={handleConnectClicked}>
                    {connectWalletSectionTranslations('connectYourAccount')}
                  </CommonActionButton>
                </Grid>
              )}
              <Grid item className={classes.networkIndicatorMobile}>
                <NetworkIndicator chainId={chainId} />
              </Grid>
            </Grid>
          </StyledToolBar>
        </ContentContainer>
      </AppBar>
      {/* DEV_NOTE : Spacer keeps page content below the fixed AppBar, including multi-row mobile headers. */}
      <div className={classes.toolbar} style={{ height: headerHeight }} />
    </>
  );
};
