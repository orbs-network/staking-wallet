import { Button, Divider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
// @ts-ignore
import { ReactComponent as walletIcon } from '../../assets/wallet.svg';
// @ts-ignore
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
import { ReactComponent as QrIcon } from '../../assets/qr.svg';
import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
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

const LoweCaseButton = styled(Button)({
  textTransform: 'none',
});

const QR_IMAGE_DIMENSION = 400;
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
    maxWidth: '100%',
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

  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={sectionTitlesTranslations('walletInfo')} icon={walletIcon} />

      <CommonDivider />

      <Grid item xs={12}>
        <Typography>{walletInfoSectionTranslations('address')}</Typography>
      </Grid>
      <Grid container direction={'row'} justify={'space-between'}>
        <Grid item>
          <Typography variant={'h4'} data-testid={'text-active-address'}>
            {cryptoWalletIntegrationStore.mainAddress}
          </Typography>
        </Grid>

        <Grid item>
          <LoweCaseButton onClick={copyAddress} startIcon={<CopyIcon />}>
            {walletInfoSectionTranslations('copy')}
          </LoweCaseButton>
          {'  '}
          <LoweCaseButton onClick={showQrModal.setTrue} startIcon={<QrIcon />}>
            {walletInfoSectionTranslations('qr')}
          </LoweCaseButton>
        </Grid>
      </Grid>
      <CommonDivider />

      <Modal disableAutoFocus open={showQrModal.value} onClose={showQrModal.setFalse}>
        <CenteredContainerGridForQr>
          <QRCode
            value={cryptoWalletIntegrationStore.mainAddress}
            logoImage={'https://icodrops.com/wp-content/uploads/2018/01/Orbs-logo.jpg'}
            logoWidth={100}
            logoHeight={100}
            size={QR_IMAGE_DIMENSION}
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
