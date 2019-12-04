import React, { useMemo, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Youtube from 'react-youtube';
import { useBoolean } from 'react-hanger';
import { useTranslation } from 'react-i18next';

export const ConnectWalletPage = observer(() => {
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
            Connect your metamask
          </Button>
          {rejectedConnection.value && <div data-testid='text-connection-was-not-approved'>Please approve</div>}
        </>
      );
    } else {
      return (
        <>
          <Button data-testid='button-install-metamask' onClick={handleInstallClicked}>
            Install Metamask
          </Button>
          {pressedOnInstallMetamask.value && (
            <div data-testid='text-pleaseRefresh'>Please refresh this page after installing Metamask</div>
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
    <Container data-testid={'page-connect-to-wallet'}>
      <Grid item xs={12}>
        <Typography variant={'h4'}>{t('Connect your wallet')}</Typography>

        <br />
        {installOrConnectMetamask}
        <br />

        <br />
        <Youtube videoId={'6Gf_kRE4MJU'} />
      </Grid>
    </Container>
  );
});
