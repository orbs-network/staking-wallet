import { Box } from '@material-ui/core';
import React from 'react';
import { CommonActionButton } from '../../../components/base/CommonActionButton';
import { useConnectWalletSectionTranslations } from '../../../translations/translationsHooks';

interface IProps {
  walletConnectionState: string;
  handleConnectClicked: () => void;
  handleInstallClicked: () => void;
  handleOntoInstallClicked: () => void;
  disabled: boolean;
}

const InstallOrConnectBtn = ({
  walletConnectionState,
  handleConnectClicked,
  handleInstallClicked,
  disabled,
  handleOntoInstallClicked
}: IProps) => {
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();

  if (walletConnectionState === 'connect') {
    return (
      <CommonActionButton data-testid='button-connect-metamask' onClick={handleConnectClicked} disabled={disabled}>
        {connectWalletSectionTranslations('connectYourAccount')}
      </CommonActionButton>
    );
  } else {
    return (
      <Box>
        <CommonActionButton data-testid='button-install-metamask' onClick={handleInstallClicked} style={{marginRight: 20}}>
          {connectWalletSectionTranslations('installMetaMask')}
        </CommonActionButton>
        <CommonActionButton data-testid='button-install-metamask' onClick={handleOntoInstallClicked}>
        Install Onto
        </CommonActionButton>
      </Box>
    );
  }
};

export default InstallOrConnectBtn;
