import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { IMobileSection } from '../../interfaces';
import { useCommonStyles } from './styles';

interface IProps extends IMobileSection {
  guardiansToDelegatorsCut: { [guardianAddress: string]: number };
}

const Rewards: FC<IProps> = ({ guardian, guardiansToDelegatorsCut, guardiansTableTranslations }) => {
  const { EthAddress } = guardian;
  const commonClasses = useCommonStyles();
  const hasData = guardiansToDelegatorsCut[EthAddress] != undefined;

  const percentageText = hasData ? `${guardiansToDelegatorsCut[EthAddress]}%` : '--';
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{guardiansTableTranslations('rewards_percentage')}</Typography>
      </div>

      <Typography className={commonClasses.rowContent}>{percentageText}</Typography>
    </div>
  );
};

export default Rewards;
