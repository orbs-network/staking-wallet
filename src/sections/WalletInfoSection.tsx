import { Button, Divider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as walletIcon } from '../../assets/wallet.svg';
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
import { ReactComponent as QrIcon } from '../../assets/qr.svg';
import QR from './components/qr';
import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { UseBoolean, useBoolean } from 'react-hanger';
import styled from 'styled-components';
import { CommonDivider } from '../components/base/CommonDivider';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import {
  useAlertsTranslations,
  useSectionsTitlesTranslations,
  useWalletInfoSectionTranslations,
} from '../translations/translationsHooks';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Hidden from '@material-ui/core/Hidden';
import makeStyles from '@material-ui/core/styles/makeStyles';

const LoweCaseButton = styled(Button)({
  textTransform: 'none',
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

const copyAddress = (mainAddress: string, showSnackbarMessage: UseBoolean) => {
  copy(mainAddress);
  showSnackbarMessage.setTrue();
};

export const WalletInfoSection = observer(() => {
  const classes = useStyles();
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const walletInfoSectionTranslations = useWalletInfoSectionTranslations();
  const alertsTranslations = useAlertsTranslations();
  const { mainAddress } = useCryptoWalletIntegrationStore();
  const showSnackbarMessage = useBoolean(false);
  const showQrModal = useBoolean(false);

  const theme = useTheme();
  const smOrLarger = useMediaQuery(theme.breakpoints.up('sm'));
  const largerThanLarge = useMediaQuery(theme.breakpoints.up('lg'));

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
          <Typography
            variant={smOrLarger ? 'h4' : 'body2'}
            data-testid={'text-active-address'}
            style={walletAddressExtraStyle}
            noWrap
          >
            {mainAddress}
          </Typography>
        </Grid>

        {/* Buttons */}
        <Grid container direction={'row'} item sm={12} lg={3} justify={'flex-end'}>
          <Grid item xs={6} lg={5}>
            <LoweCaseButton
              className={classes.button}
              fullWidth
              onClick={() => copyAddress(mainAddress, showSnackbarMessage)}
              startIcon={<CopyIcon />}
            >
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

      <QR showQrModal={showQrModal} mainAddress={mainAddress} />

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
