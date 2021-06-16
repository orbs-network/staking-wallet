import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';
import { IMobileSection } from '../../interfaces';
import { useCommonStyles } from './styles';
import { getCapacityColor, getCapacityText } from '../../util';

const Capacity: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  const { Capacity } = guardian;

  const commonClasses = useCommonStyles();

  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{guardiansTableTranslations('columnHeader_capacity')}</Typography>
      </div>

      <div className={commonClasses.rowContent}>
        <Line
          percent={Capacity}
          strokeWidth={2}
          strokeLinecap='square'
          trailColor='transparent'
          strokeColor={getCapacityColor(Capacity)}
          className={commonClasses.line}
        />
        <Typography className={commonClasses.lineText}>{getCapacityText(Capacity, 0)}</Typography>
      </div>
    </div>
  );
};

export default Capacity;
