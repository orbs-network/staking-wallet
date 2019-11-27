import { TGuardiansStore } from './GuardiansStore';
import { CryptoWalletIntegrationStore } from './CryptoWalletIntegrationStore';
import { OrbsAccountStore } from './OrbsStore';

interface IStores {
  guardiansStore: TGuardiansStore;
  cryptoWalletIntegrationStore: CryptoWalletIntegrationStore;
  orbsAccountStore: OrbsAccountStore;
}
