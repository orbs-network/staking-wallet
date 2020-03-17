import { observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components/nav/Header';
import { MainAppPage } from './pages/MainAppPage';
import { ContentContainer } from './components/structure/ContentContainer';

export const App = observer(() => {
  return (
    <main>
      <Header />
      <ContentContainer>
        <Switch>
          <Route exact path='/' component={MainAppPage} />
        </Switch>
      </ContentContainer>
    </main>
  );
});
