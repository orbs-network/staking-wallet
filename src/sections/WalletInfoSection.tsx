import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore } from '../store/storeHooks';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import copy from 'copy-to-clipboard';
import { Button, Divider } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useBoolean, useStateful } from 'react-hanger';
import { useTranslation } from 'react-i18next';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import Modal from 'react-modal';
import { QRCode } from 'react-qrcode-logo';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import Snackbar from '@material-ui/core/Snackbar';
import { CommonDivider } from '../components/base/CommonDivider';

const LoweCaseButton = styled(Button)({
  textTransform: 'none',
});

export const WalletInfoSection = observer(() => {
  const { t } = useTranslation();
  const history = useHistory();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const orbsAccountStore = useOrbsAccountStore();
  const showSnackbarMessage = useBoolean(false);
  const showQrModal = useBoolean(false);

  const copyAddress = useCallback(() => {
    copy(cryptoWalletIntegrationStore.mainAddress);
    showSnackbarMessage.setTrue();
  }, [cryptoWalletIntegrationStore.mainAddress, showSnackbarMessage]);

  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={'WALLET INFO'} icon={AccountBalanceWalletIcon} />

      <CommonDivider />

      <Grid item xs={12}>
        <Typography>Address</Typography>
      </Grid>
      <Grid container direction={'row'} justify={'space-between'}>
        <Typography variant={'h4'} data-testid={'text-active-address'}>
          {cryptoWalletIntegrationStore.mainAddress}
        </Typography>
        <div>
          <LoweCaseButton onClick={copyAddress}> Copy </LoweCaseButton>
          <LoweCaseButton onClick={showQrModal.setTrue}> QR </LoweCaseButton>
        </div>
      </Grid>
      <CommonDivider />

      <Modal isOpen={showQrModal.value} onRequestClose={showQrModal.setFalse} style={customStyles}>
        <QRCode
          value={cryptoWalletIntegrationStore.mainAddress}
          logoImage={'https://icodrops.com/wp-content/uploads/2018/01/Orbs-logo.jpg'}
          logoWidth={100}
          logoHeight={100}
          size={400}
          qrStyle={'dots'}
          fgColor={'#07142E'}
        />
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
          message={'Copied Address !'}
          onClose={showSnackbarMessage.setFalse}
          data-testid={'message-address-was-copied'}
        />
      </Snackbar>
    </Section>
  );
});

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
