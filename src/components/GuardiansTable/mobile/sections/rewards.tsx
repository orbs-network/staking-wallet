import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { useCommonStyles } from './styles';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';

interface IProps {
  guardiansToDelegatorsCut: { [guardianAddress: string]: number };
  guardian: Guardian | null;
  translation: any;
}

const Rewards = ({ guardian, guardiansToDelegatorsCut, translation }: IProps) => {
  const commonClasses = useCommonStyles();
  const hasData = guardian && guardiansToDelegatorsCut[guardian.EthAddress] != undefined;

  const percentageText = hasData ? `${guardiansToDelegatorsCut[guardian.EthAddress]}%` : '-';
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('rewards_percentage')}</Typography>
      </div>

      <Typography className={commonClasses.rowContent}>{percentageText}</Typography>
    </div>
  );
};

export default Rewards;
