import React, { useMemo, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Youtube from 'react-youtube';
import { useBoolean } from 'react-hanger';

export const ConnectWalletPage = observer(() => {
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const rejectedConnection = useBoolean(false);

  const handleConnectClicked = useCallback(async () => {
    const approvedConnection = await cryptoWalletIntegrationStore.askToConnect();
    rejectedConnection.setValue(!approvedConnection);
  }, [rejectedConnection, cryptoWalletIntegrationStore]);

  const installOrConnectMetamask = useMemo(() => {
    if (cryptoWalletIntegrationStore.isMetamaskInstalled) {
      return (
        <>
          <Button data-testid='connect-to-metamask-button' onClick={handleConnectClicked}>
            Connect your metamask
          </Button>
          {rejectedConnection.value && <div data-testid='connection-was-not-approved'>Please approve</div>}
        </>
      );
    } else {
      return <Button data-testid='install-metamask-button'>Install metamask</Button>;
    }
  }, [cryptoWalletIntegrationStore.isMetamaskInstalled, rejectedConnection.value, handleConnectClicked]);

  return (
    <Container data-testid={'page-connect-to-wallet'}>
      <Grid item xs={12}>
        <Typography variant={'h4'}>Connect your wallet</Typography>

        <br />
        {installOrConnectMetamask}
        <br />

        <br />
        <Youtube videoId={'6Gf_kRE4MJU'} />
      </Grid>
    </Container>
  );
});
