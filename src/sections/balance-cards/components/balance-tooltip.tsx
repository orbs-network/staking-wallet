import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';

interface IProps {
  stakeTitle: string;
  stakedOrbs: string;
  rewardsBalance: string;
  pendingRewardsTitle: string;
}

const BalaceTooltip: FC<IProps> = ({ stakeTitle, stakedOrbs, rewardsBalance, pendingRewardsTitle }) => {
  return (
    <>
      <Typography color={'secondary'} style={{ display: 'inline', fontWeight: 'bold' }}>
        {`${stakeTitle} `}
      </Typography>
      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>{stakedOrbs}</Typography>
      <br />
      <Typography color={'secondary'} style={{ display: 'inline', fontWeight: 'bold' }}>
        {`${pendingRewardsTitle} `}
      </Typography>
      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>{rewardsBalance}</Typography>
    </>
  );
};

export default BalaceTooltip;
