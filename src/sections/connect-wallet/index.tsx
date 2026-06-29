import React, { useCallback, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Grid, { GridProps } from '@material-ui/core/Grid';
import { useBoolean } from 'react-hanger';
import { Section } from '../../components/structure/Section';
import {
  useConnectWalletSectionTranslations,
  useSectionsTitlesTranslations,
} from '../../translations/translationsHooks';
import { ReactComponent as TetraLogoSvg } from '../../../assets/logos/tetra-white.svg';
import InstallOrConnectBtn from './components/install-or-connect-btn';
import LegalAgreement from './components/legal-agreement';
import Message from './components/message';
import { WalletConnectionInnerGrid } from './components/style';
import styled from 'styled-components';
import { Theme } from '@material-ui/core';
import PageLoader from '../../components/loaders/page-loader';
import WrongNetworkPopup from './WrongNetworkPopup';
import WalletOptionsDialog from './WalletOptionsDialog';
import { walletLegalAgreement } from '../../services/wallet-connection/legalAgreement';
import useWalletConnector from '../../hooks/useWalletConnector';
import { ConnectWalletOptions } from '../../services/wallet-connection';
import CustomSnackbar from '../../components/snackbar/custom-snackbar';

type TWalletConnectionPhase = 'install' | 'connect';

export const StyledSection = styled(Section)<GridProps>(({ theme }: { theme: Theme }) => ({
  marginTop: '5em',
  [theme.breakpoints.down('sm')]: {
    marginTop: '1.7em',
  },
}));

const ConnectWalletSection = observer(() => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const {
    connect,
    connectLoading,
    rejectedConnection,
    connectionErrorMessage,
    clearConnectionError,
    showWrongNetworkPopup,
    setShowWrongNetworkPopup,
    userChainId,
  } = useWalletConnector();
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();
  const pressedOnInstallMetamask = useBoolean(false);
  const legalDocsAgreedTo = useBoolean(walletLegalAgreement.getAccepted());
  const hoverTargetRef = useRef();

  const walletConnectionState: TWalletConnectionPhase = 'connect';

  const shouldDisplayLegalTicker = walletConnectionState === 'connect';

  const handleConnectClicked = useCallback(async () => {
    setShowWalletOptions(true);
  }, []);

  const handleWalletSelected = useCallback(
    async (options: ConnectWalletOptions) => {
      setShowWalletOptions(false);
      await connect(options);
    },
    [connect],
  );

  const handleInstallClicked = useCallback(async () => {
    window.open('https://metamask.io/', '_blank');
    pressedOnInstallMetamask.setTrue();
  }, [pressedOnInstallMetamask]);

  const handleOntoInstallClicked = () => {
    window.open('https://onto.app/', '_blank');
  };

  return (
    <StyledSection data-testid='connect-to-wallet-section' alignItems={'center'} id='connectWalletSection'>
      <WrongNetworkPopup
        userChainId={userChainId}
        onClose={() => setShowWrongNetworkPopup(false)}
        open={showWrongNetworkPopup}
      />
      <CustomSnackbar
        show={!!connectionErrorMessage}
        hide={clearConnectionError}
        message={connectionErrorMessage}
        variant='error'
        autoHideDuration={6000}
      />
      <WalletOptionsDialog
        open={showWalletOptions}
        onClose={() => setShowWalletOptions(false)}
        onSelect={handleWalletSelected}
      />
      <PageLoader open={connectLoading} />
      <WalletConnectionInnerGrid
        container
        item
        spacing={6}
        direction={'column'}
        alignItems={'center'}
        id={'walletConnectionInnerGrid'}
        ref={hoverTargetRef}
      >
        {/* Brand logos */}
        <TetraLogoSvg style={{ height: '8em' }} />

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
          <Grid item style={{ paddingRight: 0, paddingLeft: 0 }}>
            <InstallOrConnectBtn
              walletConnectionState={walletConnectionState}
              handleConnectClicked={handleConnectClicked}
              handleInstallClicked={handleInstallClicked}
              disabled={!legalDocsAgreedTo.value}
              handleOntoInstallClicked={handleOntoInstallClicked}
            />
          </Grid>

          <LegalAgreement
            checked={legalDocsAgreedTo.value}
            onChange={(e) => {
              legalDocsAgreedTo.setValue(e.target.checked);
              walletLegalAgreement.setAccepted(e.target.checked);
            }}
            shouldDisplayLegalTicker={shouldDisplayLegalTicker}
          />
          <Message pressedOnInstallMetamask={pressedOnInstallMetamask.value} rejectedConnection={rejectedConnection} />
        </Grid>
      </WalletConnectionInnerGrid>
    </StyledSection>
  );
});

export default ConnectWalletSection;
