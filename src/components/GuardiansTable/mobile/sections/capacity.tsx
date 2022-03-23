import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';
import { useCommonStyles } from './styles';
import { getCapacityColor, getCapacityText } from '../../util';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { getStrokeColor } from '../../desktop/NewTable/utils';
import Stroke from '../../components/Stroke';
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
  translation: any;
  guardian: Guardian | null;
  chain: number;
  isSelectedChain: boolean;
}

const Capacity = ({ guardian, translation, isSelectedChain, chain }: IProps) => {
  const theme = useTheme();
  const commonClasses = useCommonStyles();
  const availableCapacity = guardian ? 100 - guardian.Capacity : 0;
  const strokeColor = getStrokeColor(availableCapacity, theme, chain, isSelectedChain);
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('columnHeader_capacity')}</Typography>
      </div>

      <div className={commonClasses.rowContent}>
        {guardian ? (
          <>
            <Stroke color={strokeColor} percent={availableCapacity} style={{ flex: 1, marginRight: 10 }} />
            <Typography className={commonClasses.lineText}>
              {availableCapacity > 100 ? `100%` : getCapacityText(availableCapacity, 0)}
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
