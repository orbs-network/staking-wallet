import React from 'react';
import ConnectWalletSection from '../sections/connect-wallet';

function NoEthereumProviderWrapper() {
  const handleInstallClicked = () => {
    window.open('https://metamask.io/', '_blank');
  };

  return (
    <div>
      <ConnectWalletSection onClick={handleInstallClicked} isInstalled={false} />
    </div>
  );
}

export default NoEthereumProviderWrapper;
