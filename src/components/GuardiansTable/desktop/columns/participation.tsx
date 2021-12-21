import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { Line } from 'rc-progress';
import { IGroupedGuardian } from '../../interfaces';

const getParticipationColumn = (guardiansTableTranslations: any) => {
  return {
    title: (
      <ColumnHeaderWithTooltip
        headerText={guardiansTableTranslations('columnHeader_participation')}
        tooltipText={guardiansTableTranslations('columnHeaderInfo_participation')}
      />
    ),
    field: 'ParticipationPercentage',
    render: (rowData) => {
      const { ParticipationPercentage } = rowData.guardian;
      // TODO : ORL : Make this color gradient
      const color = ParticipationPercentage <= 30 ? 'red' : ParticipationPercentage <= 80 ? 'yellow' : 'green';
      const timePercentageText = ParticipationPercentage.toFixed(2);

      return (
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
      );
    },
    cellStyle: {
      textAlign: 'center' as const,
    },
    defaultSort: 'desc' as const,
  };
};
export default getParticipationColumn;
