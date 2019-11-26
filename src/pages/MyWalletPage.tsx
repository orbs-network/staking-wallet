import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import copy from 'copy-to-clipboard';

export const MyWalletPage = observer(() => {
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  return (
    <Container data-testid={'page-my-wallet'}>
      <Grid item xs={12}>
        <Typography variant={'h4'}>My Wallet</Typography>

        {/* Details section */}
        <div>
          {/* Address */}
          <span data-testid={'text-active-address'}> {cryptoWalletIntegrationStore.mainAddress} </span>
        </div>

        {/* balance */}
        <div>
          Liquid Orbs : <span data-testid={'text-liquid-orbs'}>{cryptoWalletIntegrationStore.liquidOrbs}</span>
          Staked Orbs : <span data-testid={'text-staked-orbs'}>{cryptoWalletIntegrationStore.stakedOrbs}</span>
        </div>

        {/* Rewards */}
        Total Rewards :{' '}
        <span data-testid={'text-total-rewards'}>{cryptoWalletIntegrationStore.accumulatedRewards}</span>
      </Grid>
    </Container>
  );
});
