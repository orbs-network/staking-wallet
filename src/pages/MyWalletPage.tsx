import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export const MyWalletPage = observer(() => {
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  return (
    <Container>
      <Grid item xs={12}>
        <Typography variant={'h4'}>My Wallet</Typography>
      </Grid>
    </Container>
  );
});
