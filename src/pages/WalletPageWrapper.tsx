import React from 'react';

export interface IWalletPageWrapperProps {
  isConnectedToWallet: boolean;
}

export const WalletPageWrapper = React.memo<IWalletPageWrapperProps>(props => {
  const { isConnectedToWallet } = props;
  if (isConnectedToWallet) {
    return <div data-testid='wallet-page'>Wallet Page</div>;
  } else {
    return <div data-testid='connect-to-wallet-page'>Connect to Wallet</div>;
  }
});
