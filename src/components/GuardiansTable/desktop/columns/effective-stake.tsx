import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';

const getEffectiveStakeColumn = (guardiansTableTranslations: any) => {
  return {
    title: (
      <ColumnHeaderWithTooltip
        headerText={guardiansTableTranslations('columnHeader_effectiveStake')}
        tooltipText={[
          [
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_effectiveStakeTitle'),
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_effectiveStakeExplain'),
          ],
          [
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_ifCapacityOverTitle'),
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_ifCapacityOverCalculation'),
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_ifCapacityUnderTitle'),
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_ifCapacityUnderCalculation'),
          ],
          [
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_selfStakeTitle'),
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_selfStakeExplanation'),
          ],
          [
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_delegatedStakeTitle'),
            guardiansTableTranslations('columnHeaderInfo_effectiveStake_delegatedStakeExplanation'),
          ],
        ]}
      />
    ),
    field: 'EffectiveStake',
    render: (guardian) => {
      const { EffectiveStake, SelfStake, DelegatedStake } = guardian;

      const effectiveStakeInUnits =
        EffectiveStake > 1_000_000
          ? `${(EffectiveStake / 1_000_000).toFixed(2).replace(/[.,]00$/, '')} M`
          : `${(EffectiveStake / 1_000).toFixed(2).replace(/[.,]00$/, '')} K`;

      return (
        <Tooltip
          arrow
          title={
            <>
              <Typography>
                {guardiansTableTranslations('message_selfStake')}:{' '}
                {guardiansTableTranslations('xOrbs', { amount: SelfStake?.toLocaleString() })}
              </Typography>

              <Typography>
                {guardiansTableTranslations('message_delegatedStake')}:{' '}
                {guardiansTableTranslations('xOrbs', { amount: DelegatedStake?.toLocaleString() })}
              </Typography>
            </>
          }
        >
          <Typography>{effectiveStakeInUnits}</Typography>
        </Tooltip>
      );
    },
    cellStyle: {
      textAlign: 'center' as const,
    },
    defaultSort: 'desc' as const,
  };
};

export default getEffectiveStakeColumn;
