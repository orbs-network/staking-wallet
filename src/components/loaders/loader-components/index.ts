import AddressLoader from './address-loader';
import GuardiansLoader from './guardians-section-loader';
import BalanceCardLoader from './balance-card-loader';
import BaseLoader from '../loader-components/base-loader';
import SpinnerLoader from './spinner';
const Loaders = {
  Address: AddressLoader,
  GuardiansSection: GuardiansLoader,
  BalanceCard: BalanceCardLoader,
  Base: BaseLoader,
  Spinner: SpinnerLoader,
};

export default Loaders;
