import React from 'react';
import { Typography } from '@material-ui/core';
import {  getCapacityText } from '../../util';
import { HtmlTooltip } from '../../../base/HtmlTooltip';
import { getStrokeColor, getStrokePercent } from './utils';
import useTheme from '@material-ui/core/styles/useTheme';
import Stroke from '../../components/Stroke';
interface IProps {
  translation: any;
  selfStake: number;
  delegatedStake: number;
  capacity: number;
  chain: number;
  isSelectedChain: boolean;
}

function Capacity({ translation, selfStake, delegatedStake, capacity, chain, isSelectedChain }: IProps) {
  const theme = useTheme();
  const selfStakePercentage = +((selfStake / delegatedStake) * 100).toFixed(2);
  const availableCapacity = 100 - capacity;

  const strokeColor = getStrokeColor(availableCapacity, theme, chain, isSelectedChain);
  return (
    <HtmlTooltip
      arrow
      title={
        <>
          <Typography>
            {translation('message_selfStake')}: {translation('xOrbs', { amount: selfStake?.toLocaleString() })} {'  '}(
            {selfStakePercentage ? selfStakePercentage.toLocaleString() :  '0'}%)
          </Typography>
          <Typography>
            {translation('message_delegatedStake')}:{' '}
            {translation('xOrbs', { amount: delegatedStake?.toLocaleString() })}
          </Typography>
        </>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stroke style={{ flex: 1, marginRight: 10 }} percent={getStrokePercent(availableCapacity)} color={strokeColor} />
        <Typography>{availableCapacity > 100 ? `100%` : getCapacityText(availableCapacity, 0)}</Typography>
      </div>
    </HtmlTooltip>
  );
}

export default Capacity;
