import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';
import { LinkButton } from './LinkButton';

export const Header: React.FunctionComponent = () => (
  <AppBar position='static' color='default'>
    <Toolbar>
      <LinkButton color='primary' to='/'>
        Home
      </LinkButton>
      <LinkButton color='primary' to='/about'>
        About
      </LinkButton>
    </Toolbar>
  </AppBar>
);
