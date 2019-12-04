/* eslint-disable */
import { EventEmitter } from 'events';

export type TNetworkVersion = '1' | '2' | '3' | '4' | '5' | '42';

// NOTE : Interface signature from 'https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md'
// Implementation for 'Metamask ethereum provider' : https://github.com/MetaMask/metamask-mobile/blob/master/app/core/InpageBridge.js

const ACCOUNTS_CHANGED = 'accountsChanged';

export interface IEthereumProvider {
  // Deprecatable members
  /**
   * @deprecated
   */
  enable(): Promise<void>;
  /**
   * @deprecated
   */
  selectedAddress: string;
  /**
   * @deprecated
   */
  networkVersion: TNetworkVersion;

  // Standard members
  send(method: string, params?: Array<any>): Promise<any>;
  // on(action: string, listener: (networkId: string) => void): IEthereumProvider;

  // All notifications
  on(action: 'notification', listener: (result: any) => void): this;

  // Event Emitter
  on(action: 'connect', listener: () => void): this;
  on(action: 'close', listener: (code: number, reason: string) => void): this;
  off(action: 'connect', listener: () => void): this;
  off(action: 'close', listener: (code: number, reason: string) => void): this;

  // Ethereum connection
  on(action: 'eth_requestAccounts', listener: (networkId: number) => void): this;
  on(action: 'chainChanged', listener: (chainId: string) => void): this;
  on(action: 'networkChanged', listener: (networkId: string) => void): this;
  on(action: 'accountsChanged', listener: (networkId: string) => void): this;

  off(action: 'eth_requestAccounts', listener: (networkId: number) => void): this;
  off(action: 'chainChanged', listener: (chainId: string) => void): this;
  off(action: 'networkChanged', listener: (chainId: string) => void): this;
  off(action: 'accountsChanged', listener: (accounts: Array<string>) => void): this;
}
