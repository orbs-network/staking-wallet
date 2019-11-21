/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { HeaderTestDriver, IHeaderCustomDriver } from './HeaderTestDriver';

describe('Header Component', () => {
  let headerTestDriver: IHeaderCustomDriver = new HeaderTestDriver();

  beforeEach(() => {
    headerTestDriver = new HeaderTestDriver();
  });

  it('Should display regular links + only "my wallet" and "stake orbs" when connected to a wallet', async () => {
    headerTestDriver.setIsConnectedToWalletProp(true);

    const {
      expectRegularLinksToExist,
      expectMyWalletLinksToExist,
      expectConnectWalletLinkToNotExist,
    } = headerTestDriver.renderSpecificDriver();

    expectRegularLinksToExist();

    expectMyWalletLinksToExist();
    expectConnectWalletLinkToNotExist();
  });

  it.skip('Should display regular links + only "Connect to wallet" when not connected to a wallet', async () => {
    headerTestDriver.setIsConnectedToWalletProp(false);

    const {
      expectRegularLinksToExist,
      expectMyWalletLinksToNotExist,
      expectConnectWalletLinkToExist,
    } = headerTestDriver.renderSpecificDriver();

    expectRegularLinksToExist();

    expectConnectWalletLinkToExist();
    expectMyWalletLinksToNotExist();
  });
});
