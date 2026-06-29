import Web3 from 'web3';
import config from '../../../config';
import { DEFAULT_CHAIN } from '../../constants';
import { web3Modal } from '../web3modal';
import {
  disconnectReownAppKit,
  getReownAppKit,
  getReownChainId,
  getReownWalletName,
  isReownAppKitReady,
  isReownWalletConnect,
  switchReownNetwork,
  waitForReownRestoredConnection,
  waitForReownConnection,
} from './reownAppKit';
import { ConnectedWallet, ConnectWalletOptions, Eip1193Provider, InstalledWallet, WalletProviderType } from './types';

const LAST_PROVIDER_KEY = 'orbs.walletConnection.lastProviderType';
const LAST_INJECTED_WALLET_KEY = 'orbs.walletConnection.lastInjectedWallet';
const NETWORK_SWITCH_SETTLE_TIMEOUT_MS = 5000;
const REOWN_NETWORK_SWITCH_TIMEOUT_MS = 15000;
const CHAIN_READ_TIMEOUT_MS = 3000;

const announcedProviders: any[] = [];
const installedWalletListeners: Array<(wallets: InstalledWallet[]) => void> = [];
let eip6963Listening = false;

type InjectedWalletPreference = {
  id?: string;
  rdns?: string;
  name?: string;
};

function isSameAnnouncedProvider(left: any, right: any) {
  if (!left || !right) {
    return false;
  }

  if (left.info && right.info && left.info.uuid && right.info.uuid) {
    return left.info.uuid === right.info.uuid;
  }

  if (left.info && right.info && left.info.rdns && right.info.rdns) {
    return left.info.rdns === right.info.rdns;
  }

  if (left.provider && right.provider && left.provider === right.provider) {
    return (
      (!left.info && !right.info) || (!!left.info && !!right.info && (left.info.name || '') === (right.info.name || ''))
    );
  }

  return false;
}

function requestEip6963Providers() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event('eip6963:requestProvider'));
}

function normalizeChainId(chainId: string | number | null | undefined): number | null {
  if (chainId === null || chainId === undefined) {
    return null;
  }

  if (typeof chainId === 'number') {
    return chainId;
  }

  return chainId.startsWith('0x') ? parseInt(chainId, 16) : Number(chainId);
}

function getSwitchErrorCode(error: any): number | string | undefined {
  return error && (error.code || (error.data && error.data.originalError && error.data.originalError.code));
}

function getAddChainParams(targetChainId: number) {
  const chain = config.networks[targetChainId];

  if (!chain || !chain.nativeCurrency || !chain.rpcUrls || !chain.rpcUrls.length) {
    throw new Error(`Unsupported network ${targetChainId}`);
  }

  return {
    chainId: Web3.utils.toHex(targetChainId),
    chainName: chain.name,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrls: chain.rpcUrls,
    blockExplorerUrls: chain.blockExplorerUrl ? [chain.blockExplorerUrl] : [],
  };
}

function switchProviderNetwork(provider: Eip1193Provider, targetChainId: number) {
  return provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: Web3.utils.toHex(targetChainId) }],
  });
}

async function readAccounts(provider: Eip1193Provider): Promise<string[]> {
  if (provider.request) {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    return accounts || [];
  }

  if (provider.enable) {
    return provider.enable();
  }

  return [];
}

async function readAuthorizedAccounts(provider: Eip1193Provider): Promise<string[]> {
  if (provider.accounts && provider.accounts.length) {
    return provider.accounts;
  }

  if (provider.request) {
    const accounts = await provider.request({ method: 'eth_accounts' });
    return accounts || [];
  }

  return [];
}

async function readChainId(provider: Eip1193Provider): Promise<number | null> {
  if (provider.request) {
    const chainId = await provider.request({ method: 'eth_chainId' });
    return normalizeChainId(chainId);
  }

  const providerChainId = normalizeChainId(provider.chainId);
  if (providerChainId) {
    return providerChainId;
  }

  const web3 = new Web3(provider as any);
  return web3.eth.getChainId();
}

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeoutMs)),
  ]);
}

async function readChainIdSafely(provider: Eip1193Provider): Promise<number | null> {
  try {
    return await withTimeout(readChainId(provider), CHAIN_READ_TIMEOUT_MS, 'Reading wallet chain id timed out');
  } catch (error) {
    return null;
  }
}

async function waitForResolvedReownChainId(appKit: any, provider: Eip1193Provider): Promise<number | null> {
  const startedAt = Date.now();
  let chainId = normalizeChainId(getReownChainId(appKit)) || (await readChainIdSafely(provider));

  while (!chainId && Date.now() - startedAt < NETWORK_SWITCH_SETTLE_TIMEOUT_MS) {
    await wait(250);
    chainId = normalizeChainId(getReownChainId(appKit)) || (await readChainIdSafely(provider));
  }

  return chainId;
}

async function waitForProviderChain(provider: Eip1193Provider, targetChainId: number): Promise<number | null> {
  const startedAt = Date.now();
  let chainId = await readChainIdSafely(provider);

  while (chainId !== targetChainId && Date.now() - startedAt < NETWORK_SWITCH_SETTLE_TIMEOUT_MS) {
    await wait(250);
    chainId = await readChainIdSafely(provider);
  }

  return chainId;
}

async function setWalletConnectDefaultChain(provider: Eip1193Provider, targetChainId: number) {
  if (!provider.setDefaultChain) {
    return false;
  }

  const network = config.networks[targetChainId];
  const rpcUrl = network && network.rpcUrls && network.rpcUrls[0];

  await Promise.resolve(provider.setDefaultChain(`eip155:${targetChainId}`, rpcUrl));
  return true;
}

function getActiveReownChainId(): number | null {
  if (!isReownAppKitReady()) {
    return null;
  }

  try {
    return normalizeChainId(getReownChainId(getReownAppKit()));
  } catch (error) {
    return null;
  }
}

async function switchReownProviderNetwork(provider: Eip1193Provider, targetChainId: number): Promise<number> {
  let switchError: any = null;

  if (isReownAppKitReady()) {
    try {
      await withTimeout(
        switchReownNetwork(targetChainId),
        REOWN_NETWORK_SWITCH_TIMEOUT_MS,
        `Reown network switch to ${targetChainId} timed out`,
      );
    } catch (error) {
      switchError = error;
    }
  }

  let chainId = await waitForProviderChain(provider, targetChainId);

  if (chainId === targetChainId) {
    return chainId;
  }

  if (getActiveReownChainId() === targetChainId) {
    return targetChainId;
  }

  if (await setWalletConnectDefaultChain(provider, targetChainId)) {
    chainId = await waitForProviderChain(provider, targetChainId);

    if (chainId === targetChainId) {
      return chainId;
    }

    if (getActiveReownChainId() === targetChainId) {
      return targetChainId;
    }
  }

  throw switchError || new Error(`Wallet network did not switch to ${targetChainId}`);
}

async function ensureProviderNetwork(provider: Eip1193Provider, targetChainId?: number): Promise<number | null> {
  let chainId = await readChainId(provider);

  if (!targetChainId || chainId === targetChainId) {
    return chainId;
  }

  try {
    await switchProviderNetwork(provider, targetChainId);
  } catch (error) {
    if (getSwitchErrorCode(error) !== 4902) {
      throw error;
    }

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [getAddChainParams(targetChainId)],
    });
    await switchProviderNetwork(provider, targetChainId);
  }

  chainId = await waitForProviderChain(provider, targetChainId);
  return chainId;
}

function getLegacyInjectedProviders(): Eip1193Provider[] {
  const providers: Eip1193Provider[] = [];
  const ethereum = (window as any).ethereum;
  const onto = (window as any).onto;

  if (ethereum && Array.isArray(ethereum.providers)) {
    providers.push(...ethereum.providers);
  } else if (ethereum) {
    providers.push(ethereum);
  }

  if (onto) {
    providers.push(onto);
  }

  return providers;
}

function getInjectedWalletId(name: string, provider: Eip1193Provider, index: number) {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${provider.isMetaMask ? 'metamask' : index}`;
}

function getInjectedWalletName(provider: Eip1193Provider): string {
  if (provider.isEnkrypt) {
    return 'Enkrypt';
  }

  if (provider.isRabby) {
    return 'Rabby Wallet';
  }

  if (provider.isBraveWallet) {
    return 'Brave Wallet';
  }

  if (provider.isCoinbaseWallet) {
    return 'Coinbase Wallet';
  }

  if (provider.isMetaMask) {
    return 'MetaMask';
  }

  if (provider.isTrust) {
    return 'Trust Wallet';
  }

  if (provider.isImToken) {
    return 'ImToken';
  }

  return 'Browser Wallet';
}

function addInstalledWallet(wallets: InstalledWallet[], wallet: InstalledWallet) {
  const alreadyExists = wallets.some((item) => {
    if (item.id === wallet.id || (item.rdns && wallet.rdns && item.rdns === wallet.rdns)) {
      return true;
    }

    if (item.provider !== wallet.provider) {
      return false;
    }

    return item.name === wallet.name || (!item.rdns && !wallet.rdns);
  });

  if (!alreadyExists) {
    wallets.push(wallet);
  }
}

function getInstalledWalletsSnapshot(): InstalledWallet[] {
  const wallets: InstalledWallet[] = [];

  announcedProviders.forEach((item, index) => {
    if (!item.provider || !item.info) {
      return;
    }

    const name = item.info.name || getInjectedWalletName(item.provider);
    addInstalledWallet(wallets, {
      id: item.info.uuid || item.info.rdns || getInjectedWalletId(name, item.provider, index),
      name,
      icon: item.info.icon,
      provider: item.provider,
      rdns: item.info.rdns,
    });
  });

  getLegacyInjectedProviders().forEach((provider, index) => {
    const name = getInjectedWalletName(provider);
    const hasEip6963Wallet = wallets.some((wallet) => wallet.rdns && wallet.name === name);

    if (hasEip6963Wallet) {
      return;
    }

    addInstalledWallet(wallets, {
      id: getInjectedWalletId(name, provider, index),
      name,
      provider,
    });
  });

  return wallets;
}

function notifyInstalledWalletListeners() {
  const wallets = getInstalledWalletsSnapshot();
  installedWalletListeners.forEach((listener) => listener(wallets));
}

function listenForEip6963Providers() {
  if (typeof window === 'undefined') {
    return;
  }

  if (eip6963Listening) {
    return;
  }

  eip6963Listening = true;
  window.addEventListener('eip6963:announceProvider', ((event: CustomEvent) => {
    const detail = event.detail;
    if (detail && detail.provider && !announcedProviders.find((item) => isSameAnnouncedProvider(item, detail))) {
      announcedProviders.push(detail);
      notifyInstalledWalletListeners();
    }
  }) as EventListener);
}

function discoverEip6963Providers(): Promise<any[]> {
  listenForEip6963Providers();
  requestEip6963Providers();

  return new Promise((resolve) => {
    setTimeout(() => resolve(announcedProviders), 150);
  });
}

async function discoverInstalledWallets(): Promise<InstalledWallet[]> {
  await discoverEip6963Providers();

  return getInstalledWalletsSnapshot();
}

function subscribeInstalledWallets(listener: (wallets: InstalledWallet[]) => void) {
  installedWalletListeners.push(listener);
  listenForEip6963Providers();

  const emitSnapshot = () => listener(getInstalledWalletsSnapshot());
  const requestAndEmitSnapshot = () => {
    requestEip6963Providers();
    emitSnapshot();
  };

  requestAndEmitSnapshot();
  const timers = [100, 300, 750, 1500].map((delay) => setTimeout(requestAndEmitSnapshot, delay));
  const interval = setInterval(requestAndEmitSnapshot, 1000);

  return () => {
    const index = installedWalletListeners.indexOf(listener);
    if (index >= 0) {
      installedWalletListeners.splice(index, 1);
    }

    timers.forEach((timer) => clearTimeout(timer));
    clearInterval(interval);
  };
}

function initializeInstalledWalletDiscovery() {
  if (typeof window === 'undefined') {
    return;
  }

  listenForEip6963Providers();
  requestEip6963Providers();
  [100, 500, 1500].forEach((delay) => setTimeout(requestEip6963Providers, delay));
}

initializeInstalledWalletDiscovery();

function setLastProvider(providerType: WalletProviderType | null) {
  try {
    if (providerType) {
      window.localStorage.setItem(LAST_PROVIDER_KEY, providerType);
    } else {
      window.localStorage.removeItem(LAST_PROVIDER_KEY);
    }
  } catch (error) {}
}

function getLastProvider(): WalletProviderType | null {
  try {
    const providerType = window.localStorage.getItem(LAST_PROVIDER_KEY);
    return providerType === 'walletconnect' || providerType === 'injected' || providerType === 'reown'
      ? providerType
      : null;
  } catch (error) {
    return null;
  }
}

function setLastInjectedWallet(options: ConnectWalletOptions, provider: Eip1193Provider, walletName?: string | null) {
  try {
    const matchedWallet = getInstalledWalletsSnapshot().find((wallet) => wallet.provider === provider);
    const preference: InjectedWalletPreference = {
      id: options.walletId || (matchedWallet && matchedWallet.id),
      rdns: options.walletRdns || (matchedWallet && matchedWallet.rdns),
      name: walletName || options.walletName || (matchedWallet && matchedWallet.name),
    };

    window.localStorage.setItem(LAST_INJECTED_WALLET_KEY, JSON.stringify(preference));
  } catch (error) {}
}

function getLastInjectedWallet(): InjectedWalletPreference | null {
  try {
    const preference = window.localStorage.getItem(LAST_INJECTED_WALLET_KEY);
    return preference ? JSON.parse(preference) : null;
  } catch (error) {
    return null;
  }
}

function clearLastInjectedWallet() {
  try {
    window.localStorage.removeItem(LAST_INJECTED_WALLET_KEY);
  } catch (error) {}
}

function findPreferredInjectedWallet(
  wallets: InstalledWallet[],
  preference: InjectedWalletPreference | null,
): InstalledWallet | null {
  if (!preference) {
    return null;
  }

  return (
    wallets.find((wallet) => preference.id && wallet.id === preference.id) ||
    wallets.find((wallet) => preference.rdns && wallet.rdns === preference.rdns) ||
    wallets.find((wallet) => preference.name && wallet.name === preference.name) ||
    null
  );
}

async function waitForPreferredInjectedWallet(
  preference: InjectedWalletPreference | null,
): Promise<InstalledWallet | null> {
  if (!preference) {
    return null;
  }

  listenForEip6963Providers();

  for (const delay of [0, 100, 300, 750, 1500]) {
    if (delay) {
      await wait(delay);
    }

    requestEip6963Providers();

    const wallet = findPreferredInjectedWallet(getInstalledWalletsSnapshot(), preference);
    if (wallet) {
      return wallet;
    }
  }

  return null;
}

async function connectInjected(options: ConnectWalletOptions = {}): Promise<ConnectedWallet> {
  let provider: Eip1193Provider;
  let walletName: string | null = options.walletName || null;

  if (options.provider) {
    provider = options.provider;
  } else if (!(window as any).ethereum && !(window as any).onto) {
    const installedWallets = await discoverInstalledWallets();
    const selected = installedWallets[0];
    if (!selected) {
      throw new Error('No browser wallet provider found');
    }

    provider = selected.provider;
    walletName = selected.name;
  } else {
    provider = await web3Modal.connect();
  }

  const accounts = await readAccounts(provider);
  const chainId = await readChainId(provider);

  setLastProvider('injected');
  setLastInjectedWallet(options, provider, walletName);

  return {
    provider,
    address: accounts[0] || null,
    chainId,
    providerType: 'injected',
    walletName: walletName || getInjectedWalletName(provider),
    isWalletConnect: false,
  };
}

async function restoreInjected(targetChainId?: number): Promise<ConnectedWallet | null> {
  if (getLastProvider() !== 'injected') {
    return null;
  }

  const selected = await waitForPreferredInjectedWallet(getLastInjectedWallet());

  if (!selected) {
    if (web3Modal.cachedProvider) {
      return connectInjected();
    }

    return null;
  }

  const accounts = await readAuthorizedAccounts(selected.provider);

  if (!accounts.length) {
    return null;
  }

  const chainId = await ensureProviderNetwork(selected.provider, targetChainId);

  setLastProvider('injected');
  setLastInjectedWallet(
    { walletId: selected.id, walletRdns: selected.rdns, walletName: selected.name },
    selected.provider,
    selected.name,
  );

  return {
    provider: selected.provider,
    address: accounts[0] || null,
    chainId,
    providerType: 'injected',
    walletName: selected.name,
    isWalletConnect: false,
  };
}

async function connectReown(targetChainId?: number): Promise<ConnectedWallet> {
  const appKit = getReownAppKit(targetChainId);

  await appKit.open({ view: 'Connect', namespace: 'eip155' });

  const session: any = await waitForReownConnection(appKit);
  const account = session.account;
  const provider = session.provider as Eip1193Provider;

  if (!provider) {
    throw new Error('Reown wallet provider was not available after connection');
  }

  try {
    await appKit.close();
  } catch (error) {}

  const providerChainId = await waitForResolvedReownChainId(appKit, provider);

  if (!providerChainId) {
    throw new Error('Wallet network could not be verified');
  }

  setLastProvider('reown');

  return {
    provider,
    address: account.address || null,
    chainId: providerChainId,
    providerType: 'reown',
    walletName: getReownWalletName(appKit),
    isWalletConnect: isReownWalletConnect(appKit),
  };
}

async function restoreReown(targetChainId?: number): Promise<ConnectedWallet | null> {
  const lastProvider = getLastProvider();

  if (lastProvider !== 'reown' && lastProvider !== 'walletconnect') {
    return null;
  }

  const appKit = getReownAppKit(targetChainId);
  const session = await waitForReownRestoredConnection(appKit);

  if (!session) {
    return null;
  }

  const { account, provider } = session;

  let chainId = await waitForResolvedReownChainId(appKit, provider);

  if (!chainId) {
    return null;
  }

  if (targetChainId && chainId !== targetChainId) {
    chainId = await switchReownProviderNetwork(provider, targetChainId);
  }

  return {
    provider,
    address: account.address || null,
    chainId,
    providerType: 'reown',
    walletName: getReownWalletName(appKit),
    isWalletConnect: isReownWalletConnect(appKit),
  };
}

export const walletConnection = {
  async connect(options: ConnectWalletOptions = {}): Promise<ConnectedWallet> {
    const providerType =
      options.providerType || ((window as any).ethereum || (window as any).onto ? 'injected' : 'reown');

    if (providerType === 'reown' || providerType === 'walletconnect') {
      return connectReown(options.targetChainId);
    }

    return connectInjected(options);
  },

  async restore(options: ConnectWalletOptions = {}): Promise<ConnectedWallet | null> {
    const reownWallet = await restoreReown(options.targetChainId);

    if (reownWallet) {
      return reownWallet;
    }

    const injectedWallet = await restoreInjected(options.targetChainId);

    if (injectedWallet) {
      return injectedWallet;
    }

    return null;
  },

  async disconnect(): Promise<void> {
    try {
      await disconnectReownAppKit();
    } catch (error) {}

    web3Modal.clearCachedProvider();
    setLastProvider(null);
    clearLastInjectedWallet();
  },

  clearCachedProvider(): void {
    web3Modal.clearCachedProvider();
    setLastProvider(null);
    clearLastInjectedWallet();
  },

  hasBrowserWallet(): boolean {
    return getInstalledWalletsSnapshot().length > 0 || getLegacyInjectedProviders().length > 0;
  },

  async switchNetwork(
    provider: Eip1193Provider,
    targetChainId: number,
    providerType?: WalletProviderType,
  ): Promise<void> {
    if (providerType === 'reown' && isReownAppKitReady()) {
      await switchReownProviderNetwork(provider, targetChainId);
      return;
    }

    if (!provider || !provider.request) {
      throw new Error('Connected wallet does not support network switching');
    }

    await ensureProviderNetwork(provider, targetChainId);
  },

  discoverInstalledWallets,

  subscribeInstalledWallets,
};

export * from './types';
