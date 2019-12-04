import { IEthereumProvider, TNetworkVersion } from '../../services/ethereumTxService/IEthereumProvider';

export class EthereumProviderMock implements IEthereumProvider {
  private shouldApproveFutureEnable = true;

  public selectedAddress: string = null;
  public networkVersion: TNetworkVersion = '1';

  private events = {};

  async enable(): Promise<void> {
    if (this.shouldApproveFutureEnable) {
      this.selectedAddress = 'DUMMY_ADDRESS';
    } else {
      this.selectedAddress = null;
      throw new Error('User rejected');
    }
  }

  public rejectNextEnable(): void {
    this.shouldApproveFutureEnable = false;
  }

  public acceptNextEnable(): void {
    this.shouldApproveFutureEnable = true;
  }

  public setSelectedAddress(selectedAddress): void {
    this.selectedAddress = selectedAddress;
  }

  off(
    action: 'connect' | 'close' | 'eth_requestAccounts' | 'chainChanged' | 'networkChanged' | 'accountsChanged',
    listener:
      | (() => void)
      | ((code: number, reason: string) => void)
      | ((networkId: number) => void)
      | ((chainId: string) => void)
      | ((accounts: Array<string>) => void),
  ): this {
    if (!Array.isArray(this.events[action])) return;
    this.events[action].forEach((cachedListener, i) => {
      if (cachedListener === listener) {
        this.events[action].splice(i, 1);
      }
    });
  }

  on(
    action:
      | 'notification'
      | 'connect'
      | 'close'
      | 'eth_requestAccounts'
      | 'chainChanged'
      | 'networkChanged'
      | 'accountsChanged',
    listener:
      | ((result: any) => void)
      | (() => void)
      | ((code: number, reason: string) => void)
      | ((networkId: number) => void)
      | ((chainId: string) => void),
  ): this {
    if (!Array.isArray(this.events[action])) {
      this.events[action] = [];
    }

    this.events[action].push(listener);

    return this;
  }

  send(method: string, params?: Array<any>): Promise<any> {
    return undefined;
  }

  /**
   * Allows us to manually trigger an event (and so, call any existing listeners)
   * NOTE : So far this is not protected with Typescript, we can add it if we find it necessary.
   */
  initiateEvent(action: string, ...args) {
    if (!Array.isArray(this.events[action])) return;
    this.events[action].forEach(listener => {
      listener(...args);
    });
  }
}
