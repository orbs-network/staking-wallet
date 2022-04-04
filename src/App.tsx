import React, { useEffect } from 'react';
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
import ChainTopBackground from './components/chain/ChainTopBackground';
import ConnectWalletSection from './sections/connect-wallet';
import WrongNetwork from './components/WrongNetwork';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore } from './store/storeHooks';
import { useAppContext } from './context/app-context';

export const App = observer(() => {
  const { provider } = useAppContext()
  useMonitoring();
  useLanguage();

  const store = useCryptoWalletIntegrationStore();

  useEffect(() => {
   
    if(provider){
      store.setIsConnected(true);
    }
  }, [provider]);

  return (
    <main>
      <Header />
      <ContentContainer id='appContainer'>
        <ChainTopBackground />
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
