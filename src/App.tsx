import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Header } from './components/nav/Header';
import { MainAppPage } from './pages/MainAppPage';
import { ContentContainer } from './components/structure/ContentContainer';
import i18n from 'i18next';
import moment from 'moment';
import { Footer } from './components/nav/Footer';
import { GuardianDisplayPage } from './pages/GuardiansDisplayPage';
import NetworkIndicator from './components/NetworkIndicator';

function getForcedLanguage(pathname: string) {
  const langMatch = pathname.match(/\/(en|ko|jp)\/?/);

  return langMatch ? langMatch[1] : '';
}

function updateLanguage(lang: string) {
  i18n.changeLanguage(lang);
  moment.locale(lang);
}

export const App = observer(() => {
  const location = useLocation();
  const forcedLang = getForcedLanguage(location.pathname);

  // TODO : FUTURE : O.L : Change this to am ore elegant solution
  // Update language by url
  useEffect(() => {
    let langBaseName = '';
    if (forcedLang) {
      langBaseName = `/${forcedLang}/`;
      if (i18n.language !== forcedLang) {
        updateLanguage(forcedLang);
      }
    } else {
      const navigatorLang = navigator.language.split('-')[0];
      if (i18n.languages.indexOf(navigatorLang) > -1) {
        if (i18n.language !== navigatorLang) {
          updateLanguage(navigatorLang);
        }
      }
    }
  }, [forcedLang]);

  return (
    <main>
      <NetworkIndicator />
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
