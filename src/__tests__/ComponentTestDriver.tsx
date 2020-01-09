/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { ThemeProvider } from '@material-ui/styles';
import { render } from '@testing-library/react';
import { Provider } from 'mobx-react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { DeepPartial } from 'utility-types';
import { IServices } from '../services/Services';
import { IStores } from '../store/stores';
import { configureMobx } from '../store/storesInitialization';
import { baseTheme } from '../theme/Theme';

export class ComponentTestDriver<P = {}> {
  private services: DeepPartial<IServices> = {};
  private stores: DeepPartial<IStores> = {};
  private renderProps: P = null;

  constructor(private Component) {
    configureMobx();
  }

  withServices(services: DeepPartial<IServices>): this {
    this.services = services;
    return this;
  }

  withStores(stores: DeepPartial<IStores>): this {
    this.stores = stores;
    return this;
  }

  withProps(props: P) {
    this.renderProps = props;
    return this;
  }

  public render() {
    const Component = this.Component;
    const props: {} | P = this.renderProps ? this.renderProps : {};

    return render(
      <ThemeProvider theme={baseTheme}>
        <SCThemeProvider theme={baseTheme}>
          <BrowserRouter>
            <Provider {...this.services} {...this.stores}>
              <Component {...props} />
            </Provider>
          </BrowserRouter>
        </SCThemeProvider>
      </ThemeProvider>
    );
  }
}
