import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';
import { HtmlTooltip } from '../../../base/HtmlTooltip';
import { getStrokeColor, getStrokePerent } from './utils';

interface IProps {
  translation: any;
  percentage: number;
}

function Participation({ translation, percentage }: IProps) {
  const timePercentageText = percentage.toFixed(0);
  const color = getStrokeColor(percentage);
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
        <section style={{ width: 'calc(100% - 50px)' }}>
          <Line percent={getStrokePerent(percentage)} strokeWidth={7} strokeColor={color} />
        </section>
        <Typography style={{ color: color }}>{timePercentageText}%</Typography>
      </div>
    </HtmlTooltip>
  );
}

export default Participation;
