import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';

interface IProps {
  stakedOrbs: number;
  balance: string;
  stakedOrbsText: string;
  pendingRewardsText: string;
}

const BalanceCardTooltip: FC<IProps> = ({ stakedOrbs, balance, stakedOrbsText, pendingRewardsText }) => {
  return (
    <>
      <Typography color={'secondary'} style={{ display: 'inline', fontWeight: 'bold' }}>
        {stakedOrbsText}
      </Typography>
      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>{stakedOrbs}</Typography>
      <br />
      <Typography color={'secondary'} style={{ display: 'inline', fontWeight: 'bold' }}>
        {pendingRewardsText}
      </Typography>
      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>{balance}</Typography>
    </>
  );
};

export default BalanceCardTooltip;
