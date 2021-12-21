import React from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { getEffectiveStakeInUnits } from '../../util';
import { IGroupedGuardian } from '../../interfaces';

interface IProps {
  translation: any;
  selfStake: number;
  delegatedStake: number;
  effectiveStake: number;
}

function EffectiveStake({ translation, selfStake, delegatedStake, effectiveStake }: IProps) {
  return (
    <Tooltip
      arrow
      title={
        <>
          <Typography>
            {translation('message_selfStake')}: {translation('xOrbs', { amount: selfStake?.toLocaleString() })}
          </Typography>

          <Typography>
            {translation('message_delegatedStake')}:{' '}
            {translation('xOrbs', { amount: delegatedStake?.toLocaleString() })}
          </Typography>
        </>
      }
    >
      <Typography>{getEffectiveStakeInUnits(effectiveStake)}</Typography>
    </Tooltip>
  );
}

export default EffectiveStake;
