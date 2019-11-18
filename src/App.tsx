import Grid from '@material-ui/core/Grid';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Guardians } from './components/guardians';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { IServices } from './services/Services';
import { configure } from 'mobx';

configure({
  enforceActions: 'observed',
});

interface IProps {
  services: IServices;
}

export const App: React.FunctionComponent<IProps> = ({ services }) => (
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
