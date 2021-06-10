import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Line } from 'rc-progress';

const getCapacityTable = (guardiansTableTranslations: any) => {
  return {
    title: (
      <ColumnHeaderWithTooltip
        headerText={guardiansTableTranslations('columnHeader_capacity')}
        tooltipText={[
          guardiansTableTranslations('columnHeaderInfo_capacity_explanation'),
          guardiansTableTranslations('columnHeaderInfo_capacity_calculation'),
          [
            guardiansTableTranslations('columnHeaderInfo_capacity_note_title'),
            guardiansTableTranslations('columnHeaderInfo_capacity_note_content'),
          ],
        ]}
      />
    ),
    field: 'SelfStake',
    render: (guardian) => {
      const { Capacity, SelfStake, DelegatedStake } = guardian;
      // TODO : ORL : Make this color gradient
      const color = Capacity <= 30 ? 'green' : Capacity <= 80 ? 'yellow' : 'red';
      // const
      const selfStakePercentage = +((SelfStake / DelegatedStake) * 100).toFixed(2);
      // const selfStakePercentageText =

      const capacityText = !isNaN(Capacity) ? `${Capacity.toFixed(2)}%` : '--';

      // console.log(`${guardian.Name} capacity : ${Capacity}`);
      // console.log(`${guardian.Name} capacity : ${SelfStake} - ${DelegatedStake}`);

      return (
        <Tooltip
          arrow
          title={
            <>
              <Typography>
                {guardiansTableTranslations('message_selfStake')}:{' '}
                {guardiansTableTranslations('xOrbs', { amount: SelfStake?.toLocaleString() })} {'  '}(
                {selfStakePercentage?.toLocaleString()}%)
              </Typography>
              <Typography>
                {guardiansTableTranslations('message_delegatedStake')}:{' '}
                {guardiansTableTranslations('xOrbs', { amount: DelegatedStake?.toLocaleString() })}
              </Typography>
            </>
          }
        >
          <div>
            <Line percent={Capacity} strokeWidth={5} strokeColor={color} />
            <Typography>{capacityText}</Typography>
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

export default getCapacityTable;
