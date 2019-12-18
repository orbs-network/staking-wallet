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

const ContentContainer = styled(Container)({
  // Width and padding allows for full screen width with centering
  maxWidth: '100%',
  paddingRight: '10%',
  paddingLeft: '10%',

  height: '100%', // Agrees with the containing div and expands to the full height
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
