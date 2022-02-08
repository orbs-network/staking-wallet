import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';
import { HtmlTooltip } from '../../../base/HtmlTooltip';

interface IProps {
  translation: any;
  percentage: number;
}

function Participation({ translation, percentage }: IProps) {
  const timePercentageText = percentage.toFixed(0);

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
          <Line percent={percentage} strokeWidth={8} strokeColor='white' />
        </section>
        <Typography>{timePercentageText}%</Typography>
      </div>
    </HtmlTooltip>
  );
}

export default Participation;
