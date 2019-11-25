/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { HeaderTestDriver } from './HeaderTestDriver';

describe('Header Component', () => {
  let headerTestDriver: HeaderTestDriver = new HeaderTestDriver();

  beforeEach(() => {
    headerTestDriver = new HeaderTestDriver();
  });

  it('Should display Home, and Guardians menu items', async () => {
    const { homeLink, guardiansLink } = headerTestDriver.render();
    expect(homeLink).toBeInTheDocument();
    expect(guardiansLink).toBeInTheDocument();
  });

  it('Should display only "Connect Wallet" when NOT connected to a wallet', async () => {
    const { connectWalletLink, myWalletLink, stakeOrbsLink } = headerTestDriver.render();
    expect(connectWalletLink).toBeInTheDocument();
    expect(myWalletLink).not.toBeInTheDocument();
    expect(stakeOrbsLink).not.toBeInTheDocument();
  });

  it('Should display "My Wallet" and "Stake ORBS" when connected to a wallet', async () => {
    const { connectWalletLink, myWalletLink, stakeOrbsLink } = headerTestDriver.connectedToWallet().render();
    expect(connectWalletLink).not.toBeInTheDocument();
    expect(myWalletLink).toBeInTheDocument();
    expect(stakeOrbsLink).toBeInTheDocument();
  });
});
