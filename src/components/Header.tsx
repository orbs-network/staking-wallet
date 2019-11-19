import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';
import { LinkButton } from './LinkButton';

export const Header: React.FunctionComponent = () => {


  return (
    <AppBar position='static' color='default'>
      <Toolbar>
        <LinkButton data-testid={'menuLink-home'} color='primary' to='/'>
          Home
        </LinkButton>
        <LinkButton data-testid={'menuLink-guardians'} color='primary' to='/guardians'>
          Guardians
        </LinkButton>
        <LinkButton data-testid={'menuLink-about'} color='primary' to='/about'>
          About
        </LinkButton>
      </Toolbar>
    </AppBar>
  );
};
