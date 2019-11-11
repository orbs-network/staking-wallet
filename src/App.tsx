import Grid from '@material-ui/core/Grid';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Guardians } from './components/guardians';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { buildServices } from './services/Services';

configure({
  enforceActions: 'observed',
});
const services = buildServices();

export const App: React.FunctionComponent = () => (
  <BrowserRouter>
    <Provider {...services}>
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
