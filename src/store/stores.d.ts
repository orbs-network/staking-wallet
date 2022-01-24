import { OrbsElectionsStore } from './OrbsElectionsStore';
import { CryptoWalletConnectionStore } from './CryptoWalletConnectionStore';
import { OrbsAccountStore } from './OrbsStore';
import { OrbsNodeStore } from './OrbsNodeStore';

interface IStores {
  cryptoWalletIntegrationStore: CryptoWalletConnectionStore;
  orbsAccountStore: OrbsAccountStore;
  orbsNodeStore: OrbsNodeStore;
}
