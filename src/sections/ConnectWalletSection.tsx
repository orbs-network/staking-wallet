import React, { useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Typography from '@material-ui/core/Typography';
import Grid, { GridProps } from '@material-ui/core/Grid';
import { useBoolean } from 'react-hanger';
import { ReactComponent as walletIcon } from '../../assets/wallet.svg';
import { SectionHeader } from '../components/structure/SectionHeader';
import { Section } from '../components/structure/Section';
import { CommonDivider } from '../components/base/CommonDivider';
import Youtube from 'react-youtube';
import { CommonActionButton } from '../components/base/CommonActionButton';
import { useConnectWalletSectionTranslations, useSectionsTitlesTranslations } from '../translations/translationsHooks';
import { ReactComponent as TetraIconSvg } from '../../assets/logos/tetra_icon.svg';
import { ReactComponent as TetraLogoSvg } from '../../assets/logos/tetra_logo.svg';
import { Theme } from '@material-ui/core';
import styled from 'styled-components';

const WalletConnectionInnerGrid = styled(Grid)<GridProps>(({ theme }: { theme: Theme }) => ({
  // Look& Feel
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  borderRadius: '10%',
  boxShadow: `0px 0px 41px 12px ${theme.palette.secondary.dark}`,

  // Dimensions
  width: 'fit-content',
  padding: '3em',


  [theme.breakpoints.up('sm')]: {
    paddingLeft: '9em',
    paddingRight: '9em',
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: '13em',
    paddingRight: '13em',
  },
}));

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
    <Section data-testid='connect-to-wallet-section' alignItems={'center'} style={{ paddingTop: '5em' }}>
      {/* Balance */}
      {/*<SectionHeader title={sectionTitlesTranslations('connectWallet')} icon={walletIcon} />*/}

      {/*<CommonDivider />*/}
      <WalletConnectionInnerGrid container spacing={6} direction={'column'} alignItems={'center'}>
        {/* Brand logos */}
        <Grid item container direction={'column'} alignItems={'center'} spacing={2}>
          <Grid item>
            <TetraIconSvg style={{ height: '5em', marginRight: 'auto', marginLeft: 'auto' }} />
          </Grid>
          <Grid item>
            <TetraLogoSvg style={{ height: '2em' }} />
          </Grid>
        </Grid>

        {/* Texts */}
        <Grid item container direction={'column'} spacing={5} style={{ textAlign: 'center' }}>
          <Typography variant={'h6'}>{sectionTitlesTranslations('connectWallet').toLocaleUpperCase()}</Typography>
          <Typography variant={'body2'}>{connectWalletSectionTranslations('initialGreeting')}</Typography>
        </Grid>

        {/* Action button */}
        <Grid
          item
          container
          direction={'column'}
          alignItems={'center'}
          spacing={2}
          style={{ paddingRight: 0, paddingLeft: 0 }}
        >
          <Grid item style={{ paddingRight: 0, paddingLeft: 0, width: '100%' }}>
            {installOrConnectMetamaskButton}
          </Grid>
          {messageComponent !== null && (
            <Grid item>
              <Typography>{messageComponent}</Typography>
            </Grid>
          )}
        </Grid>
      </WalletConnectionInnerGrid>
    </Section>
  );
});
