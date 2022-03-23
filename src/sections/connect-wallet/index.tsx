import React, { useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../../store/storeHooks';
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
import { hasInjectedProvider } from '../../constants';
import styled from 'styled-components';
import { Theme } from '@material-ui/core';

type TWalletConnectionPhase = 'install' | 'connect';

export const StyledSection = styled(Section)<GridProps>(({ theme }: { theme: Theme }) => ({
  marginTop: '5em' ,
  [theme.breakpoints.down('sm')]: {
    marginTop: '1.7em',
  },
}));

const ConnectWalletSection = observer(() => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const rejectedConnection = useBoolean(false);
  const pressedOnInstallMetamask = useBoolean(false);
  const legalDocsAgreedTo = useBoolean(false);

  const hoverTargetRef = useRef();

  const walletConnectionState: TWalletConnectionPhase = hasInjectedProvider ? 'connect' : 'install';

  const shouldDisplayLegalTicker = walletConnectionState === 'connect';

  const handleConnectClicked = useCallback(async () => {
    const approvedConnection = await cryptoWalletIntegrationStore.askToConnect();
    rejectedConnection.setValue(!approvedConnection);
  }, [rejectedConnection, cryptoWalletIntegrationStore]);

  const handleInstallClicked = useCallback(async () => {
    window.open('https://metamask.io/', '_blank');
    pressedOnInstallMetamask.setTrue();
  }, [pressedOnInstallMetamask]);

  return (
    <StyledSection
      data-testid='connect-to-wallet-section'
      alignItems={'center'}
      id='connectWalletSection'
    >
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
            />
          </Grid>

          <LegalAgreement
            checked={legalDocsAgreedTo.value}
            onChange={(e) => legalDocsAgreedTo.setValue(e.target.checked)}
            shouldDisplayLegalTicker={shouldDisplayLegalTicker}
          />
          <Message
            pressedOnInstallMetamask={pressedOnInstallMetamask.value}
            hasEthereumProvider={hasInjectedProvider}
            rejectedConnection={rejectedConnection.value}
          />
        </Grid>
      </WalletConnectionInnerGrid>
    </StyledSection>
  );
});

export default ConnectWalletSection;
