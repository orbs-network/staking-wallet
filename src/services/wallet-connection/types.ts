export type WalletProviderType = 'injected' | 'walletconnect' | 'reown';

export type Eip1193Provider = {
  request?: (args: { method: string; params?: any[] }) => Promise<any>;
  enable?: () => Promise<string[]>;
  connect?: (options?: any) => Promise<any>;
  on?: (eventName: string, callback: (...args: any[]) => void) => void;
  off?: (eventName: string, callback: (...args: any[]) => void) => void;
  removeListener?: (eventName: string, callback: (...args: any[]) => void) => void;
  disconnect?: () => Promise<void>;
  setDefaultChain?: (chainId: string, rpcUrl?: string) => void | Promise<void>;
  accounts?: string[];
  chainId?: string | number;
  session?: any;
  isMetaMask?: boolean;
  isTrust?: boolean;
  isImToken?: boolean;
  isRabby?: boolean;
  isEnkrypt?: boolean;
  isBraveWallet?: boolean;
  isCoinbaseWallet?: boolean;
  isWalletConnect?: boolean;
  providers?: Eip1193Provider[];
};

export type InstalledWallet = {
  id: string;
  name: string;
  icon?: string;
  provider: Eip1193Provider;
  rdns?: string;
};

export type ConnectedWallet = {
  provider: Eip1193Provider;
  address: string | null;
  chainId: number | null;
  providerType: WalletProviderType;
  walletName: string;
  isWalletConnect: boolean;
};

export type ConnectWalletOptions = {
  providerType?: WalletProviderType;
  targetChainId?: number;
  provider?: Eip1193Provider;
  walletName?: string;
  walletId?: string;
  walletRdns?: string;
};
