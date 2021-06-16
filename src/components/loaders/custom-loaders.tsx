import React from 'react';
import AddressLoader from './address-loader';
import GuardiansSectionLoader from './guardians-section-loader';
import BalanceCardLoader from './balance-card-loader';

interface ICustomLoaders {
  [key: string]: JSX.Element;
}

const customLoaders: ICustomLoaders = {
  address: <AddressLoader />,
  guardiansSection: <GuardiansSectionLoader />,
  balanceCard: <BalanceCardLoader />,
};

export default customLoaders;
