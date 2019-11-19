import Grid from '@material-ui/core/Grid';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Guardians } from './components/guardians';
import { Header } from './components/Header';
import { Home } from './components/Home';

import { configure } from 'mobx';
import { buildServices, IServices } from './services/Services';
import { getStores } from './store/storesInitialization';

configure({
  enforceActions: 'observed',
});

const services = buildServices();
const stores = getStores(services.orbsPOSDataService, services.orbsTransactionService);

interface IProps {
  services: IServices;
}

export const App: React.FunctionComponent<IProps> = ({ services }) => (
  <BrowserRouter>
    <Provider {...services} {...stores}>
      <Grid container spacing={2}>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/guardians' component={Guardians} />
        </Switch>
      </Grid>
    </Provider>
  </BrowserRouter>
);
