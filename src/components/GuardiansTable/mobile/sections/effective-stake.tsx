import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { IMobileSection } from '../../interfaces';
import { useCommonStyles } from './styles';
import { getEffectiveStakeInUnits } from '../../util';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';

interface IProps {
  translation: any;
  guardian: Guardian | null;
}

const EffectiveStakeSection = ({ guardian, translation }: IProps) => {
  const commonClasses = useCommonStyles();

  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('columnHeader_effectiveStake')}</Typography>
      </div>

      <Typography className={commonClasses.rowContent}>
        {guardian ? getEffectiveStakeInUnits(guardian.EffectiveStake) : '-'}
      </Typography>
    </div>
  );
};

export default EffectiveStakeSection;
