import React, { FC } from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';
import { IMobileSection } from '../../interfaces';

const Participation: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  const { ParticipationPercentage } = guardian;
  // TODO : ORL : Make this color gradient
  const color = ParticipationPercentage <= 30 ? 'red' : ParticipationPercentage <= 80 ? 'yellow' : 'green';
  const timePercentageText = ParticipationPercentage.toFixed(2);
  return (
    <div>
      <Typography>
        <ColumnHeaderWithTooltip
          headerText={guardiansTableTranslations('columnHeader_participation')}
          tooltipText={guardiansTableTranslations('columnHeaderInfo_participation')}
        />
      </Typography>
      <Tooltip
        arrow
        title={
          <>
            <Typography>
              {guardiansTableTranslations('message_participationExplanation', {
                daysPeriod: 30,
                timePercentage: timePercentageText,
              })}
            </Typography>
            <br />
            <Typography>{guardiansTableTranslations('message_participationRewardsWarning')}</Typography>
          </>
        }
      >
        <div>
          <Line percent={ParticipationPercentage} strokeWidth={5} strokeColor={color} />
          <Typography>{timePercentageText}%</Typography>
        </div>
      </Tooltip>
    </div>
  );
};
export default Participation;
