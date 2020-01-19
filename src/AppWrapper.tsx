import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { AppStyles, baseTheme, GlobalStyleComponent } from './theme/Theme';
import { Provider } from 'mobx-react';
import React from 'react';
import { App } from './App';
import { buildServices } from './services/Services';
import { configureMobx, getStores } from './store/storesInitialization';
import { LangRouter } from './multi-lang/LangRouter';

configureMobx();

const services = buildServices((window as any).ethereum);
const stores = getStores(
  services.orbsPOSDataService,
  services.stakingService,
  services.orbsTokenService,
  services.cryptoWalletConnectionService,
  services.guardiansService,
);

const themeAndStyle = {
  ...baseTheme,
  styles: AppStyles,
};

export const AppWrapper: React.FunctionComponent = () => (
  <LangRouter>
    <Provider {...services} {...stores}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={baseTheme}>
          <SCThemeProvider theme={themeAndStyle}>
            <GlobalStyleComponent />
            <CssBaseline />
            <App />
          </SCThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  </LangRouter>
);
