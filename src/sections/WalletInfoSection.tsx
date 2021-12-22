import { Button, Divider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as walletIcon } from '../../assets/wallet.svg';
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
import { ReactComponent as QrIcon } from '../../assets/qr.svg';
import QR from './components/qr';
import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { useBoolean } from 'react-hanger';
import styled from 'styled-components';
import { CommonDivider } from '../components/base/CommonDivider';
import { Section } from '../components/structure/Section';
import { SectionHeader } from '../components/structure/SectionHeader';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import {
  useAlertsTranslations,
  useSectionsTitlesTranslations,
  useWalletInfoSectionTranslations,
} from '../translations/translationsHooks';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Hidden from '@material-ui/core/Hidden';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useConnection from '../hooks/useConnection';
import BaseLoader from '../components/loaders';
import Loaders from '../components/loaders/loader-components/index';
import CustomSnackbar from '../components/snackbar/custom-snackbar';
import { getWalletAddressExtraStyle } from './utils/index';
import ODNP from '@open-defi-notification-protocol/widget';

const LoweCaseButton = styled(Button)({
  textTransform: 'none',
});

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 'fit-content',
  },
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
  bellIcon: {
    fontSize: '30px',
    '& path': {},
  },
}));

const odnp = new ODNP();

odnp.init();
odnp.hide();
odnp.mainDiv.style.color = 'black';

export const WalletInfoSection = observer(() => {
  const classes = useStyles();
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const walletInfoSectionTranslations = useWalletInfoSectionTranslations();
  const alertsTranslations = useAlertsTranslations();
  const { mainAddress } = useCryptoWalletIntegrationStore();
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const showQrModal = useBoolean(false);

  const copyAddress = useCallback(() => {
    copy(mainAddress);
    setShowSnackbar(true);
  }, [mainAddress]);

  const theme = useTheme();
  const smOrLarger = useMediaQuery(theme.breakpoints.up('sm'));
  const largerThanLarge = useMediaQuery(theme.breakpoints.up('lg'));

  const onClick = (address: string) => {
    odnp.show(address, 'orbs');
  };

  return (
    <Section>
      {/* Balance */}
      <Grid container>
        <Grid item xs={6}>
          <SectionHeader title={sectionTitlesTranslations('walletInfo')} icon={walletIcon} />
        </Grid>
        <Grid item xs={6} justify='flex-end' alignItems='center' style={{ display: 'flex' }}>
          <LoweCaseButton
            className={classes.button}
            onClick={() => onClick(mainAddress)}
            startIcon={<NotificationsNoneOutlinedIcon style={{ fontSize: '36px', transform: 'translate(6px)' }} />}
          >
            {walletInfoSectionTranslations('notifications')}
          </LoweCaseButton>
        </Grid>
      </Grid>

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
          <BaseLoader isLoading={!mainAddress} LoaderComponent={Loaders.Address} hideContent>
            <Typography
              variant={smOrLarger ? 'h4' : 'body2'}
              data-testid={'text-active-address'}
              style={getWalletAddressExtraStyle(smOrLarger)}
              noWrap
            >
              {mainAddress}
            </Typography>
          </BaseLoader>
        </Grid>

        {/* Buttons */}
        <Grid container direction={'row'} item sm={12} lg={3} justify={'flex-end'}>
          <Grid item xs={6} lg={5}>
            <LoweCaseButton className={classes.button} fullWidth onClick={() => copyAddress()} startIcon={<CopyIcon />}>
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
      <CustomSnackbar
        message={alertsTranslations('walletAddressWasCopied')}
        show={showSnackbar}
        hide={() => setShowSnackbar(false)}
        testId='message-address-was-copied'
        variant='success'
      />
    </Section>
  );
});
