import { GuardiansStore, TGuardiansStore } from './GuardiansStore';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { OrbsAccountStore } from './OrbsStore';

interface IStores {
  guardiansStore: GuardiansStore;
  cryptoWalletIntegrationStore: CryptoWalletConnectionStore;
  orbsAccountStore: OrbsAccountStore;
}
