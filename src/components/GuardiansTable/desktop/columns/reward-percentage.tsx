import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { IGroupedGuardian } from '../../interfaces';

const getRewardPercentageColumn = (
  guardiansToDelegatorsCut: { [guardianAddress: string]: number },
  guardiansTableTranslations: any,
) => {
  return {
    title: (
      <ColumnHeaderWithTooltip
        headerText={guardiansTableTranslations('columnHeader_rewardsPercentageToDelegators')}
        tooltipText={guardiansTableTranslations('columnHeaderInfo_rewardsPercentageToDelegators', {
          minPercentage: 0,
          maxPercentage: 66.667,
        })}
      />
    ),
    field: '',
    render: (rowData) => {
      const { EthAddress } = rowData.guardian;
      const hasData = guardiansToDelegatorsCut[EthAddress] != undefined;

      const percentageText = hasData ? `${guardiansToDelegatorsCut[EthAddress]}%` : '--';

      return (
        <Tooltip
          arrow
          title={
            <>
              <Typography>
                {guardiansTableTranslations('message_guardianGivesXPercentageToDelegators', {
                  percentage: percentageText,
                })}
              </Typography>
            </>
          }
        >
          <Typography>{percentageText}</Typography>
        </Tooltip>
      );
    },
    cellStyle: {
      textAlign: 'center' as const,
    },
    customSort: (data1, data2) => {
      // DEV_NOTE : This is quick, might cause 'un-deterministic' sort, but it's acceptable
      const delegatorsCut1 = guardiansToDelegatorsCut[data1.EthAddress] || 0;
      const delegatorsCut2 = guardiansToDelegatorsCut[data2.EthAddress] || 0;

      return delegatorsCut2 - delegatorsCut1;
    },
    defaultSort: 'desc' as const,
  };
};

export default getRewardPercentageColumn;
