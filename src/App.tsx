import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Guardians } from './components/Guardians';
import { Header } from './components/nav/Header';
import { Sidebar } from './components/nav/Sidebar';
import { MyWalletPage } from './pages/MyWalletPage';
import { WalletPageWrapper } from './pages/WalletPageWrapper';
import { useCryptoWalletIntegrationStore } from './store/storeHooks';
import styled from 'styled-components';
import { Container } from '@material-ui/core';
import { MainAppPage } from './pages/MainAppPage';

const PagePadder = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const ContentContainer = styled(Container)(({ theme }) => {
  return {
    // Width and padding allows for full screen width with centering
    maxWidth: '100%',

    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(20),
      paddingRight: theme.spacing(20),
    },

    height: '100%', // Agrees with the containing div and expands to the full height
  };
});

export const App = observer(() => {
  const CryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  return (
    <>
      <Header />
      <ContentContainer>
        <Switch>
          <Route exact path='/' component={MainAppPage} />
          {/*<Route path='/stake' component={MyWalletPage} />*/}
          {/*<Route path='/guardians' component={Guardians} />*/}
        </Switch>
      </ContentContainer>
    </>
  );
});
