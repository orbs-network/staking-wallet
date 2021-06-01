import { observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components/nav/Header';
import MainAppPage from './pages/MainAppPage';
import { ContentContainer } from './components/structure/ContentContainer';
import { Footer } from './components/nav/Footer';
import GuardianDisplayPage from './pages/GuardiansDisplayPage';
import useLanguage from './hooks/useLanguage';
import routes from './routes/index';
export default observer(() => {
  useLanguage();

  return (
    <>
      <Header />
      <ContentContainer id='appContainer'>
        <Switch>
          <Route exact path={routes.guardians} component={GuardianDisplayPage} />
          <Route exact path={routes.root} component={MainAppPage} />
        </Switch>
      </ContentContainer>
      <Footer />
    </>
  );
});
