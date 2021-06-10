import React, { FC } from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { IMobileSection } from '../../interfaces';

const EffectiveStakeSection: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  const { SelfStake, DelegatedStake, EffectiveStake } = guardian;
  const effectiveStakeInUnits =
    EffectiveStake > 1_000_000
      ? `${(EffectiveStake / 1_000_000).toFixed(2).replace(/[.,]00$/, '')} M`
      : `${(EffectiveStake / 1_000).toFixed(2).replace(/[.,]00$/, '')} K`;
  return (
    <div>
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
    </div>
  );
};

export default EffectiveStakeSection;
