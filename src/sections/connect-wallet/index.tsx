import React, { useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../../store/storeHooks';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useBoolean } from 'react-hanger';
import { Section } from '../../components/structure/Section';
import {
  useConnectWalletSectionTranslations,
  useSectionsTitlesTranslations,
} from '../../translations/translationsHooks';
import { ReactComponent as TetraIconSvg } from '../../../assets/logos/tetra_icon.svg';
import { ReactComponent as TetraLogoSvg } from '../../../assets/logos/tetra_logo.svg';
import InstallOrConnectBtn from './components/install-or-connect-btn';
import LegalAgreement from './components/legal-agreement';
import Message from './components/message';
import { WalletConnectionInnerGrid } from './components/style';

interface IProps {
  onClick: () => void;
  isInstalled?: boolean;
  rejectedConnection?: boolean;
  hasEthereumProvider?: boolean;
}

const ConnectWalletSection = observer(({ onClick, isInstalled, rejectedConnection, hasEthereumProvider }: IProps) => {
  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const pressedOnInstallMetamask = useBoolean(false);
  const legalDocsAgreedTo = useBoolean(false);

  const hoverTargetRef = useRef();

  const shouldDisplayLegalTicker = isInstalled;

  const handleInstallClicked = useCallback(async () => {
    window.open('https://metamask.io/', '_blank');
    pressedOnInstallMetamask.setTrue();
  }, [pressedOnInstallMetamask]);

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
        ref={hoverTargetRef}
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
          <Grid item style={{ paddingRight: 0, paddingLeft: 0 }}>
            <InstallOrConnectBtn
              walletConnectionState={isInstalled ? 'connect' : 'install'}
              onClick={onClick}
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
            hasEthereumProvider={hasEthereumProvider}
            rejectedConnection={rejectedConnection}
          />
        </Grid>
      </WalletConnectionInnerGrid>
    </Section>
  );
});

export default ConnectWalletSection;
