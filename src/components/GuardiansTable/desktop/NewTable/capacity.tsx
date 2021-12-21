import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Line } from 'rc-progress';
import { getCapacityColor, getCapacityText } from '../../util';
import { IGroupedGuardian } from '../../interfaces';

interface IProps {
  translation: any;
  selfStake: number;
  delegatedStake: number;
  capacity: number;
}

function Capacity({ translation, selfStake, delegatedStake, capacity }: IProps) {
  const selfStakePercentage = +((selfStake / delegatedStake) * 100).toFixed(2);
  return (
    <Tooltip
      arrow
      title={
        <>
          <Typography>
            {translation('message_selfStake')}: {translation('xOrbs', { amount: selfStake?.toLocaleString() })} {'  '}(
            {selfStakePercentage?.toLocaleString()}%)
          </Typography>
          <Typography>
            {translation('message_delegatedStake')}:{' '}
            {translation('xOrbs', { amount: delegatedStake?.toLocaleString() })}
          </Typography>
        </>
      }
    >
      <div>
        <Line percent={capacity} strokeWidth={5} strokeColor={getCapacityColor(Capacity)} />
        <Typography>{getCapacityText(capacity, 2)}</Typography>
      </div>
    </Tooltip>
  );
}

export default Capacity;
