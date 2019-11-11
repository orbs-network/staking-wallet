import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Guardians } from './components/guardians';
// Pages
import { Header } from './components/Header';
import { Home } from './components/Home';

export const App: React.FunctionComponent = () => (
  <BrowserRouter>
    <div>
      <Grid container spacing={2}>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/guardians' component={Guardians} />
        </Switch>
      </Grid>
    </div>
  </BrowserRouter>
);
