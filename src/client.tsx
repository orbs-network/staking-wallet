import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { AppWrapper } from './AppWrapper';
import config, { IS_DEV } from '../config';
import { LangRouter } from './multi-lang/LangRouter';
import i18n from 'i18next';


ReactDOM.render(
  <LangRouter preLangBasename={IS_DEV ? '' : config.urlBase}>
    <I18nextProvider i18n={i18n}>
      <StylesProvider injectFirst>
        <AppWrapper />
      </StylesProvider>
    </I18nextProvider>
  </LangRouter>,
  document.getElementById('app'),
);
