import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components/nav/Header';
import { MainAppPage } from './pages/MainAppPage';
import { ContentContainer } from './components/structure/ContentContainer';
import { Footer } from './components/nav/Footer';
import { GuardianDisplayPage } from './pages/GuardiansDisplayPage';
import useMonitoring from './components/hooks/useMonitoring';
import useLanguage from './components/hooks/useLanguage';
import { observer } from 'mobx-react';
import './services/error-monitoring/index';
export const App = observer(() => {
  useMonitoring();
  useLanguage();

  return (
    <main>
      <Header />
      <ContentContainer id={'appContainer'}>
        <Switch>
          <Route exact path='/en/guardians' component={GuardianDisplayPage} />
          <Route exact path='/jp/guardians' component={GuardianDisplayPage} />
          <Route exact path='/ko/guardians' component={GuardianDisplayPage} />
          <Route exact path='/guardians' component={GuardianDisplayPage} />
          <Route exact path='/en' component={MainAppPage} />
          <Route exact path='/jp' component={MainAppPage} />
          <Route exact path='/ko' component={MainAppPage} />
          <Route exact path='/' component={MainAppPage} />
        </Switch>
      </ContentContainer>
      <Footer />
    </main>
  );
});
