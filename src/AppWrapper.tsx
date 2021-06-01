import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { Provider } from 'mobx-react';
import React from 'react';
import App from './App';
import { LangRouter } from './multi-lang/LangRouter';
import useInitApp from './hooks/useInitApp';
// TODO : O.L : FUTURE : Consider moving this language initialization
//                       + Change the locale when switching language
// DEV_NOTE : This is where we define the used locales for moment.js
import config, { IS_DEV } from './config';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

export const AppWrapper: React.FunctionComponent = () => {
  const { services, stores, themeAndStyle, baseTheme } = useInitApp();
  return (
    <LangRouter preLangBasename={IS_DEV ? '' : config.urlBase}>
      <I18nextProvider i18n={i18n}>
        <Provider {...services} {...stores}>
          <StylesProvider injectFirst>
            <ThemeProvider theme={baseTheme}>
              <SCThemeProvider theme={themeAndStyle}>
                <CssBaseline />
                <App />
              </SCThemeProvider>
            </ThemeProvider>
          </StylesProvider>
        </Provider>
      </I18nextProvider>
    </LangRouter>
  );
};
