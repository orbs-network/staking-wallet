import { TGuardiansStore } from './GuardiansStore';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { OrbsAccountStore } from './OrbsStore';

interface IStores {
  guardiansStore: TGuardiansStore;
  cryptoWalletIntegrationStore: CryptoWalletConnectionStore;
  orbsAccountStore: OrbsAccountStore;
}
