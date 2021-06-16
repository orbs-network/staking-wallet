import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { IMobileSection } from '../../interfaces';
import { useCommonStyles } from './styles';
import { getEffectiveStakeInUnits } from '../../util';

const EffectiveStakeSection: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  const { EffectiveStake } = guardian;
  const commonClasses = useCommonStyles();

  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{guardiansTableTranslations('columnHeader_effectiveStake')}</Typography>
      </div>

      <Typography className={commonClasses.rowContent}>{getEffectiveStakeInUnits(EffectiveStake)}</Typography>
    </div>
  );
};

export default EffectiveStakeSection;
