import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { useBoolean } from 'react-hanger';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import ConnectWalletSection from './connect-wallet';

const Connect = observer(() => {
  const rejectedConnection = useBoolean(false);

  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  const handleConnectClicked = async () => {
    const approvedConnection = await cryptoWalletIntegrationStore.askToConnect();
    rejectedConnection.setValue(!approvedConnection);
  };

  return (
    <ConnectWalletSection
      onClick={handleConnectClicked}
      isInstalled={true}
      rejectedConnection={rejectedConnection.value}
      hasEthereumProvider={true}
    />
  );
});

export default Connect;
