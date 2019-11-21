import React from 'react';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Guardians } from './components/guardians';
import { Header } from './components/Header';
import { Home } from './components/Home';

import { ConnectWalletPage } from './pages/ConnectWalletPage';
import { MyWalletPage } from './pages/MyWalletPage';
import { useCryptoWalletIntegrationStore } from './store/storeHooks';

export const App = observer(() => {
  const CryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  return (
    <Grid container spacing={2}>
      <Header isConnectedToWallet={CryptoWalletIntegrationStore.isConnectedToWallet} />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/guardians' component={Guardians} />
        <Route path='/connect-wallet' component={ConnectWalletPage} />
        <Route path='/my-wallet' component={MyWalletPage} />
      </Switch>
    </Grid>
  );
});
