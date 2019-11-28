/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { SidebarTestDriver } from './SidebarTestDriver';

describe('Sidebar Component', () => {
  let sidebarTestDriver: SidebarTestDriver = new SidebarTestDriver();

  beforeEach(() => {
    sidebarTestDriver = new SidebarTestDriver();
  });

  it('Should display the Guardians menu item', async () => {
    const { guardiansLink } = sidebarTestDriver.render();
    expect(guardiansLink).toBeInTheDocument();
  });

  it('Should display only "Connect Wallet" when NOT connected to a wallet', async () => {
    const { connectWalletLink, myWalletLink } = sidebarTestDriver.render();
    expect(connectWalletLink).toBeInTheDocument();
    expect(myWalletLink).not.toBeInTheDocument();
  });

  it('Should display "My Wallet" and "Stake ORBS" when connected to a wallet', async () => {
    const { connectWalletLink, myWalletLink } = sidebarTestDriver.connectedToWallet().render();
    expect(connectWalletLink).not.toBeInTheDocument();
    expect(myWalletLink).toBeInTheDocument();
  });
});
