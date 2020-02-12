import React, { useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Button, Divider } from '@material-ui/core';
import { useBoolean } from 'react-hanger';
import { useTranslation } from 'react-i18next';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { CommonDivider } from '../components/base/CommonDivider';
import Youtube from 'react-youtube';
import { CommonActionButton } from '../components/base/CommonActionButton';

export const ConnectWalletSection = observer(() => {
  const { t } = useTranslation();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const rejectedConnection = useBoolean(false);
  const pressedOnInstallMetamask = useBoolean(false);

  const handleConnectClicked = useCallback(async () => {
    const approvedConnection = await cryptoWalletIntegrationStore.askToConnect();
    rejectedConnection.setValue(!approvedConnection);
  }, [rejectedConnection, cryptoWalletIntegrationStore]);

  const handleInstallClicked = useCallback(async () => {
    window.open('https://metamask.io/', '_blank');
    pressedOnInstallMetamask.setTrue();
  }, [pressedOnInstallMetamask]);

  const installOrConnectMetamask = useMemo(() => {
    if (cryptoWalletIntegrationStore.isMetamaskInstalled) {
      return (
        <CommonActionButton data-testid='button-connect-metamask' onClick={handleConnectClicked}>
          {t('Connect your account')}
        </CommonActionButton>
      );
    } else {
      return (
        <CommonActionButton data-testid='button-install-metamask' onClick={handleInstallClicked}>
          {t('Install Metamask')}
        </CommonActionButton>
      );
    }
  }, [cryptoWalletIntegrationStore.isMetamaskInstalled, handleConnectClicked, t, handleInstallClicked]);

  const messageComponent = useMemo(() => {
    let testId = null;
    let messageText = null;

    if (cryptoWalletIntegrationStore.isMetamaskInstalled && rejectedConnection.value) {
      testId = 'text-connection-was-not-approved';
      messageText = t('Please approve the account connection');
    } else if (pressedOnInstallMetamask.value) {
      testId = 'text-pleaseRefresh';
      messageText = t('Please refresh this page after installing Metamask');
    }

    if (messageText) {
      return <Typography data-testid={testId}>{messageText}</Typography>;
    } else {
      return null;
    }
  }, [cryptoWalletIntegrationStore.isMetamaskInstalled, pressedOnInstallMetamask.value, rejectedConnection.value, t]);

  return (
    <Section data-testid='connect-to-wallet-section'>
      {/* Balance */}
      <SectionHeader title={'Connect your wallet'} icon={AccountBalanceWalletIcon} />

      <CommonDivider />

      <Grid container spacing={1}>
        <Grid item xs={12}>
          {installOrConnectMetamask}
        </Grid>
        {messageComponent !== null && (
          <Grid item xs={12}>
            {messageComponent}
          </Grid>
        )}
        <Grid item xs={12}>
          <Youtube videoId={'6Gf_kRE4MJU'} />
        </Grid>
      </Grid>
    </Section>
  );
});
