import { Button, Divider, GridProps } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import { ReactComponent as walletIcon } from '../../assets/wallet.svg';
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
import { ReactComponent as QrIcon } from '../../assets/qr.svg';

import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { useBoolean } from 'react-hanger';
import { QRCode } from 'react-qrcode-logo';
import styled from 'styled-components';
import { CommonDivider } from '../components/base/CommonDivider';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import {
  useAlertsTranslations,
  useSectionsTitlesTranslations,
  useWalletInfoSectionTranslations,
} from '../translations/translationsHooks';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Hidden from '@material-ui/core/Hidden';
import { CommonDialog } from '../components/modal/CommonDialog';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useConnection from '../hooks/useConnection';
import BaseLoader from '../components/loaders';
import AddressLoader from '../components/loaders/address-loader';
import customLoaders from '../components/loaders/custom-loaders';
const LoweCaseButton = styled(Button)({
  textTransform: 'none',
});

// DEV_NOTE : It seems that keeping a 1/4 ratio keeps the logo well placed.
const QR_IMAGE_DIMENSION_MD = 400;
const LOGO_DIMENSIONS_MD = 100;

const QR_IMAGE_DIMENSION_XS = 240;
const LOGO_DIMENSIONS_XS = 60;

// TODO : FUTURE : O.L : Unify this with the 'Wizard container' (have one basic styled component and extend from it)
const CenteredContainerGridForQr = styled((props) => (
  <Grid container direction={'column'} alignItems={'center'} {...props} />
))<GridProps>(({ theme }) => {
  theme = theme as Theme;

  return {
    position: 'fixed',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -35%)',
    width: 'min-content',
  };
});

const useStyles = makeStyles((theme) => ({
  button: {
    transition: '0.7s',

    '& svg path': {
      transition: '0.7s',
    },

    '&:hover': {
      color: theme.palette.secondary.main,

      '& svg path': {
        fill: theme.palette.secondary.light,
      },
    },
  },
}));

export const WalletInfoSection = observer(() => {
  const classes = useStyles();
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const walletInfoSectionTranslations = useWalletInfoSectionTranslations();
  const alertsTranslations = useAlertsTranslations();
  const { mainAddress } = useCryptoWalletIntegrationStore();
  const showSnackbarMessage = useBoolean(false);
  const showQrModal = useBoolean(false);

  const copyAddress = useCallback(() => {
    copy(mainAddress);
    showSnackbarMessage.setTrue();
  }, [mainAddress, showSnackbarMessage]);

  const theme = useTheme();
  const smOrLarger = useMediaQuery(theme.breakpoints.up('sm'));
  const mediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
  const largerThanLarge = useMediaQuery(theme.breakpoints.up('lg'));

  const qrDimensions = mediumOrLarger ? QR_IMAGE_DIMENSION_MD : QR_IMAGE_DIMENSION_XS;
  const logoDimensions = mediumOrLarger ? LOGO_DIMENSIONS_MD : LOGO_DIMENSIONS_XS;

  const walletAddressExtraStyle = useMemo<React.CSSProperties>(() => {
    const extraStyle: React.CSSProperties = {};

    // For smaller screens we want to emphasize the text
    if (!smOrLarger) {
      extraStyle.fontWeight = 'bold';
    }

    return extraStyle;
  }, [smOrLarger]);

  useConnection(!!mainAddress);
  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={sectionTitlesTranslations('walletInfo')} icon={walletIcon} />

      <CommonDivider />

      {/*<Grid item xs={12}>*/}
      {/*  <Typography variant={smOrLarger ? 'body1' : 'caption'}>{walletInfoSectionTranslations('address')}</Typography>*/}
      {/*</Grid>*/}

      {/* DEV_NOTE : On smaller than 'large' the spacing will be vertical */}
      <Grid
        container
        item
        direction={smOrLarger ? 'row' : 'column'}
        alignItems={'center'}
        spacing={largerThanLarge ? 2 : 1}
      >
        {/* Address */}
        <Grid
          item
          sm={12}
          lg={9}
          id={'addressItem'}
          style={{ maxWidth: '100%', textAlign: largerThanLarge ? 'unset' : 'center' }}
        >
          <BaseLoader isLoading={!mainAddress} customLoader={customLoaders.address} hideContent>
            <Typography
              variant={smOrLarger ? 'h4' : 'body2'}
              data-testid={'text-active-address'}
              style={walletAddressExtraStyle}
              noWrap
            >
              {mainAddress}
            </Typography>
          </BaseLoader>
        </Grid>

        {/* Buttons */}
        <Grid container direction={'row'} item sm={12} lg={3} justify={'flex-end'}>
          <Grid item xs={6} lg={5}>
            <LoweCaseButton className={classes.button} fullWidth onClick={copyAddress} startIcon={<CopyIcon />}>
              {walletInfoSectionTranslations('copy')}
            </LoweCaseButton>
          </Grid>
          {/* TODO : FUTURE : O.L : Make the divider work in smaller screens as well*/}
          {/* DEV_NOTE : we hide the divider in smaller viewports because of the flex (we want the buttons to have the width equals to half the viewport) */}
          <Hidden mdDown>
            <Divider variant='fullWidth' orientation={'vertical'} style={{ color: '#656565' }} />
          </Hidden>
          <Grid item xs={6} lg={5}>
            <LoweCaseButton className={classes.button} fullWidth onClick={showQrModal.setTrue} startIcon={<QrIcon />}>
              {walletInfoSectionTranslations('qr')}
            </LoweCaseButton>
          </Grid>
        </Grid>
      </Grid>

      <CommonDivider />

      <CommonDialog
        disableBackdropClick={false}
        disableAutoFocus
        open={showQrModal.value}
        onClose={showQrModal.setFalse}
      >
        <CenteredContainerGridForQr>
          <Grid item id={'qr-code-wrap'}>
            <QRCode
              value={mainAddress}
              logoImage={'https://icodrops.com/wp-content/uploads/2018/01/Orbs-logo.jpg'}
              logoWidth={logoDimensions}
              logoHeight={logoDimensions}
              size={qrDimensions}
              qrStyle={'dots'}
              fgColor={'#07142E'}
            />
          </Grid>
        </CenteredContainerGridForQr>
      </CommonDialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showSnackbarMessage.value}
        autoHideDuration={2000}
        onClose={showSnackbarMessage.setFalse}
      >
        <CustomSnackBarContent
          variant={'success'}
          message={alertsTranslations('walletAddressWasCopied')}
          onClose={showSnackbarMessage.setFalse}
          data-testid={'message-address-was-copied'}
        />
      </Snackbar>
    </Section>
  );
});
