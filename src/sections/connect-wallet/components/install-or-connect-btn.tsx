import React from 'react';
import { CommonActionButton } from '../../../components/base/CommonActionButton';
import { useConnectWalletSectionTranslations } from '../../../translations/translationsHooks';

interface IProps {
  walletConnectionState: string;
  handleConnectClicked: () => void;
  handleInstallClicked: () => void;
  disabled: boolean;
}

const InstallOrConnectBtn = ({
  walletConnectionState,
  handleConnectClicked,
  handleInstallClicked,
  disabled,
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
      <CommonActionButton data-testid='button-install-metamask' onClick={handleInstallClicked}>
        {connectWalletSectionTranslations('installMetaMask')}
      </CommonActionButton>
    );
  }
};

export default InstallOrConnectBtn;
