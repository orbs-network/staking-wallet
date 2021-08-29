import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components/nav/Header';
import { MainAppPage } from './pages/MainAppPage';
import { ContentContainer } from './components/structure/ContentContainer';
import { Footer } from './components/nav/Footer';
import { GuardianDisplayPage } from './pages/GuardiansDisplayPage';
import useMonitoring from './components/hooks/useMonitoring';
import useLanguage from './components/hooks/useLanguage';
import { observer } from 'mobx-react';
import AppVersion from './components/app-version/index';
import './services/error-monitoring/index';
import routes from './router/routes';
import useConnection from './hooks/useConnection';
import NetworkIndicator from './components/NetworkIndicator/index';
export const App = observer(() => {
  // useMonitoring();
  useLanguage();

  return (
    <main>
      <NetworkIndicator />
      <Header />
      <ContentContainer id='appContainer'>
        <Switch>
          <Route exact path={routes.guardiansPage} component={GuardianDisplayPage} />
          <Route exact path={routes.main} component={MainAppPage} />
        </Switch>
      </ContentContainer>
      <AppVersion />
      <Footer />
    </main>
  );
});
