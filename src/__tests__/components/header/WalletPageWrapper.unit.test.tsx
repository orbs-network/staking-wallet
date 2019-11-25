/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import { WalletPageWrapper } from '../../../pages/WalletPageWrapper';

function renderWalletPage(isConnectedToWallet: boolean) {
  return render(<WalletPageWrapper isConnectedToWallet={isConnectedToWallet} />);
}

describe.only('Wallet Page Wrapper Component', () => {
  it('Should ask the user to connect metamask when the wallet (Metamask) is not connected', async () => {
    const { queryByTestId } = renderWalletPage(false);
    expect(queryByTestId('connect-to-wallet-page')).toBeInTheDocument();
    expect(queryByTestId('wallet-page')).not.toBeInTheDocument();
  });

  it('Should show the user wallet when connected', async () => {
    const { queryByTestId } = renderWalletPage(true);
    expect(queryByTestId('connect-to-wallet-page')).not.toBeInTheDocument();
    expect(queryByTestId('wallet-page')).toBeInTheDocument();
  });
});
