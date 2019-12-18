import React from 'react';
import { observer } from 'mobx-react';
import { WalletPageWrapper } from './WalletPageWrapper';
import { SectionHeader } from '../components/structure/SectionHeader';
import SecurityIcon from '@material-ui/icons/Security';
import StarIcon from '@material-ui/icons/Star';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

export const MainAppPage = observer(() => {
  return (
    <>
      <WalletPageWrapper />

      {/* Balance */}
      <SectionHeader title={'BALANCE'} icon={AccountBalanceIcon} />

      {/* Rewards */}
      <SectionHeader title={'REWARDS'} icon={StarIcon} />

      {/* Guardians */}
      <SectionHeader title={'ALL GUARDIANS'} icon={SecurityIcon} />
    </>
  );
});
