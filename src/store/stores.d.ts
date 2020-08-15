import { GuardiansStore, TGuardiansStore } from './GuardiansStore';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { OrbsAccountStore } from './OrbsStore';
import { OrbsNodeStore } from './OrbsNodeStore';

interface IStores {
  guardiansStore: GuardiansStore;
  cryptoWalletIntegrationStore: CryptoWalletConnectionStore;
  orbsAccountStore: OrbsAccountStore;
  orbsNodeStore: OrbsNodeStore;
}
