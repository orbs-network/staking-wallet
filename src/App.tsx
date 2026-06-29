import React, { useCallback, useContext, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components/nav/Header';
import { MainAppPage } from './pages/MainAppPage';
import { ContentContainer } from './components/structure/ContentContainer';
import { Footer } from './components/nav/Footer';
import { GuardianDisplayPage } from './pages/GuardiansDisplayPage';
import useMonitoring from './components/hooks/useMonitoring';
import useLanguage from './components/hooks/useLanguage';
import { MobXProviderContext, observer } from 'mobx-react';
import './services/error-monitoring/index';
import routes from './router/routes';
import ChainTopBackground from './components/chain/ChainTopBackground';
import { useCryptoWalletIntegrationStore } from './store/storeHooks';
import { useAppContext } from './context/app-context';
import useWeb3 from './hooks/useWeb3';

export const App = observer(() => {
  const { provider } = useAppContext();
  const { getChainId, addProviderListeners } = useWeb3();
  const { chainId } = useContext(MobXProviderContext);
  useMonitoring();
  useLanguage();

  const store = useCryptoWalletIntegrationStore();

  const onConnected = useCallback(async () => {
    const walletChainId = await getChainId();
    addProviderListeners();
    if (walletChainId === chainId) {
      store.setIsConnected(true);
    }
  }, [addProviderListeners, chainId, getChainId, store]);

  useEffect(() => {
    if (provider) {
      onConnected();
    } else {
      store.setIsConnected(false);
    }
  }, [onConnected, provider, store]);

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
      <Footer />
    </main>
  );
});
