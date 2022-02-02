import React from 'react';
import { Typography } from '@material-ui/core';
import { HtmlTooltip } from '../../../base/HtmlTooltip';

interface IProps {
  guardianDelegatorCut: number;
  translation: any;
}

function RewardPercentage({ translation, guardianDelegatorCut }: IProps) {
  const hasData = guardianDelegatorCut != undefined;

  const percentageText = hasData ? `${guardianDelegatorCut.toFixed(0)}%` : '-';
  return (
    <HtmlTooltip
      arrow
      title={
        <>
          <Typography>
            {translation('message_guardianGivesXPercentageToDelegators', {
              percentage: percentageText,
            })}
          </Typography>
        </>
      }
    >
      <Typography>{percentageText}</Typography>
    </HtmlTooltip>
  );
}

export default RewardPercentage;
