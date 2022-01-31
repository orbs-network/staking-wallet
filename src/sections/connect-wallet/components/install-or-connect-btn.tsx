import React from 'react';
import { CommonActionButton } from '../../../components/base/CommonActionButton';
import { useConnectWalletSectionTranslations } from '../../../translations/translationsHooks';

interface IProps {
  walletConnectionState: string;
  onClick: () => void;
  disabled: boolean;
}

const InstallOrConnectBtn = ({ walletConnectionState, onClick, disabled }: IProps) => {
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();

  if (walletConnectionState === 'connect') {
    return (
      <CommonActionButton data-testid='button-connect-metamask' onClick={onClick} disabled={disabled}>
        {connectWalletSectionTranslations('connectYourAccount')}
      </CommonActionButton>
    );
  } else {
    return (
      <CommonActionButton data-testid='button-install-metamask' onClick={onClick}>
        {connectWalletSectionTranslations('installMetaMask')}
      </CommonActionButton>
    );
  }
};

export default InstallOrConnectBtn;
