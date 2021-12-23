import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';

interface IProps {
  translation: any;
  percentage: number;
}

function Participation({ translation, percentage }: IProps) {
  const color = percentage <= 30 ? 'red' : percentage <= 80 ? 'yellow' : 'green';
  const timePercentageText = percentage.toFixed(2);

  return (
    <Tooltip
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
      <div>
        <Line percent={percentage} strokeWidth={5} strokeColor={color} />
        <Typography>{timePercentageText}%</Typography>
      </div>
    </Tooltip>
  );
}

export default Participation;
