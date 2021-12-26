import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';
import { useCommonStyles } from './styles';
import { getCapacityColor, getCapacityText } from '../../util';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';

interface IProps {
  translation: any;
  guardian: Guardian | null;
}

const Capacity = ({ guardian, translation }: IProps) => {
  const commonClasses = useCommonStyles();

  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('columnHeader_capacity')}</Typography>
      </div>

      <div className={commonClasses.rowContent}>
        {guardian ? (
          <>
            <Line
              percent={guardian.Capacity}
              strokeWidth={2}
              strokeLinecap='square'
              trailColor='transparent'
              strokeColor={getCapacityColor(guardian.Capacity)}
              className={commonClasses.line}
            />
            <Typography className={commonClasses.lineText}>
              {guardian ? getCapacityText(guardian.Capacity > 100 ? 100 : guardian.Capacity, 0) : '-'}
            </Typography>
          </>
        ) : (
          <Typography>-</Typography>
        )}
      </div>
    </div>
  );
};

export default Capacity;
