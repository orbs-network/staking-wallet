import { Box, ButtonBase, Typography, useMediaQuery } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ConnectWalletOptions,
  InstalledWallet,
  walletConnection,
  WalletProviderType,
} from '../../services/wallet-connection';
import { useConnectWalletSectionTranslations } from '../../translations/translationsHooks';
import { CommonDialog } from '../../components/modal/CommonDialog';
import useTheme from '@material-ui/core/styles/useTheme';
import { QRCode } from 'react-qrcode-logo';
import { WalletGuideIconVariant, walletGuideOptions } from './walletGuideOptions';
import bitgetWalletLogo from '../../../assets/wallets/bitget-wallet.png';
import metaMaskWalletLogo from '../../../assets/wallets/MetaMask-icon-fox-with-margins.svg';

interface IProps {
  open: boolean;
  onClose: () => void;
  onSelect: (options: ConnectWalletOptions) => void;
}

type WalletOption = {
  key: string;
  labelKey: 'metamask' | 'walletConnect' | 'browserWallet' | 'bitgetWallet';
  providerType: WalletProviderType;
  icon: React.ReactNode;
  hidden?: boolean;
  provider?: InstalledWallet['provider'];
  walletName?: string;
  walletId?: string;
  walletRdns?: string;
  installUrl?: string;
};

type DialogView = 'wallet-info' | 'get-wallet' | 'tetra-mobile';

const TETRA_MOBILE_APP_STORE_URL = 'https://apps.apple.com/kr/app/tetra-mobile/id6453168712?l=en-GB';
const TETRA_MOBILE_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.orbs.pos.klip';

const DialogFrame = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  width: 760,
  minHeight: 500,
  maxHeight: 'calc(100vh - 32px)',
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  background: '#17181d',
  color: '#f7f7f8',
  position: 'relative',
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    width: 'calc(100vw - 24px)',
    maxWidth: '100%',
    height: 'calc(100vh - 16px)',
    maxHeight: 'calc(100vh - 16px)',
    minHeight: 'unset',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto minmax(0, 1fr)',
  },
}));

const WalletPane = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  minWidth: 0,
  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
  padding: '28px 24px',

  [theme.breakpoints.down('sm')]: {
    borderRight: 0,
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    maxHeight: '42vh',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '22px 18px',
  },
}));

const InfoPane = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  minWidth: 0,
  padding: '74px 54px 40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehavior: 'contain',

  [theme.breakpoints.down('sm')]: {
    padding: '28px 22px 30px',
  },
}));

const WalletGuidePane = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  minWidth: 0,
  padding: '20px 24px 28px',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 500,
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehavior: 'contain',

  [theme.breakpoints.down('sm')]: {
    minHeight: 0,
    padding: '18px 18px 24px',
  },
}));

const WalletGuideHeader = styled(Box)({
  width: '100%',
  minWidth: 0,
  minHeight: 34,
  display: 'grid',
  gridTemplateColumns: '34px 1fr 34px',
  alignItems: 'center',
});

const BackButton = styled.button(({ theme }) => ({
  width: 34,
  height: 34,
  border: 0,
  borderRadius: '50%',
  background: 'transparent',
  color: theme.palette.secondary.main,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
  },
}));

const CloseButton = styled.button({
  position: 'absolute',
  top: 18,
  right: 18,
  width: 34,
  height: 34,
  border: 0,
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#c8c9d1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

const SectionLabel = styled(Typography)({
  color: '#a6a8b2',
  fontSize: 13,
  fontWeight: 700,
  marginTop: 24,
  marginBottom: 10,
});

const WalletRow = styled(ButtonBase)({
  width: '100%',
  minHeight: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderRadius: 8,
  padding: '8px 10px',
  color: '#f6f6f7',
  transition: 'background 160ms ease',
  textAlign: 'left',

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.07)',
  },
});

const WalletIconImage = styled.img({
  width: 34,
  height: 34,
  borderRadius: 7,
  marginRight: 12,
  flex: '0 0 auto',
  objectFit: 'contain',
  background: 'rgba(255, 255, 255, 0.1)',
});

const WalletGuideIconImage = styled.img({
  width: 48,
  height: 48,
  borderRadius: 10,
  marginRight: 0,
  flex: '0 0 auto',
  objectFit: 'contain',
  background: 'transparent',
});

const WalletName = styled(Typography)({
  fontSize: 16,
  fontWeight: 700,
});

const WalletInstallList = styled(Box)({
  marginTop: 36,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

const WalletInstallRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '48px 1fr auto',
  gap: 16,
  alignItems: 'center',
});

const WalletInstallName = styled(Typography)({
  color: '#f7f7f8',
  fontSize: 16,
  fontWeight: 800,
});

const WalletInstallDescription = styled(Typography)({
  color: '#aaaeba',
  fontSize: 13,
  lineHeight: 1.4,
});

const WalletGetButton = styled.button(({ theme }) => ({
  border: 0,
  borderRadius: 5,
  background: '#26B47E',
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 800,
  padding: '8px 15px',
  cursor: 'pointer',

  '&:hover': {
    filter: 'brightness(1.08)',
  },
}));

const WalletGuideEmptyState = styled(Box)({
  marginTop: 'auto',
  textAlign: 'center',
  maxWidth: 320,
  alignSelf: 'center',
});

const IconBox = styled(Box)<{ variant: 'metamask' | 'walletconnect' | 'browser' | 'asset' }>(({ variant }) => {
  const backgrounds = {
    metamask: 'transparent',
    walletconnect: '#3b99fc',
    browser: '#1e5ad7',
    asset: 'linear-gradient(135deg, #6574ff 0%, #00d395 100%)',
  };

  return {
    width: 34,
    height: 34,
    borderRadius: 7,
    marginRight: 12,
    flex: '0 0 auto',
    background: backgrounds[variant],
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 15,
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.12) inset',
  };
});

const FeatureRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '54px 1fr',
  gap: 18,
  width: '100%',
  minWidth: 0,
  marginTop: 28,
});

const FeatureTitle = styled(Typography)({
  color: '#f7f7f8',
  fontSize: 15,
  fontWeight: 800,
  marginBottom: 4,
});

const FeatureDescription = styled(Typography)({
  color: '#aaaeba',
  fontSize: 13,
  lineHeight: 1.5,
});

const WalletInfoActionButton = styled.button<{ variant: 'primary' | 'secondary' }>(({ variant }) => ({
  appearance: 'none',
  boxSizing: 'border-box',
  width: 132,
  height: 40,
  minWidth: 132,
  maxWidth: 132,
  flex: '0 0 auto',
  marginTop: variant === 'primary' ? 36 : 10,
  border: '1px solid #26B47E',
  borderRadius: 5,
  background: variant === 'primary' ? '#26B47E' : 'rgba(38, 180, 126, 0.14)',
  color: '#ffffff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'inherit',
  fontSize: 13,
  fontWeight: 800,
  lineHeight: '16px',
  letterSpacing: 0,
  padding: 0,
  whiteSpace: 'nowrap',
  cursor: 'pointer',

  '&:hover': {
    background: variant === 'primary' ? '#26B47E' : 'rgba(38, 180, 126, 0.24)',
  },
}));

const LearnMoreButton = styled.button(({ theme }) => ({
  marginTop: 14,
  border: 0,
  background: 'transparent',
  color: theme.palette.secondary.main,
  fontSize: 14,
  fontWeight: 800,
  cursor: 'pointer',
}));

const TetraMobileIntro = styled(Typography)({
  color: '#aaaeba',
  fontSize: 14,
  lineHeight: 1.6,
  marginTop: 24,
  textAlign: 'center',
});

const StoreLinkGrid = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
  marginTop: 28,

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

const StoreLinkCard = styled(Box)({
  minWidth: 0,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 8,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.035)',
});

const StoreName = styled(Typography)({
  color: '#f7f7f8',
  fontSize: 15,
  fontWeight: 800,
  marginBottom: 10,
});

const QrCodeBox = styled(Box)({
  width: 132,
  height: 132,
  borderRadius: 8,
  overflow: 'hidden',
  background: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StoreOpenButton = styled.button({
  marginTop: 12,
  border: 0,
  borderRadius: 5,
  background: '#26B47E',
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 800,
  padding: '8px 14px',
  cursor: 'pointer',

  '&:hover': {
    filter: 'brightness(1.08)',
  },
});

const AssetClusterIcon = () => (
  <IconBox variant='asset'>
    <AccountBalanceWalletOutlinedIcon style={{ fontSize: 21 }} />
  </IconBox>
);

const WalletGuideIcon = ({ icon, variant }: { icon?: string; variant: WalletGuideIconVariant }) => {
  if (variant === 'metamask') {
    return <WalletGuideIconImage src={metaMaskWalletLogo} alt='' />;
  }

  if (icon) {
    return <WalletGuideIconImage src={icon} alt='' />;
  }

  if (variant === 'bitget') {
    return <WalletGuideIconImage src={bitgetWalletLogo} alt='' />;
  }

  return null;
};

function getInstalledWalletByName(wallets: InstalledWallet[], name: string) {
  return wallets.find((wallet) => wallet.name.toLowerCase().includes(name.toLowerCase()));
}

function WalletIcon({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return icon ? <WalletIconImage src={icon} alt='' /> : <>{children}</>;
}

function TetraMobileStoreCard({
  title,
  buttonText,
  url,
  onOpen,
}: {
  title: string;
  buttonText: string;
  url: string;
  onOpen: (url: string) => void;
}) {
  return (
    <StoreLinkCard>
      <StoreName>{title}</StoreName>
      <QrCodeBox>
        <QRCode value={url} size={112} quietZone={4} qrStyle='dots' fgColor='#111217' />
      </QrCodeBox>
      <StoreOpenButton onClick={() => onOpen(url)}>{buttonText}</StoreOpenButton>
    </StoreLinkCard>
  );
}

function WalletConnectGlyph() {
  return (
    <svg width='24' height='24' viewBox='0 0 1024 1024' aria-hidden='true'>
      <path
        d='M282.298 367.394C409.986 242.869 617.015 242.869 744.703 367.394L760.071 382.38C766.456 388.605 766.456 398.701 760.071 404.926L707.502 456.193C704.309 459.306 699.134 459.306 695.942 456.193L674.794 435.57C585.713 348.698 441.288 348.698 352.207 435.57L329.558 457.655C326.365 460.768 321.191 460.768 317.998 457.655L265.429 406.388C259.043 400.163 259.043 390.068 265.429 383.843L282.298 367.394ZM853.425 473.418L900.211 519.045C906.596 525.27 906.596 535.365 900.211 541.59L689.242 747.329C682.86 753.557 672.508 753.557 666.123 747.329L516.392 601.312C514.795 599.754 512.208 599.754 510.612 601.312L360.881 747.329C354.498 753.557 344.147 753.557 337.761 747.329L126.788 541.587C120.404 535.362 120.404 525.267 126.788 519.042L173.576 473.415C179.96 467.19 190.312 467.19 196.696 473.415L346.43 619.435C348.026 620.992 350.613 620.992 352.21 619.435L501.937 473.415C508.32 467.187 518.672 467.187 525.057 473.415L674.791 619.435C676.387 620.992 678.975 620.992 680.571 619.435L830.305 473.418C836.687 467.19 847.039 467.19 853.425 473.418Z'
        fill='currentColor'
      />
    </svg>
  );
}

function BrowserWalletGlyph() {
  return (
    <svg width='22' height='18' viewBox='0 0 22 18' aria-hidden='true'>
      <rect x='1' y='3' width='20' height='14' rx='2' fill='none' stroke='currentColor' strokeWidth='2' />
      <path d='M1 7h20' stroke='currentColor' strokeWidth='2' />
      <circle cx='5' cy='5' r='1' fill='currentColor' />
      <circle cx='8' cy='5' r='1' fill='currentColor' />
    </svg>
  );
}

function WalletOptionsDialog({ open, onClose, onSelect }: IProps) {
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [view, setView] = useState<DialogView>('wallet-info');
  const [installedWallets, setInstalledWallets] = useState<InstalledWallet[]>([]);
  const openWalletGuide = () => window.open('https://ethereum.org/wallets/', '_blank');

  const guideTitle =
    view === 'get-wallet'
      ? connectWalletSectionTranslations('getWalletTitle')
      : connectWalletSectionTranslations('tetraMobileTitle');

  useEffect(() => {
    if (!open) {
      return;
    }

    setView('wallet-info');
    return walletConnection.subscribeInstalledWallets(setInstalledWallets);
  }, [open]);

  const handleClose = () => {
    setView('wallet-info');
    onClose();
  };

  const openWalletInstallPage = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const connectWallet = (wallet: WalletOption) => {
    if (wallet.installUrl && !wallet.provider) {
      openWalletInstallPage(wallet.installUrl);
      return;
    }

    onSelect({
      providerType: wallet.providerType,
      provider: wallet.provider,
      walletName: wallet.walletName || (wallet.labelKey && connectWalletSectionTranslations(wallet.labelKey)),
      walletId: wallet.walletId,
      walletRdns: wallet.walletRdns,
    });
  };

  const metaMaskWallet = getInstalledWalletByName(installedWallets, 'MetaMask');
  const bitgetWallet = getInstalledWalletByName(installedWallets, 'Bitget');
  const hasBrowserWallet = installedWallets.length > 0 || walletConnection.hasBrowserWallet();
  const popularWallets: WalletOption[] = [
    {
      key: 'walletconnect',
      labelKey: 'walletConnect',
      providerType: 'reown',
      icon: (
        <IconBox variant='walletconnect'>
          <WalletConnectGlyph />
        </IconBox>
      ),
    },
    {
      key: 'metamask',
      labelKey: 'metamask',
      providerType: 'injected',
      provider: metaMaskWallet && metaMaskWallet.provider,
      walletName: 'MetaMask',
      walletId: metaMaskWallet && metaMaskWallet.id,
      walletRdns: metaMaskWallet && metaMaskWallet.rdns,
      installUrl: metaMaskWallet ? undefined : 'https://metamask.io/download/',
      icon: <WalletIconImage src={metaMaskWalletLogo} alt='' />,
    },
    {
      key: 'bitget',
      labelKey: 'bitgetWallet',
      providerType: 'injected',
      provider: bitgetWallet && bitgetWallet.provider,
      walletName: 'Bitget Wallet',
      walletId: bitgetWallet && bitgetWallet.id,
      walletRdns: bitgetWallet && bitgetWallet.rdns,
      installUrl: bitgetWallet ? undefined : 'https://web3.bitget.com/wallet-download',
      icon: <WalletIconImage src={bitgetWallet && bitgetWallet.icon ? bitgetWallet.icon : bitgetWalletLogo} alt='' />,
    },
    {
      key: 'browser-wallet',
      labelKey: 'browserWallet',
      providerType: 'injected',
      hidden: !hasBrowserWallet,
      icon: (
        <IconBox variant='browser'>
          <BrowserWalletGlyph />
        </IconBox>
      ),
    },
  ];

  return (
    <CommonDialog open={open} onClose={handleClose}>
      <DialogFrame>
        <CloseButton onClick={handleClose} aria-label={connectWalletSectionTranslations('closeWalletDialog')}>
          <CloseIcon style={{ fontSize: 20 }} />
        </CloseButton>

        <WalletPane>
          <Typography variant='h6' style={{ fontWeight: 800, fontSize: 20 }}>
            {connectWalletSectionTranslations('selectWallet')}
          </Typography>

          {!!installedWallets.length && (
            <>
              <SectionLabel style={{ color: theme.palette.secondary.main }}>
                {connectWalletSectionTranslations('installedWallets')}
              </SectionLabel>

              {installedWallets.map((wallet) => (
                <WalletRow
                  key={wallet.id}
                  data-testid={`button-connect-installed-${wallet.id}`}
                  onClick={() =>
                    onSelect({
                      providerType: 'injected',
                      provider: wallet.provider,
                      walletName: wallet.name,
                      walletId: wallet.id,
                      walletRdns: wallet.rdns,
                    })
                  }
                >
                  <WalletIcon icon={wallet.icon}>
                    <IconBox variant='browser'>
                      <BrowserWalletGlyph />
                    </IconBox>
                  </WalletIcon>
                  <WalletName>{wallet.name}</WalletName>
                </WalletRow>
              ))}
            </>
          )}

          <SectionLabel>{connectWalletSectionTranslations('popularWallets')}</SectionLabel>
          {popularWallets
            .filter((wallet) => !wallet.hidden)
            .map((wallet) => (
              <WalletRow
                key={wallet.key}
                data-testid={`button-connect-${wallet.key}`}
                onClick={() => connectWallet(wallet)}
              >
                {wallet.icon}
                <WalletName>{connectWalletSectionTranslations(wallet.labelKey)}</WalletName>
              </WalletRow>
            ))}
        </WalletPane>

        {view === 'wallet-info' ? (
          <InfoPane>
            <Typography variant='h6' style={{ fontWeight: 800, fontSize: isSmall ? 18 : 20, textAlign: 'center' }}>
              {connectWalletSectionTranslations('whatIsWallet')}
            </Typography>

            <FeatureRow>
              <AssetClusterIcon />
              <Box>
                <FeatureTitle>{connectWalletSectionTranslations('walletOwnAssetsTitle')}</FeatureTitle>
                <FeatureDescription>
                  {connectWalletSectionTranslations('walletOwnAssetsDescription')}
                </FeatureDescription>
              </Box>
            </FeatureRow>

            <FeatureRow>
              <IconBox variant='asset'>ID</IconBox>
              <Box>
                <FeatureTitle>{connectWalletSectionTranslations('walletLoginTitle')}</FeatureTitle>
                <FeatureDescription>{connectWalletSectionTranslations('walletLoginDescription')}</FeatureDescription>
              </Box>
            </FeatureRow>

            <WalletInfoActionButton variant='primary' onClick={() => setView('get-wallet')}>
              {connectWalletSectionTranslations('getWallet')}
            </WalletInfoActionButton>
            <WalletInfoActionButton variant='secondary' onClick={() => setView('tetra-mobile')}>
              {connectWalletSectionTranslations('tetraMobile')}
            </WalletInfoActionButton>
            <LearnMoreButton onClick={openWalletGuide}>{connectWalletSectionTranslations('learnMore')}</LearnMoreButton>
          </InfoPane>
        ) : view === 'get-wallet' ? (
          <WalletGuidePane>
            <WalletGuideHeader>
              <BackButton
                onClick={() => setView('wallet-info')}
                aria-label={connectWalletSectionTranslations('whatIsWallet')}
              >
                <ArrowBackIcon style={{ fontSize: 22 }} />
              </BackButton>
              <Typography variant='h6' style={{ fontWeight: 800, fontSize: isSmall ? 18 : 20, textAlign: 'center' }}>
                {guideTitle}
              </Typography>
              <span />
            </WalletGuideHeader>

            <WalletInstallList>
              {walletGuideOptions.map((wallet) => {
                const installedGuideWallet =
                  wallet.key === 'metamask' ? metaMaskWallet : wallet.key === 'bitget' ? bitgetWallet : undefined;

                return (
                  <WalletInstallRow key={wallet.key}>
                    <WalletGuideIcon
                      icon={installedGuideWallet && installedGuideWallet.icon}
                      variant={wallet.iconVariant}
                    />
                    <Box>
                      <WalletInstallName>{connectWalletSectionTranslations(wallet.nameKey)}</WalletInstallName>
                      <WalletInstallDescription>
                        {connectWalletSectionTranslations(wallet.descriptionKey)}
                      </WalletInstallDescription>
                    </Box>
                    <WalletGetButton onClick={() => openWalletInstallPage(wallet.getUrl)}>
                      {connectWalletSectionTranslations('get')}
                    </WalletGetButton>
                  </WalletInstallRow>
                );
              })}
            </WalletInstallList>

            <WalletGuideEmptyState>
              <FeatureTitle>{connectWalletSectionTranslations('walletGuideEmptyTitle')}</FeatureTitle>
              <FeatureDescription>{connectWalletSectionTranslations('walletGuideEmptyDescription')}</FeatureDescription>
            </WalletGuideEmptyState>
          </WalletGuidePane>
        ) : (
          <WalletGuidePane>
            <WalletGuideHeader>
              <BackButton
                onClick={() => setView('wallet-info')}
                aria-label={connectWalletSectionTranslations('whatIsWallet')}
              >
                <ArrowBackIcon style={{ fontSize: 22 }} />
              </BackButton>
              <Typography variant='h6' style={{ fontWeight: 800, fontSize: isSmall ? 18 : 20, textAlign: 'center' }}>
                {guideTitle}
              </Typography>
              <span />
            </WalletGuideHeader>

            <TetraMobileIntro>{connectWalletSectionTranslations('tetraMobileDescription')}</TetraMobileIntro>

            <StoreLinkGrid>
              <TetraMobileStoreCard
                title={connectWalletSectionTranslations('tetraMobileIos')}
                buttonText={connectWalletSectionTranslations('openStore')}
                url={TETRA_MOBILE_APP_STORE_URL}
                onOpen={openWalletInstallPage}
              />
              <TetraMobileStoreCard
                title={connectWalletSectionTranslations('tetraMobileAndroid')}
                buttonText={connectWalletSectionTranslations('openStore')}
                url={TETRA_MOBILE_PLAY_STORE_URL}
                onOpen={openWalletInstallPage}
              />
            </StoreLinkGrid>
          </WalletGuidePane>
        )}
      </DialogFrame>
    </CommonDialog>
  );
}

export default WalletOptionsDialog;
