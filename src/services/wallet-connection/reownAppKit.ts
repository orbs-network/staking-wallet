import config from '../../../config';
import { DEFAULT_CHAIN, NETWORK_QUERY_PARAM } from '../../constants';
import { getSupportedChains } from '../../utils';

declare const require: any;

const DEFAULT_SUPPORTED_REOWN_CHAINS = [1, 137];
const REOWN_CONNECT_TIMEOUT_MS = 120000;
const REOWN_RESTORE_TIMEOUT_MS = 5000;
const EIP155_NAMESPACE = 'eip155';

let appKit: any = null;
let initializationError: Error | null = null;

function getProjectId() {
  return process.env.REOWN_PROJECT_ID || '';
}

function getMetadata() {
  const origin = window.location.origin;

  return {
    name: 'ORBS Staking Wallet',
    description: 'ORBS staking wallet',
    url: origin,
    icons: [`${origin}/favicon.png`],
  };
}

function getReownNetwork(chainId: number) {
  const network = config.networks[chainId];

  if (!network || !network.nativeCurrency || !network.rpcUrls || !network.rpcUrls.length) {
    throw new Error(`Unsupported Reown network ${chainId}`);
  }

  return {
    id: chainId,
    caipNetworkId: `${EIP155_NAMESPACE}:${chainId}`,
    chainNamespace: EIP155_NAMESPACE,
    name: network.name,
    nativeCurrency: {
      name: network.nativeCurrency.name,
      symbol: network.nativeCurrency.symbol,
      decimals: network.nativeCurrency.decimals,
    },
    rpcUrls: {
      default: {
        http: network.rpcUrls,
      },
    },
    blockExplorers: network.blockExplorerUrl
      ? {
          default: {
            name: network.name,
            url: network.blockExplorerUrl,
          },
        }
      : undefined,
  };
}

function getReownSupportedChains() {
  const configuredChains = getSupportedChains().filter((chainId) => {
    const network = config.networks[chainId];
    return network && network.nativeCurrency && network.rpcUrls && network.rpcUrls.length;
  });

  if (configuredChains.length) {
    return configuredChains;
  }

  return DEFAULT_SUPPORTED_REOWN_CHAINS.filter((chainId) => {
    const network = config.networks[chainId];
    return network && network.nativeCurrency && network.rpcUrls && network.rpcUrls.length;
  });
}

function getReownNetworks(targetChainId?: number) {
  const supportedChains = getReownSupportedChains();
  const supportedNetworks = supportedChains.map(getReownNetwork);
  const fallbackChain = supportedChains.includes(Number(DEFAULT_CHAIN))
    ? Number(DEFAULT_CHAIN)
    : supportedChains[0] || Number(DEFAULT_CHAIN);
  const selected = targetChainId && supportedChains.includes(targetChainId) ? targetChainId : fallbackChain;

  return [getReownNetwork(selected), ...supportedNetworks.filter((network) => network.id !== selected)] as [
    any,
    ...any[]
  ];
}

function getCustomRpcUrls() {
  return getReownSupportedChains().reduce((rpcUrls, chainId) => {
    const network = config.networks[chainId];

    if (network && network.rpcUrls && network.rpcUrls.length) {
      rpcUrls[`${EIP155_NAMESPACE}:${chainId}`] = network.rpcUrls.map((url) => ({ url }));
    }

    return rpcUrls;
  }, {} as { [caipNetworkId: string]: Array<{ url: string }> });
}

function getReownModules() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const appKitModule = require('@reown/appkit');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ethersAdapterModule = require('@reown/appkit-adapter-ethers5');

  return {
    createAppKit: appKitModule.createAppKit,
    Ethers5Adapter: ethersAdapterModule.Ethers5Adapter,
  };
}

export function getReownAppKit(targetChainId?: number) {
  if (appKit) {
    return appKit;
  }

  const projectId = getProjectId();

  if (!projectId) {
    throw new Error('Missing REOWN_PROJECT_ID');
  }

  const { createAppKit, Ethers5Adapter } = getReownModules();
  const networks = getReownNetworks(targetChainId);

  appKit = createAppKit({
    projectId,
    metadata: getMetadata(),
    networks,
    defaultNetwork: networks[0],
    adapters: [new Ethers5Adapter()],
    allWallets: 'SHOW',
    enableEIP6963: true,
    enableBaseAccount: false,
    enableCoinbase: false,
    enableInjected: true,
    enableWalletConnect: true,
    customRpcUrls: getCustomRpcUrls(),
    showWallets: true,
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#26B47E',
      '--w3m-border-radius-master': '1px',
    },
    features: {
      email: false,
      socials: false,
      swaps: false,
      onramp: false,
      history: false,
      analytics: false,
      allWallets: true,
      connectMethodsOrder: ['wallet'],
      connectorTypeOrder: ['walletConnect', 'injected', 'featured', 'recommended', 'recent'],
    },
  });

  return appKit;
}

function getInitialTargetChainId() {
  const chainId = new URLSearchParams(window.location.search).get(NETWORK_QUERY_PARAM);
  const parsedChainId = chainId ? Number(chainId) : DEFAULT_CHAIN;
  const supportedChains = getReownSupportedChains();

  return supportedChains.includes(parsedChainId) ? parsedChainId : DEFAULT_CHAIN;
}

export function initializeReownAppKit(targetChainId?: number) {
  if (appKit) {
    return appKit;
  }

  try {
    initializationError = null;
    return getReownAppKit(targetChainId || getInitialTargetChainId());
  } catch (error) {
    initializationError = error as Error;

    if (process.env.NODE_ENV !== 'test') {
      console.warn('Reown AppKit initialization was skipped', error);
    }

    return null;
  }
}

export function getReownInitializationError() {
  return initializationError;
}

export function isReownAppKitReady() {
  return !!appKit;
}

export async function disconnectReownAppKit() {
  if (!appKit) {
    return;
  }

  await appKit.disconnect(EIP155_NAMESPACE);
}

export async function switchReownNetwork(targetChainId: number) {
  if (!appKit) {
    return false;
  }

  await appKit.switchNetwork(getReownNetwork(targetChainId), { throwOnFailure: true });
  return true;
}

function getConnectedAccount(appKitInstance: any) {
  const account = appKitInstance.getAccount ? appKitInstance.getAccount(EIP155_NAMESPACE) : null;
  const address = account && account.isConnected ? account.address : null;

  if (address) {
    return account;
  }

  const fallbackAddress = appKitInstance.getAddress ? appKitInstance.getAddress(EIP155_NAMESPACE) : null;
  return fallbackAddress ? { ...account, address: fallbackAddress, isConnected: true } : null;
}

function getConnectedSession(appKitInstance: any) {
  const account = getConnectedAccount(appKitInstance);
  const provider = appKitInstance.getWalletProvider ? appKitInstance.getWalletProvider() : null;

  return account && provider ? { account, provider } : null;
}

export async function waitForReownRestoredConnection(appKitInstance: any) {
  const currentSession = getConnectedSession(appKitInstance);

  if (currentSession) {
    return currentSession;
  }

  return new Promise<{ account: any; provider: any } | null>((resolve) => {
    let settled = false;
    let interval: any = null;
    let timeout: any = null;
    const cleanupCallbacks: Array<() => void> = [];

    const cleanup = () => {
      cleanupCallbacks.forEach((callback) => callback());
      clearInterval(interval);
      clearTimeout(timeout);
    };

    const settle = (session: { account: any; provider: any } | null) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve(session);
    };

    const checkSession = () => {
      const session = getConnectedSession(appKitInstance);

      if (session) {
        settle(session);
      }
    };

    interval = setInterval(checkSession, 250);
    timeout = setTimeout(() => settle(null), REOWN_RESTORE_TIMEOUT_MS);

    if (appKitInstance.subscribeAccount) {
      cleanupCallbacks.push(appKitInstance.subscribeAccount(() => checkSession(), EIP155_NAMESPACE));
    }
  });
}

export async function waitForReownConnection(appKitInstance: any) {
  const currentSession = getConnectedSession(appKitInstance);

  if (currentSession) {
    return currentSession;
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let modalWasOpen = appKitInstance.isOpen ? appKitInstance.isOpen() : false;
    let interval: any = null;
    let timeout: any = null;
    const cleanupCallbacks: Array<() => void> = [];

    const cleanup = () => {
      cleanupCallbacks.forEach((callback) => callback());
      clearInterval(interval);
      clearTimeout(timeout);
    };

    const settle = (callback: () => void) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      callback();
    };

    const checkSession = (account?: any) => {
      const connectedAccount =
        account && account.isConnected && account.address ? account : getConnectedAccount(appKitInstance);
      const provider = appKitInstance.getWalletProvider ? appKitInstance.getWalletProvider() : null;

      if (connectedAccount && provider) {
        settle(() => resolve({ account: connectedAccount, provider }));
      }
    };

    const checkModal = () => {
      if (!appKitInstance.isOpen) {
        return;
      }

      const isOpen = appKitInstance.isOpen();
      modalWasOpen = modalWasOpen || isOpen;

      if (modalWasOpen && !isOpen && !getConnectedAccount(appKitInstance)) {
        settle(() => reject(new Error('Wallet connection was cancelled')));
      }
    };

    interval = setInterval(() => {
      checkSession();
      checkModal();
    }, 250);
    timeout = setTimeout(
      () => settle(() => reject(new Error('Wallet connection timed out'))),
      REOWN_CONNECT_TIMEOUT_MS,
    );

    cleanupCallbacks.push(appKitInstance.subscribeAccount((account: any) => checkSession(account), EIP155_NAMESPACE));
    if (appKitInstance.subscribeProviders) {
      cleanupCallbacks.push(appKitInstance.subscribeProviders(() => checkSession()));
    }
    cleanupCallbacks.push(
      appKitInstance.subscribeState((state: any) => {
        modalWasOpen = modalWasOpen || !!state.open;

        if (modalWasOpen && !state.open) {
          checkModal();
        }
      }),
    );
  });
}

export function getReownWalletName(appKitInstance: any) {
  const walletInfo = appKitInstance.getWalletInfo ? appKitInstance.getWalletInfo(EIP155_NAMESPACE) : null;

  if (walletInfo && walletInfo.name) {
    return walletInfo.name;
  }

  const providerType = appKitInstance.getWalletProviderType ? appKitInstance.getWalletProviderType() : null;
  return providerType ? String(providerType) : 'Reown Wallet';
}

export function isReownWalletConnect(appKitInstance: any) {
  const providerType = appKitInstance.getWalletProviderType ? appKitInstance.getWalletProviderType() : '';
  return String(providerType).toLowerCase().includes('walletconnect');
}

export function getReownChainId(appKitInstance: any) {
  const chainId = appKitInstance.getChainId ? appKitInstance.getChainId() : null;
  return chainId;
}
