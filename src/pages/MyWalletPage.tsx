import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore } from '../store/storeHooks';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import copy from 'copy-to-clipboard';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import { useBoolean } from 'react-hanger';
import { useTranslation } from 'react-i18next';

const LoweCaseButton = styled(Button)({
  textTransform: 'none',
});

export const MyWalletPage = observer(() => {
  const { t } = useTranslation();
  const history = useHistory();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const orbsAccountStore = useOrbsAccountStore();
  const showSnackbarMessage = useBoolean(false);

  const navigateToStakeOrbs = useCallback(() => history.push('/stake'), [history]);
  const copyAddress = useCallback(() => {
    copy(cryptoWalletIntegrationStore.mainAddress);
    showSnackbarMessage.setTrue();
  }, [cryptoWalletIntegrationStore.mainAddress, showSnackbarMessage]);

  return (
    <Container data-testid={'page-my-wallet'}>
      <Grid item xs={12}>
        <Typography variant={'h4'}>{t('Wallet Info')}</Typography>
        {/* Details section */}
        <div>
          {/* Address */}
          <span> Address : <span data-testid={'text-active-address'}>{cryptoWalletIntegrationStore.mainAddress}</span> </span>
          <LoweCaseButton onClick={copyAddress}> Copy </LoweCaseButton>
          <LoweCaseButton> QR </LoweCaseButton>
          <br />

          <span data-testid={'text-user-email'}> Your Email : </span>
        </div>
        <br />
        {/* balance */}
        <div>
          <Typography>Balance</Typography>
          Liquid Orbs : <span data-testid={'text-liquid-orbs'}>{orbsAccountStore.liquidOrbs}</span>
          <br />
          Staked Orbs : <span data-testid={'text-staked-orbs'}>{orbsAccountStore.stakedOrbs}</span>
          <br />
          <LoweCaseButton onClick={navigateToStakeOrbs}>Stake Your Tokens</LoweCaseButton>
        </div>
        <br />
        {/* Rewards */}
        Total Rewards : <span data-testid={'text-total-rewards'}>{orbsAccountStore.accumulatedRewards}</span>
        <LoweCaseButton>History</LoweCaseButton>
      </Grid>
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
    </Container>
  );
});
