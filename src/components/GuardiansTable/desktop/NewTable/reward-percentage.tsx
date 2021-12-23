import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';

interface IProps {
  guardianDelegatorCut: number;
  translation: any;
}

function RewardPercentage({ translation, guardianDelegatorCut }: IProps) {
  const hasData = guardianDelegatorCut != undefined;

  const percentageText = hasData ? `${guardianDelegatorCut}%` : '-';
  return (
    <Tooltip
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
    </Tooltip>
  );
}

export default RewardPercentage;
