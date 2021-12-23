import React, { memo } from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { getEffectiveStakeInUnits } from '../../util';

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
        {console.log('render')}
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

export default EffectiveStake
