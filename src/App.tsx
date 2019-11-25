import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Guardians } from './components/guardians';
import { Header } from './components/Header';
import { MyWalletPage } from './pages/MyWalletPage';
import { WalletPageWrapper } from './pages/WalletPageWrapper';
import { useCryptoWalletIntegrationStore } from './store/storeHooks';


export const App = observer(() => {
  const CryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  return (
    <Grid container spacing={2}>
      <Header isConnectedToWallet={CryptoWalletIntegrationStore.isConnectedToWallet} />
      <Switch>
        <Route exact path='/' component={WalletPageWrapper} />
        <Route path='/stake' component={MyWalletPage} />
        <Route path='/guardians' component={Guardians} />
      </Switch>
    </Grid>
  );
});
