import { Typography } from '@material-ui/core';
import React from 'react';
import { useConnectWalletSectionTranslations } from '../../../translations/translationsHooks';
import Grid, { GridProps } from '@material-ui/core/Grid';

interface IProps {
  pressedOnInstallMetamask: boolean;
  hasEthereumProvider: boolean;
  rejectedConnection: boolean;
}

const Message = ({ pressedOnInstallMetamask, hasEthereumProvider, rejectedConnection }: IProps) => {
  let testId = null;
  let messageText = null;
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();

  if (hasEthereumProvider && rejectedConnection) {
    testId = 'text-connection-was-not-approved';
    messageText = connectWalletSectionTranslations('pleaseApproveAccountConnection');
  } else if (pressedOnInstallMetamask) {
    testId = 'text-pleaseRefresh';
    messageText = connectWalletSectionTranslations('refreshPageAfterInstallingMetaMask');
  }

  return messageText ? (
    <Grid item style={{ textAlign: 'center' }}>
      <Typography data-testid={testId}>{messageText}</Typography>
    </Grid>
  ) : null;
};

export default Message;
