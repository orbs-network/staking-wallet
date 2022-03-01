import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Line } from 'rc-progress';
import { getCapacityColor, getCapacityText } from '../../util';
import { HtmlTooltip } from '../../../base/HtmlTooltip';
import { getStrokeColor, getStrokePerent } from './utils';

interface IProps {
  translation: any;
  selfStake: number;
  delegatedStake: number;
  capacity: number;
}

function Capacity({ translation, selfStake, delegatedStake, capacity }: IProps) {
  const selfStakePercentage = +((selfStake / delegatedStake) * 100).toFixed(2);
  const availableCapacity = 100 - capacity;

  const color = getStrokeColor(availableCapacity);
  return (
    <HtmlTooltip
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <section style={{ width: 'calc(100% - 50px)' }}>
          <Line percent={getStrokePerent(availableCapacity)} strokeWidth={8} strokeColor={color} />
        </section>
        <Typography style={{ color: color }}>
          {availableCapacity > 100 ? `100%` : getCapacityText(availableCapacity, 0)}
        </Typography>
      </div>
    </HtmlTooltip>
  );
}

export default Capacity;
