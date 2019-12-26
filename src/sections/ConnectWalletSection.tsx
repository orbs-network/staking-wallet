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
        <>
          <Button data-testid='button-connect-metamask' onClick={handleConnectClicked}>
            {t('Connect your metamask')}
          </Button>
          {rejectedConnection.value && <div data-testid='text-connection-was-not-approved'>{t('Please approve')}</div>}
        </>
      );
    } else {
      return (
        <>
          <Button data-testid='button-install-metamask' onClick={handleInstallClicked}>
            {t('Install Metamask')}
          </Button>
          {pressedOnInstallMetamask.value && (
            <div data-testid='text-pleaseRefresh'>{t('Please refresh this page after installing Metamask')}</div>
          )}
        </>
      );
    }
  }, [
    cryptoWalletIntegrationStore.isMetamaskInstalled,
    rejectedConnection.value,
    pressedOnInstallMetamask.value,
    handleConnectClicked,
    handleInstallClicked,
  ]);

  return (
    <Section>
      {/* Balance */}
      <SectionHeader title={'Connect your wallet'} icon={AccountBalanceWalletIcon} />

      <CommonDivider />

      <Grid container>
        <Grid item xs={12}>
          <Typography variant={'h4'}>{t('Connect your wallet')}</Typography>

          <br />
          {installOrConnectMetamask}
          <br />

          <br />
          <Youtube videoId={'6Gf_kRE4MJU'} />
        </Grid>
      </Grid>

    </Section>
  );
});
