import React, { useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Typography from '@material-ui/core/Typography';
import Grid, { GridProps } from '@material-ui/core/Grid';
import { useBoolean } from 'react-hanger';
import { Section } from '../components/structure/Section';
import { CommonActionButton } from '../components/base/CommonActionButton';
import {
  useCommonsTranslations,
  useConnectWalletSectionTranslations,
  useSectionsTitlesTranslations,
} from '../translations/translationsHooks';
import { ReactComponent as TetraIconSvg } from '../../assets/logos/tetra_icon.svg';
import { ReactComponent as TetraLogoSvg } from '../../assets/logos/tetra_logo.svg';
import { Checkbox, FormControlLabel, Theme } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import styled from 'styled-components';
import { renderToString } from 'react-dom/server';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '../constants';

const WalletConnectionInnerGrid = styled(Grid)<GridProps>(({ theme }: { theme: Theme }) => ({
  // Look& Feel
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  borderRadius: '10%',
  boxShadow: `0px 0px 41px 12px ${theme.palette.secondary.dark}`,

  // Dimensions
  minWidth: 'fit-content',
  width: '40em',
  padding: '3em',

  [theme.breakpoints.down('sm')]: {
    padding: '1.5em',
    width: '80%',
    maxWidth: '80%',
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: '9em',
    paddingRight: '9em',
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: '13em',
    paddingRight: '13em',
  },
}));

type TWalletConnectionPhase = 'install' | 'connect';

export const ConnectWalletSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();
  const cryptoWalletConnectionStore = useCommonsTranslations();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const rejectedConnection = useBoolean(false);
  const pressedOnInstallMetamask = useBoolean(false);
  const legalDocsAgreedTo = useBoolean(false);

  const theme = useTheme();

  const walletConnectionState: TWalletConnectionPhase = cryptoWalletIntegrationStore.isMetamaskInstalled
    ? 'connect'
    : 'install';

  const shouldDisplayLegalTicker = walletConnectionState === 'connect';

  const handleConnectClicked = useCallback(async () => {
    const approvedConnection = await cryptoWalletIntegrationStore.askToConnect();
    rejectedConnection.setValue(!approvedConnection);
  }, [rejectedConnection, cryptoWalletIntegrationStore]);

  const handleInstallClicked = useCallback(async () => {
    window.open('https://metamask.io/', '_blank');
    pressedOnInstallMetamask.setTrue();
  }, [pressedOnInstallMetamask]);

  const installOrConnectMetamaskButton = useMemo(() => {
    if (walletConnectionState === 'connect') {
      return (
        <CommonActionButton
          data-testid='button-connect-metamask'
          onClick={handleConnectClicked}
          disabled={!legalDocsAgreedTo.value}
        >
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
  }, [
    connectWalletSectionTranslations,
    handleConnectClicked,
    handleInstallClicked,
    walletConnectionState,
    legalDocsAgreedTo.value,
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

  // TODO : Find a better way to combine the translations with changing order links
  const innerHtmlForLegalAgreement = connectWalletSectionTranslations('agreeToTheToUAndPrivacyPolicy', {
    termsOfUseText: renderToString(
      <a
        style={{ color: theme.palette.secondary.main }}
        target={'_blank'}
        rel={'noopener noreferrer'}
        href={TERMS_OF_SERVICE_URL}
      >
        {cryptoWalletConnectionStore('termsOfUse')}
      </a>,
    ),
    privacyPolicyText: renderToString(
      <a
        style={{ color: theme.palette.secondary.main }}
        target={'_blank'}
        rel={'noopener noreferrer'}
        href={PRIVACY_POLICY_URL}
      >
        {cryptoWalletConnectionStore('privacyPolicy')}
      </a>,
    ),
  });

  return (
    <Section
      data-testid='connect-to-wallet-section'
      alignItems={'center'}
      style={{ marginTop: '5em' }}
      id='connectWalletSection'
    >
      <WalletConnectionInnerGrid
        container
        item
        spacing={6}
        direction={'column'}
        alignItems={'center'}
        id={'walletConnectionInnerGrid'}
      >
        {/* Brand logos */}
        <Grid item container direction={'column'} alignItems={'center'} spacing={2}>
          <Grid item style={{ maxWidth: '90%' }}>
            <TetraIconSvg style={{ height: '5em', marginRight: 'auto', marginLeft: 'auto' }} />
          </Grid>
          <Grid item style={{ maxWidth: '90%' }}>
            <TetraLogoSvg style={{ height: '2em' }} />
          </Grid>
        </Grid>

        {/* Texts */}
        <Grid item container direction={'column'} spacing={5} style={{ textAlign: 'center' }}>
          <Typography variant={'h6'} style={{ overflowWrap: 'break-word' }}>
            {sectionTitlesTranslations('connectWallet').toLocaleUpperCase()}
          </Typography>
          <Typography variant={'body2'} style={{ overflowWrap: 'break-word' }}>
            {connectWalletSectionTranslations('initialGreeting')}
          </Typography>
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
          {/*<Grid item style={{ paddingRight: 0, paddingLeft: 0, width: '100%' }}>*/}
          <Grid item style={{ paddingRight: 0, paddingLeft: 0 }}>
            {installOrConnectMetamaskButton}
          </Grid>

          {/* TODO : FUTURE : Move the ticker to a stand alone component */}
          {shouldDisplayLegalTicker && (
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={legalDocsAgreedTo.value}
                    onChange={(e) => legalDocsAgreedTo.setValue(e.target.checked)}
                    name='legalTicker'
                  />
                }
                label={
                  <Typography
                    onClick={(e) => e.preventDefault()}
                    dangerouslySetInnerHTML={{ __html: innerHtmlForLegalAgreement }}
                  />
                }
              />
            </Grid>
          )}

          {messageComponent !== null && (
            <Grid item style={{ textAlign: 'center' }}>
              <Typography>{messageComponent}</Typography>
            </Grid>
          )}
        </Grid>
      </WalletConnectionInnerGrid>
    </Section>
  );
});
