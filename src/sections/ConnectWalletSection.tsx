import React, { useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useBoolean } from 'react-hanger';
// @ts-ignore
import { ReactComponent as walletIcon } from '../../assets/wallet.svg';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { CommonDivider } from '../components/base/CommonDivider';
import Youtube from 'react-youtube';
import { CommonActionButton } from '../components/base/CommonActionButton';
import { useConnectWalletSectionTranslations, useSectionsTitlesTranslations } from '../translations/translationsHooks';

export const ConnectWalletSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const rejectedConnection = useBoolean(false);
  const pressedOnInstallMetamask = useBoolean(false);

  const handleConnectClicked = useCallback(async () => {
    const approvedConnection = await cryptoWalletIntegrationStore.askToConnect();
    rejectedConnection.setValue(!approvedConnection);
  }, [rejectedConnection, cryptoWalletIntegrationStore]);

  const handleInstallClicked = useCallback(async () => {
    window.open('https://metamask.io/', '_blank');
    pressedOnInstallMetamask.setTrue();
  }, [pressedOnInstallMetamask]);

  const installOrConnectMetamaskButton = useMemo(() => {
    if (cryptoWalletIntegrationStore.isMetamaskInstalled) {
      return (
        <CommonActionButton fullWidth data-testid='button-connect-metamask' onClick={handleConnectClicked}>
          {connectWalletSectionTranslations('connectYourAccount')}
        </CommonActionButton>
      );
    } else {
      return (
        <CommonActionButton fullWidth data-testid='button-install-metamask' onClick={handleInstallClicked}>
          {connectWalletSectionTranslations('installMetaMask')}
        </CommonActionButton>
      );
    }
  }, [
    connectWalletSectionTranslations,
    cryptoWalletIntegrationStore.isMetamaskInstalled,
    handleConnectClicked,
    handleInstallClicked,
  ]);

  const messageComponent = useMemo(() => {
    let testId = null;
    let messageText = null;

    if (cryptoWalletIntegrationStore.isMetamaskInstalled && rejectedConnection.value) {
      testId = 'text-connection-was-not-approved';
      messageText = connectWalletSectionTranslations('pleaseApproveAccountConnection');
    } else if (pressedOnInstallMetamask.value) {
      testId = 'text-pleaseRefresh';
      messageText = connectWalletSectionTranslations('refreshPageAfterInstallingMetaMask');
    }

    if (messageText) {
      return <Typography data-testid={testId}>{messageText}</Typography>;
    } else {
      return null;
    }
  }, [
    connectWalletSectionTranslations,
    cryptoWalletIntegrationStore.isMetamaskInstalled,
    pressedOnInstallMetamask.value,
    rejectedConnection.value,
  ]);

  return (
    <Section data-testid='connect-to-wallet-section'>
      {/* Balance */}
      <SectionHeader title={sectionTitlesTranslations('connectWallet')} icon={walletIcon} />

      <CommonDivider />

      <Grid container spacing={1} direction={'column'} alignContent={'center'}>
        <Typography variant={'h6'}>{connectWalletSectionTranslations('initialGreeting')}</Typography>
        <Grid item xs={12} md={4}>
          {installOrConnectMetamaskButton}
        </Grid>
        {messageComponent !== null && <Grid item>{messageComponent}</Grid>}
        <Grid item xs={8}>
          {/*<Youtube videoId={'6Gf_kRE4MJU'} />*/}
        </Grid>
      </Grid>
    </Section>
  );
});
