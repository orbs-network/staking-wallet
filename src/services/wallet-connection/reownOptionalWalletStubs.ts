export class CoinbaseWalletSDK {
  makeWeb3Provider() {
    return null;
  }
}

export function createBaseAccountSDK() {
  return {
    getProvider: () => null,
  };
}

export class SafeAppProvider {
  connect() {
    return Promise.resolve();
  }

  request() {
    return Promise.resolve([]);
  }
}

export default class SafeAppsSDK {
  safe = {
    getInfo: () => Promise.reject(new Error('Safe connector is disabled in this build')),
  };
}
