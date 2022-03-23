import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';
import { HtmlTooltip } from '../../../base/HtmlTooltip';
import { getStrokeColor, getStrokePercent } from './utils';
import useTheme from '@material-ui/core/styles/useTheme';
import Stroke from '../../components/Stroke';

interface IProps {
  translation: any;
  percentage: number;
  chain: number;
  isSelectedChain: boolean;
}

function Participation({ translation, percentage, chain, isSelectedChain }: IProps) {
  const theme = useTheme();
  const timePercentageText = percentage.toFixed(0);
  const strokeColor = getStrokeColor(percentage, theme, chain, isSelectedChain);
  return (
    <HtmlTooltip
      arrow
      title={
        <>
          <Typography>
            {translation('message_participationExplanation', {
              daysPeriod: 30,
              timePercentage: timePercentageText,
            })}
          </Typography>
          <br />
          <Typography>{translation('message_participationRewardsWarning')}</Typography>
        </>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Stroke style={{ flex: 1, marginRight: 10 }} percent={getStrokePercent(percentage)} color={strokeColor} />
        <Typography>{timePercentageText}%</Typography>
      </div>
    </HtmlTooltip>
  );
}

export default Participation;
