import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
  stakeTitle: string;
  stakedOrbs: string;
  rewardsBalance: string;
  pendingRewardsTitle: string;
}
const BalaceTooltip: FC<IProps> = ({ stakeTitle, stakedOrbs, rewardsBalance, pendingRewardsTitle }) => {
  const theme = useTheme()
  return (
    <>
      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>
        {`${stakeTitle} `}
      </Typography>
      <Typography style={{ display: 'inline', fontWeight: 'bold', color: theme.palette.secondary.main }}>{stakedOrbs}</Typography>
      <br />
      <Typography style={{ display: 'inline', fontWeight: 'bold'}}>
        {`${pendingRewardsTitle} `}
      </Typography>
      <Typography style={{ display: 'inline', fontWeight: 'bold', color: theme.palette.secondary.main }}>{rewardsBalance}</Typography>
    </>
  );
};

export default BalaceTooltip;
