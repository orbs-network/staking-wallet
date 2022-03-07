import AddressLoader from './address-loader';
import GuardiansLoader from './guardians-section-loader';
import BalanceCardLoader from './balance-card-loader';
import BaseLoader from '../loader-components/base-loader';
import BalanceCardLoaderSmaller from '../loader-components/balance-card-loader-smaller'
import SpinnerLoader from './spinner';
const Loaders = {
  Address: AddressLoader,
  GuardiansSection: GuardiansLoader,
  BalanceCard: BalanceCardLoader,
  Base: BaseLoader,
  Spinner: SpinnerLoader,
  BalanceCardSmaller: BalanceCardLoaderSmaller
};

export default Loaders;
