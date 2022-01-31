import React, { useEffect } from 'react';
import config from '../config';
import ConnectWalletSection from '../sections/connect-wallet';
import Web3Service from '../services/Web3Service';

interface IProps {
  web3Service: Web3Service;
}

function NotConnectedWrapper({ web3Service }: IProps) {
  const changeToSupportedNetwork = () => {
    const { nativeCurrency, rpcUrls, blockExplorerUrls, name: chainName } = config.networks[1];
    web3Service.changeNetwork(1, { chainName, nativeCurrency, rpcUrls, blockExplorerUrls });
  };

  useEffect(() => {}, []);

  return (
    <div>
      <ConnectWalletSection onClick={changeToSupportedNetwork} isInstalled={true} />
    </div>
  );
}

export default NotConnectedWrapper;
