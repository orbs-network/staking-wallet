import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import { handleNumberAsStringToDisplay } from '../../../utils/numberUtils';
import constants from '../../../constants/constants';

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
      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>
        {handleNumberAsStringToDisplay(stakedOrbs, constants.numbersDecimalToDisplayLimit, true)}
      </Typography>
      <br />
      <Typography color={'secondary'} style={{ display: 'inline', fontWeight: 'bold' }}>
        {`${pendingRewardsTitle} `}
      </Typography>
      <Typography style={{ display: 'inline', fontWeight: 'bold' }}>
        {handleNumberAsStringToDisplay(rewardsBalance, constants.numbersDecimalToDisplayLimit, true)}
      </Typography>
    </>
  );
};

export default BalaceTooltip;
