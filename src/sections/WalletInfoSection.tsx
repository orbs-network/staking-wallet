import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
// @ts-ignore
import { ReactComponent as walletIcon } from '../../assets/wallet.svg';
// @ts-ignore
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
// @ts-ignore
import { ReactComponent as QrIcon } from '../../assets/qr.svg';
import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { useBoolean } from 'react-hanger';
import Modal from '@material-ui/core/Modal';
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

const LoweCaseButton = styled(Button)({
  textTransform: 'none',
});

const QR_IMAGE_DIMENSION_MD = 400;
const LOGO_DIMENSIONS_MD = 100;

const QR_IMAGE_DIMENSION_XS = 250;
const LOGO_DIMENSIONS_XS = 50;

// TODO : FUTURE : O.L : Unify this with the 'Wizard container' (have one basic styled component and extend from it)
const CenteredContainerGridForQr = styled(props => (
  <Grid container direction={'column'} alignItems={'center'} {...props} />
))(({ theme }) => {
  theme = theme as Theme;

  return {
    position: 'fixed',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -35%)',
    width: 'min-content',
  };
});

export const WalletInfoSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const walletInfoSectionTranslations = useWalletInfoSectionTranslations();
  const alertsTranslations = useAlertsTranslations();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const showSnackbarMessage = useBoolean(false);
  const showQrModal = useBoolean(false);

  const copyAddress = useCallback(() => {
    copy(cryptoWalletIntegrationStore.mainAddress);
    showSnackbarMessage.setTrue();
  }, [cryptoWalletIntegrationStore.mainAddress, showSnackbarMessage]);

  const theme = useTheme();
  const smOrLarger = useMediaQuery(theme.breakpoints.up('sm'));
  const mediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
  const largeOrLarger = useMediaQuery(theme.breakpoints.up('lg'));

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

  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={sectionTitlesTranslations('walletInfo')} icon={walletIcon} />

      <CommonDivider />

      <Grid item xs={12}>
        <Typography variant={smOrLarger ? 'body1' : 'caption'}>{walletInfoSectionTranslations('address')}</Typography>
      </Grid>
      <Grid container item direction={'row'} spacing={2}>
        {/* Address */}
        <Grid item sm={12} lg={8}>
          <Typography
            variant={smOrLarger ? 'h4' : 'body2'}
            data-testid={'text-active-address'}
            style={walletAddressExtraStyle}
          >
            {cryptoWalletIntegrationStore.mainAddress}
          </Typography>
        </Grid>

        {/* Buttons */}
        <Grid container direction={'row'} item sm={12} lg={4} justify={'flex-end'}>
          <Grid item xs={6} lg={3}>
            <LoweCaseButton fullWidth onClick={copyAddress} startIcon={<CopyIcon />}>
              {walletInfoSectionTranslations('copy')}
            </LoweCaseButton>
          </Grid>
          <Grid item xs={6} lg={3}>
            <LoweCaseButton fullWidth onClick={showQrModal.setTrue} startIcon={<QrIcon />}>
              {walletInfoSectionTranslations('qr')}
            </LoweCaseButton>
          </Grid>
        </Grid>
      </Grid>

      <Modal disableAutoFocus open={showQrModal.value} onClose={showQrModal.setFalse}>
        <CenteredContainerGridForQr>
          <QRCode
            value={cryptoWalletIntegrationStore.mainAddress}
            logoImage={'https://icodrops.com/wp-content/uploads/2018/01/Orbs-logo.jpg'}
            logoWidth={logoDimensions}
            logoHeight={logoDimensions}
            size={qrDimensions}
            qrStyle={'dots'}
            fgColor={'#07142E'}
          />
        </CenteredContainerGridForQr>
      </Modal>

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
